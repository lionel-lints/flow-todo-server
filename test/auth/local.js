const request = require('supertest');
const chai =  require('chai');
const subset = require('chai-subset');
const knex = require('../../src/db/knex');
const tables = require('../../src/db/tables');
const app = require('../../src/app');
const localAuth = require('../../src/routes/auth/local');

chai.use(subset);
const expect = chai.expect;

describe('local auth functions', () => {

  describe('encodeToken()', () => {
    it('responds with a token', (done) => {
      const results = localAuth.encodeToken({id: 1});
      expect(results).to.be.a('string');
      done();
    });
  });

  describe('decodeToken()', () => {
    it('should return a payload', (done) => {
      const token = localAuth.encodeToken({id: 1});
      expect(token).to.be.a('string');
      localAuth.decodeToken(token, (err, res) => {
        expect(res.sub).to.equal(1);
        done();
      });
    });
  });
});
