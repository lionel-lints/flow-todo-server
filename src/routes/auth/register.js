const express = require('express');
const router = express.Router();

const localAuth = require('./local');
const { createUser } = require('../../db/helpers');
router.post('/', (req, res, next)  => {
  return createUser(req)
    .then((user) => { 
      return localAuth.encodeToken(user[0]); 
    }).then((token) => {
    res.status(200).json({
      status: 'success',
      token: token
    });
  })
  .catch((err) => {
    res.status(500).json({
      status: 'error'
    });
  });
});

module.exports = router;
