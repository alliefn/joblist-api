# joblist-api

## What to prepare
Make sure to create .env file in the root directory of the project.

The contents of the .env file should look like this:

`DATABASE_URL=postgres://user:password@host:port/database`

I recommend you to create the database and prepare the database with the createdb.sql file.

Don't forget to `npm install`, then you can run the server with `npm start`.

## How to use
1. `/api/register`

        username: username
        password: password
    
    Send a POST request to `/api/register` with the above parameters (Use JSON format).

2. `/api/login`
    
        username: username
        password: password

    Send a POST request to `/api/login` with the above parameters, and get a token (Use JSON format). Note that your token will be valid for 30 minutes only.

3. `/api/jobs`

        Authorization: Bearer <token>

    Send a GET request to `/jobs` with the token in the header.
    There can be 4 parameters:
        - `page`: the page number, each page contains 5 jobs
        - `description`: job description
        - `full_time`: can be `true` or `false`
        - `location`: job location

4. `/api/jobs/:id`

        Authorization: Bearer <token>

    Send a GET request to `/jobs/:id` with the token in the header.
    It will return the job details with the given id.

## Author
Allief Nuriman