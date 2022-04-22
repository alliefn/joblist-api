const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { index, register, login, jobs, job } = require('./middleware');

router.use(bodyParser.json());

router.get('/', index);
router.post('/api/register', register);
router.post('/api/login', login);
router.get('/api/jobs', jobs);
router.get('/api/job/:id', job);

module.exports = router;