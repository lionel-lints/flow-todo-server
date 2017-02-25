const express = require('express');
const moment = require('moment');
const tables = require('../../db/tables');
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
  tables.Users().returning([ 'id', 'created_at', 'updated_at', 'first_name', 'last_name', 'email', 'github_id', 'avatar_url'
  ]).insert({
    'created_at': moment(), 
    'updated_at': moment(), 
    "first_name": req.body.first_name,
    "last_name": req.body.last_name,
    "email": req.body.email,
    "github_id": req.body.github_id,
    "avatar_url": req.body.avatar_url,
  }).then((user) => {
    res.status(201).json(user);
  });
});

/* UPDATE a user. */
router.put('/:id', (req, res, next) => {
  // Update a user here.
});

/* Delete a user. */
router.delete('/:id', (req, res, next) => {
  tables.Users().where('id', req.params.id).del().then((user) =>{
    res.sendStatus(204);
  });
});

/* Add the todo resource for a user*/
router.use(':user_id/todos', todos);

module.exports = router;
