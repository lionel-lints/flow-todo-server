const bcrypt = require('bcryptjs');
const knex = require('./knex');
const tables = require('./tables');
const moment = require('moment');

function createUser(req) {
  const salt = bcrypt.genSaltSync(10);
  const hashed_pass = bcrypt.hashSync(req.body.hashed_password, salt);
  return tables.Users().insert({
    'created_at': moment(), 
    'updated_at': moment(), 
    'first_name': req.body.first_name,
    'last_name': req.body.last_name,
    'hashed_password': hashed_pass,
    'email': req.body.email,
    'github_id': req.body.github_id,
    'avatar_url': req.body.avatar_url,
  })
  .returning('*');
}

module.exports = {
  createUser
};
