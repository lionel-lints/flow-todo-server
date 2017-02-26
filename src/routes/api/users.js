const express = require('express');
const moment = require('moment');
const tables = require('../../db/tables');
const todos = require('./todos.js');

const router = express.Router();

/* GET users. */
router.get('/', (req, res) => {
  tables.Users().then((users) => {
    res.json(users);
  }).catch((error) => {
    console.error(error);
  });
});

/* GET a user. */
router.get('/:id', (req, res, next) => {
  tables.Users().where({ id: req.params.id }).then((user) => {
    res.json(user);
  }).catch((error) => {
    console.error(error);
  });
});

/* POST a new user. */
router.post('/', (req, res, next) => {
  tables.Users().returning([ 'id', 'created_at', 'updated_at', 'first_name', 'last_name', 'email', 'github_id', 'avatar_url'
  ]).insert({
    'created_at': moment(), 
    'updated_at': moment(), 
    'first_name': req.body.first_name,
    'last_name': req.body.last_name,
    'email': req.body.email,
    'github_id': req.body.github_id,
    'avatar_url': req.body.avatar_url,
  }).then((user) => {
    res.status(201).json(user);
  }).catch((error) => {
    console.error(error);
  });
});

/* UPDATE a user. */
router.put('/:id', (req, res, next) => {
  const updatedUser = {};
  const returnArray = ['id', 'updated_at'];
  const keyArray = Object.keys(req.body).filter((key) => {
    return key !== 'id';
  });

  for (const key of keyArray) {
    updatedUser[key] = req.body[key];
    returnArray.push(key);
  }

  updatedUser['updated_at'] = moment();

  /* TO DO: implement req.user and change the line below from params to req.user.id
   * also do: in Knex request update req.body.id to req.user.id */

  if (req.body.id !== Number(req.params.id)) {
    res.status(422).json({ error: 'You cannot update the id field.' });
  } else {
    tables.Users().returning(returnArray).where('id', req.body.id).update(updatedUser).then((returnedUser) => {
      res.json(returnedUser);
    }).catch((error) => {
      console.error(error);
    });
  }
});

/* Delete a user. */
router.delete('/:id', (req, res, next) => {
  tables.Users().where('id', req.params.id).del().then((user) =>{
    res.sendStatus(204);
  }).catch((error) => {
    console.error(error);
  });
});

/* Add the todo resource for a user. */
router.use('/:user_id/todos', todos);

module.exports = router;
