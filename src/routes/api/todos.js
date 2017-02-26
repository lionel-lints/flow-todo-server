const express = require('express');
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

module.exports = router;
