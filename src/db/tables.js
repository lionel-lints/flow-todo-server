const knex = require('./knex');

function Users() {
  return knex('users');
}

function Todos() {
  return knex('todos');
}

function Evaluations() {
  return knex('evaluations');
}

function Tags() {
  return knex('tags');
}

function TodosTags() {
  return knex('todos_tags');
}

module.exports = {
  Users,
  Todos,
  Evaluations,
  Tags,
  TodosTags,
};

