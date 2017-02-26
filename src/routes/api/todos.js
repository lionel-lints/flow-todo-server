const express = require('express');
const moment = require('moment');
const tables = require('../../db/tables');

const router = express.Router({mergeParams: true});

/* GET todos listing for a user. */
router.get('/', (req, res) => {
  tables.Todos().where({ user_id: req.params.user_id }).then((todos) =>{
    res.json(todos);
  }).catch((error) => {
    console.error(error);
  });
});

/* GET a todo for a user. */
router.get('/:id', (req, res) => {
  tables.Todos().where({ user_id: req.params.user_id }).where({ id: req.params.id }).then((todo) =>{
    res.json(todo);
  }).catch((error) => {
    console.error(error);
  });
});

/* POST a new todo for a user. */
router.post('/', (req, res, next) => {
  const userID = req.params.user_id;
  // TO DO: check that user who creates task is current user.
  tables.Todos().returning([ 'id', 'created_at', 'updated_at', 'title', 'description', 'user_id', 'due_at', 'complete'
  ]).insert({
    'created_at': moment(), 
    'updated_at': moment(), 
    'user_id': userID,
    'title': req.body.title,
    'description': req.body.description,
    'due_at': req.body.due_at,
    'complete': false
  }).then((todo) => {
    res.status(201).json(todo);
  }).catch((error) => {
    console.error(error);
  });
});

/* UPDATE a user's todo. */
router.put('/:id', (req, res, next) => {
  // Update a todo here.
  const updatedTodo = {};
  const returnArray = ['id', 'user_id', 'updated_at'];
  const keyArray = Object.keys(req.body).filter((key) => {
    if (key === 'id' || key === 'user_id') {
      return false;
    } else {
      return true;
    }
  });

  for (const key of keyArray) {
    updatedTodo[key] = req.body[key];
    returnArray.push(key);
  }

  updatedTodo['updated_at'] = moment();

  /* TO DO: implement req.user and change the line below from params to req.user.id
   * also do: in Knex request update req.body.id to req.user.id */

  if (req.body.id !== Number(req.params.id)) {
    res.status(422).json({ error: 'You cannot update the id field.' });
  } else if (req.body.user_id !== Number(req.params.user_id)) {
    res.status(422).json({ error: 'You cannot update the user_id field.' });
  } else {
    tables.Todos().returning(returnArray).where('id', req.body.id).update(updatedTodo).then((returnedTodo) => {
      res.json(returnedTodo);
    }).catch((error) => {
      console.error(error);
    });
  }
});

/* Delete a user's todo. */
router.delete('/:id', (req, res, next) => {
   const userID = req.params.user_id;
  // TO DO: check that user who creates task is current user.

  tables.Todos().where('id', req.params.id).del().then((user) =>{
    res.sendStatus(204);
  }).catch((error) => {
    console.error(error);
  });
});
module.exports = router;
