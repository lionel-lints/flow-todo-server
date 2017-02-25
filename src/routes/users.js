const express = require('express');
const tables = require('../db/tables');
const todos = require('./todos.js');

const router = express.Router();

/* GET users. */
router.get('/', (req, res) => {
  tables.Users().then((users) => {
    res.json(users);
  });
});

/* GET a user. */
router.get('/:id', (req, res, next) => {
  tables.Users().where({ id: req.params.id }).then((user) => {
    res.json(user);
  });
});

/* POST a new user. */
router.post('/', (req, res, next) => {
  // Post a user.
});

/* UPDATE a user. */
router.put('/:id', (req, res, next) => {
  // Update a user here.
});

/* Delete a user. */
router.delete('/:id', (req, res, next) => {
  // Delete a user account here.
});

/* Add the todo resource for a user*/
router.use(':id/todos', todos);

module.exports = router;
