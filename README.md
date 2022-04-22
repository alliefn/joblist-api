# joblist-api

## What to prepare
Make sure to create .env file in the root directory of the project.

The contents of the .env file should look like this:
`DATABASE_URL=postgres://user:password@host:port/database`

Don't forget to `npm install`, then you can run the server with `npm start`.

## How to use
1. `/register`

        username: username
        password: password
    
    Send a POST request to `/register` with the above parameters (Use JSON format).

2. `/login`
    
        username: username
        password: password

    Send a POST request to `/login` with the above parameters, and get a token (Use JSON format).

3. `/jobs`

        Authorization: Bearer <token>

    Send a GET request to `/jobs` with the token in the header

## Author
Allief Nuriman