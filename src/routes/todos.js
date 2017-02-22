const express = require('express');
const todos = require('./todos');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.json({ users: [{ name: 'Timmy' }] });
});

module.exports = router;
