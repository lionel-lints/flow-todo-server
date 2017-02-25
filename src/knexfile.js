module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/flow_todos',
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
};
