const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');

const routes = require('./routes/index.js');

const app = express();

/* Middleware */
require('dotenv').config({path: '../.env'});

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
  methods: ['GET','PUT','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type']
}));

/* Router */
app.use('/', routes);

/* catch 404 and forward to error handler */
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
