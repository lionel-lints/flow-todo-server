const express = require('express');
const auth = require('./auth/index.js');
const api = require('./api/index.js');
const users = require('./users.js');

const router = express.Router();

router.use('/users', users);

module.exports = router;
