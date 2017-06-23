# jwt-encoder-cli

## Flags

### required:

```sh
  --token-type <key|user>
```

If --token-type is "key":

```sh
  -access-key <access_key>
```

If --token-type is "user":

```sh
  --iss <issuer>
  ```
...for validating the JWT (like, "--iss https://blinkmobile.auth0.com/")

```sh
  --name <first last>
```

```sh
  --email <email>
```

optional:

```sh
-a <algorithm> (defaults to 'HS256')
-base64 (Base64 encode the secret key)
```

## A key for Simple Auth

```sh
jwt-encoder --token-type user --name Kynan Hughes --email kynan@blinkmobile.com.au --secret-key FRnyvFWszFFyb2CzFHwTJLhE592Mxc5rHVTbbSYQ6gQzHaT28r33b2mId8QP53Gl --iss https://blinkmobile.auth0.com/ -base64
```
