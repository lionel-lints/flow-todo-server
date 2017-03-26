const express = require('express');
const users = require('./users.js');

const moment = require('moment');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use('/users', users);

module.exports = router;
