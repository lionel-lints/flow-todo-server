const express = require('express');

const moment = require('moment');
const jwt = require('jsonwebtoken');

const { 
  checkTokenSetUser,
  decodeToken, 
  encodeToken, 
  getTokenFromHeader, 
  loggedIn,
  verifyJWT 
} = require('./local');

const router = express.Router();

module.exports = { 
  checkTokenSetUser,
  decodeToken, 
  encodeToken, 
  getTokenFromHeader, 
  loggedIn,
  router,
  verifyJWT 
};
