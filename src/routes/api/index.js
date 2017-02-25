const express = require('express');
const users = require('./users.js');

const router = express.Router();

router.use('/users', users);

module.exports = router;
