const bcrypt = require('bcryptjs');
const pgp = require('pg-promise')();
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();
const db = pgp(process.env.DATABASE_URL);

function index(req, res) {
    res.send("<h1>Welcome to the API.</h1>");
}

function register(req, res) {

    // Check if username is alpha numeric
    if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
        res.status(400).send({
            error: "Username must be alphanumeric."
        });
        return;
    }
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

}

function login(req, res) {

    // Check if username is alpha numeric
    if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
        res.status(400).send({
            error: "Username must be alphanumeric."
        });
        return;
    }
    
    const username = req.body.username;
    const password = req.body.password;

    // get the user from the database
    db.one('SELECT * FROM users WHERE username = $1', [username])
        .then(function (user) {
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
        .catch(function (error) {
            res.json({
                status: 401,
                message: 'User not found'
            });
        });
}

function jobs(req, res) {
    // Verify the JWT token, its "Bearer " followed by the token
    let token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        res.json({
            status: 401,
            message: 'No token provided'
        });
    } else {
        jwt.verify(token, 'secret', function (error, decoded) {
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
    const page = req.query.page || -1;
    axios.get('http://dev3.dansmultipro.co.id/api/recruitment/positions.json')
        .then(function (response) {
            let jobs = response.data;
            // Only take these columns: id, title, description, location, full_time
            jobs = jobs.map(function (job) {
                return {
                    id: job.id,
                    title: job.title,
                    company: job.company,
                    description: job.description,
                    location: job.location,
                    full_time: job.full_time
                };
            });
            // Filter the jobs that include the location
            if (location !== '%') {
                jobs = jobs.filter(function (job) {
                    return job.location.toLowerCase().includes(location.toLowerCase());
                });
            }
            if (description !== '%') {
                jobs = jobs.filter(function (job) {
                    return job.description.toLowerCase().includes(description.toLowerCase());
                });
            }
            jobs = jobs.filter(function (job) {
                // Filter the jobs in which the type is 'Full Time'
                if (full_time) {
                    return job.type.toLowerCase().includes('full time');
                } else {
                    return true;
                }
            });
            let pagesJobs = [];
            if (page > 0) {
                // Paginate the jobs by 5
                let start = (page - 1) * 5;
                // if start is greater than the length of the jobs array, return an empty array
                if (start > jobs.length) {
                    res.send({
                        status: 200,
                        message: 'No jobs found',
                    })
                }
                let end = start + 5;
                // if end is greater than the length of the jobs array, set it to the length of the array
                if (end > jobs.length) {
                    end = jobs.length;
                }
                pagesJobs = jobs.slice(start, end);
                res.send({
                    status: 200,
                    message: 'Jobs retrieved',
                    totalJobs: pagesJobs.length,
                    data: pagesJobs
                })
            } else {
                pagesJobs.push(jobs);
                res.send({
                    status: 200,
                    message: 'Jobs retrieved',
                    totalJobs: jobs.length,
                    data: pagesJobs
                })
            }
        })
        .catch(function (error) {
            res.json(error);
        });
}

function job(req, res) {
    // Verify the JWT token, its "Bearer " followed by the token
    let token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        res.json({
            status: 401,
            message: 'No token provided'
        });
    } else {
        jwt.verify(token, 'secret', function (error, decoded) {
            if (error) {
                res.json({
                    status: 401,
                    message: 'Invalid token'
                });
            }
        });
    }
    // Take the id from the url
    const id = req.params.id;
    axios.get('http://dev3.dansmultipro.co.id/api/recruitment/positions/' + id)
        .then(function (response) {
            res.send({
                status: 200,
                message: 'Job retrieved',
                data: response.data
            })
        })
        .catch(function (error) {
            res.json(error);
        });
}

module.exports = {
    index: index,
    register: register,
    login: login,
    jobs: jobs,
    job: job
};