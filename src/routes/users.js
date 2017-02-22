const express = require('express');
const tables = require('../db/tables');

const router = express.Router();

/* GET users. */
router.get('/', (req, res) => {
  tables.Users().then(users => {
    res.json(users);
  });
});

/* GET a user. */
router.get('/:id', (req, res, next) => {
  //get a user.
});

/* POST a new user. */
router.post('/', (req, res, next) => {
  //post a user.
});

/* UPDATE a user. */
router.put('/:id', (req, res, next) => {
  // update a user here.
});

/* Delete a user. */
router.delete('/:id', (req, res, next) => {
  // delete a user account here.
});

module.exports = router;
