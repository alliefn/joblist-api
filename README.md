# joblist-api

## How to use
1. `/register`

    - `username`: username
    - `password`: password
    
    Send a POST request to `/register` with the above parameters

2. `/login`
    
        - `username`: username
        - `password`: password

    Send a POST request to `/login` with the above parameters, and get a token

3. `/jobs`

        - `Authorization: Bearer <token>`

    Send a GET request to `/jobs` with the token in the header

## Author
Allief Nuriman