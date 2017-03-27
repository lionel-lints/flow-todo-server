const bcrypt = require('bcryptjs');
const knex = require('../db/connection');
const tables = require('./tables');

function createUser(req) {
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(req.body.password, salt);
  return tables.Users().insert({
    'created_at': moment(), 
    'updated_at': moment(), 
    'first_name': req.body.first_name,
    'last_name': req.body.last_name,
    'hashed_password': req.body.hashed_password,
    'email': req.body.email,
    'github_id': req.body.github_id,
    'avatar_url': req.body.avatar_url,
  })
  .returning('*');
}

module.exports = {
  createUser
};
