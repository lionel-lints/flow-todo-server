const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/flow_todos',
  },
  test: {
    client: 'pg',
    connection: {
      database: 'flow_todos_test',
    },
    migrations: {
      directory: path.join(__dirname, '../db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '../db/seeds'),
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
};
