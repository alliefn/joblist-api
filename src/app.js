const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const pgp = require('pg-promise')();
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Use body-parser to parse JSON
app.use(bodyParser.json());

// Connect to the database
const db = pgp(process.env.DATABASE_URL);

console.log('Connected to the database');

// Default route
app.get('/', function(req, res) {
    res.send("<h1>Welcome to the API.</h1>");
});

app.post('/api/register', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // hash the password
    let hashedPassword = bcrypt.hashSync(password, 8);

    // insert the user into the database
    db.none('INSERT INTO users(username, password) VALUES($1, $2)', [username, hashedPassword]);
    // Send status and message in JSON
    res.json({
        status: 200,
        message: 'User registered'
    });

});

app.post('/api/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    
    // get the user from the database
    db.one('SELECT * FROM users WHERE username = $1', [username])
        .then(function(user) {
            // compare the password
            if (bcrypt.compareSync(password, user.password)) {
                // send the user object
                // Create JWT token
                let token = jwt.sign({
                    username: user.username,
                    id: user.id
                }, 'secret', {
                    expiresIn: 1800
                });
                res.json({
                    status: 200,
                    message: 'User logged in',
                    token: token
                });
            } else {
                res.json({
                    status: 401,
                    message: 'Incorrect password'
                });
            }
        })
        .catch(function(error) {
            res.json({
                status: 401,
                message: 'User not found'
            });
        });
});

app.get('/api/jobs', function(req, res) {
    // Verify the JWT token, its "Bearer " followed by the token
    let token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        res.json({
            status: 401,
            message: 'No token provided'
        });
    } else {
        jwt.verify(token, 'secret', function(error, decoded) {
            if (error) {
                res.json({
                    status: 401,
                    message: 'Invalid token'
                });
            }
        });
    }
    const description = req.query.description || '%';
    const location = req.query.location || '%';
    const full_time = req.query.full_time === 'true';
    console.log(full_time);
    axios.get('http://dev3.dansmultipro.co.id/api/recruitment/positions.json')
        .then(function(response) {
            // Filter the jobs that include the location
            let jobs = response.data.filter(function(job) {
                return job.location.toLowerCase().includes(location.toLowerCase());
            });
            jobs = jobs.filter(function(job) {
                return job.description.toLowerCase().includes(description.toLowerCase());
            });
            jobs = jobs.filter(function(job) {
                // Filter the jobs in which the type is 'Full Time'
                if (full_time) {
                    return job.type.toLowerCase().includes('full time');
                }
            });
            res.send({
                status: 200,
                message: 'Jobs retrieved',
                data: jobs
            })
        })
        .catch(function(error) {
            res.json(error);
        });
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});