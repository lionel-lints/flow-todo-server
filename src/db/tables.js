const knex = require('./knex');

function Users() {
  return knex('users');
}

function Todo() {
  return knex('todo');
}

function Evaluation() {
  return knex('evaluation');
}

function Tag() {
  return knex('tag');
}

function TodoTag() {
  return knex('todo_tag');
}

module.exports = {
  Users,
  Todo,
  Evaluation,
  Tag,
  TodoTag
};

