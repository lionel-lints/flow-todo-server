const express = require('express');
const tables = require('../../db/tables');

const router = express.Router();

/* GET todos listing. */
router.get('/', (req, res) => {
  tables.Users(id).then((user) => {
    res.json(user);
  });
});


module.exports = router;
