#!/usr/bin/env node

/* eslint-disable no-console */
/* eslint-disable no-process-exit */

const jwt = require('jsonwebtoken')
const fs = require('fs')
const copyPaste = require('copy-paste')
const _ = require('lodash')


if (_.intersection(process.argv, ['help', '-h', '-help', '--h', '--help']).length > 0) {
  console.log(fs.readFileSync(__dirname + '/help.txt').toString())
  process.exit(0)
}

const readCommonFlags = function () {
  const flagValues = {
    tokenType: '',
    payload: {},
    secretKey: '',
    alg: ''
  }

  const indexOfTokenTypeFlag = process.argv.indexOf('--token-type')
  const indexOfSecretKeyFlag = process.argv.indexOf('--secret-key')
  const indexOfAccessKeyFlag = process.argv.indexOf('--access-key')
  const indexOfIssFlag = process.argv.indexOf('--iss') // eslint-disable-line no-unused-vars
  const indexOfNameFlag = process.argv.indexOf('--name') // eslint-disable-line no-unused-vars
  const indexOfEmailFlag = process.argv.indexOf('--email') // eslint-disable-line no-unused-vars
  const indexOfBase64Flag = process.argv.indexOf('-base64') // eslint-disable-line no-unused-vars
  const indexOfAlgFlag = process.argv.indexOf('-a')

  //check for a secret
  if (
    indexOfTokenTypeFlag < 0 ||
    (
      process.argv[indexOfTokenTypeFlag + 1] !== "key" &&
      process.argv[indexOfTokenTypeFlag + 1] !== "user"
    )
  ) {
    console.error('Please specify a --token-type of either "key" or "user"')
    process.exit(0)
  } else {
    flagValues.tokenType = process.argv[indexOfTokenTypeFlag + 1]
  }

  if (flagValues.tokenType === "key") {
    if (indexOfAccessKeyFlag < 0) {
      console.error('Please provide an --access-key like "--access-key fiutyiuytiuyt4876587r")')
      process.exit(0)
    } else {
      flagValues.payload.iss = process.argv[indexOfAccessKeyFlag + 1]
    }
  }

  if (flagValues.tokenType === "user") {
    if (indexOfNameFlag < 0) {
      console.error('Please provide a --name (first and last, like "--name Developer One") for this user person')
      process.exit(0)
    } else {
      flagValues.payload.name = `${process.argv[indexOfNameFlag + 1]} ${process.argv[indexOfNameFlag + 2]}`
    }
    if (indexOfEmailFlag < 0) {
      console.error('Please provide an --email for the user person')
      process.exit(0)
    } else {
      flagValues.payload.email = process.argv[indexOfEmailFlag + 1]
      flagValues.payload.email_verified = "true"
    }
    flagValues.payload.iss = 'https://blinkmobile.auth0.com/'
  }

  if (indexOfSecretKeyFlag < 0) {
    console.error('Please provide a --secret-key  for signing the JWT (like, "--secret-key FRnyvFWszFFyb2CzFHwTJLhE592Mxc5rHVTbbSYQ6gQzHaT28r33b2mId8QP53Gl")')
    process.exit(0)
  } else {
    if (indexOfBase64Flag >= 0) {
      flagValues.secretKey = Buffer.from(process.argv[indexOfSecretKeyFlag + 1], 'base64')

    } else {
      flagValues.secretKey = process.argv[indexOfSecretKeyFlag + 1]
    }
  }

  if (indexOfIssFlag < 0) {
    console.error('Please provide a --iss ("issuer") for validating the JWT (like, "--iss https://blinkmobile.auth0.com/")')
    process.exit(0)
  } else {
    flagValues.payload.iss = process.argv[indexOfIssFlag + 1]
  }

  flagValues.payload.exp = Date.now() + 100000000 // expires in 100000 seconds

  //set algorithm. HS256 is default
  flagValues.alg = indexOfAlgFlag >= 0 ? process.argv[indexOfAlgFlag + 1] : 'HS256'

  return flagValues
}

const flagValues = readCommonFlags()
flagValues.payload.iat = Date.now()

// console.log('Signing jwt with payload: ')
// console.log(flagValues.payload)

const signedJWT = jwt.sign(flagValues.payload, flagValues.secretKey, {algorithm: flagValues.alg})
console.log(signedJWT)
copyPaste.copy(signedJWT)

