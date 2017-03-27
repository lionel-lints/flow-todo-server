const express = require('express');

const moment = require('moment');
const jwt = require('jsonwebtoken');

const {encodeToken, decodeToken} = require('./local');
const { createUser } = require('../../db/helpers');

const register = require('./register');

const router = express.Router();

router.use('/register', register);

module.exports = { 
  decodeToken, 
  encodeToken,
  router
};
