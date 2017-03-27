const request = require('supertest');
const chai =  require('chai');
const subset = require('chai-subset');
const knex = require('../../src/db/knex');
const tables = require('../../src/db/tables');
const app = require('../../src/app');
const localAuth = require('../../src/routes/auth/local');

chai.use(subset);
const expect = chai.expect;

describe('authenticated routes', () => {

  beforeEach(() => {
    return knex.migrate.rollback({ directory: '../db/migrations' }).then(() => {
      return knex.migrate.latest({ directory: '../db/migrations' }).then(() => {
        return knex.seed.run({ directory: '../db/seeds' }).then(() => { return 0; });
      });
    });
  });

  afterEach(() => {
    knex(() => { 
      return knex.migrate.rollback({ directory: '../db/migrations' }).then(() => {
        return 0;
      });
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user', (done) => {
      request(app)
      .post('/auth/register')
      .send({
        first_name:"testUser",
        last_name:"lastTest",
        github_id:"506571",
        hashed_password: "there are things I remember, though I don't remember these",
        avatar_url:"https://avatars.githubusercontent.com/u/5067571?v=3",
        email:"adam.someone@example.com"
      })
      .end((err, res) => {
        expect(res).to.be.json;
        expect(res.status).to.equal(200);
        expect(res.body).to.include.keys('status', 'token');
        done();
      });
    });
  });

});
