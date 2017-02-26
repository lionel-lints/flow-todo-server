const request = require('supertest');
const chai =  require('chai');
const subset = require('chai-subset');
const knex = require('../src/db/knex');
const tables = require('../src/db/tables');
const app = require('../src/app');

chai.use(subset);
const expect = chai.expect;

describe('todo api routes', () => {
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

  describe('GET /api/v1/users/:user_id/todos', () => {
    it('responds with a JSON array of a user\'s todos', (done) => {
      request(app)
        .get('/api/v1/users/1/todos')
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.be.json;
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(4);
          expect(res.body).to.containSubset([{ 
            id: 1,
            created_at: null,
            updated_at: null,
            user_id: 1,
            title: 'clean kitchen',
            description: 'mop the kitchen, sweep the floor.',
            due_at: null,
            complete: true 
          }]);
          expect(res.body).to.containSubset([{
            id: 2,
            created_at: null,
            updated_at: null,
            user_id: 1,
            title: 'contact emily',
            description: 'email or call her and ask her about the trial outcome thus far.',
            due_at: null,
            complete: false 
          }]);
          expect(res.body).to.containSubset([{
            id: 3,
            created_at: null,
            updated_at: null,
            user_id: 1,
            title: 'update resume',
            description: 'go over my skills and update them on my resume',
            due_at: null,
            complete: true 
          }]);
          expect(res.body).to.containSubset([{
            id: 10,
            created_at: null,
            updated_at: null,
            user_id: 1,
            title: '',
            description: '',
            due_at: null,
            complete: true 
          }]);
          done();
        });
    });
  });

  describe('GET /api/v1/users/:user_id/todos/:id', () => {
    it('responds with JSON of a user\'s id', (done) => {
      request(app)
        .get('/api/v1/users/2/todos/4')
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.be.json;
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(1);
          expect(res.body).to.containSubset([{
            id: 4,
            user_id: 2,
            title: 'call mom',
            description: '',
            complete: false
          }]);
        });
      request(app)
        .get('/api/v1/users/2/todos/5')
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.be.json;
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(1);
          expect(res.body).to.containSubset([{
            id: 5,
            user_id: 2,
            title: 'respond to emails',
            description: 'make sure to clear out junk mail',
            complete: true
          }]);
        });
      request(app)
        .get('/api/v1/users/2/todos/6')
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.be.json;
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(1);
          expect(res.body).to.containSubset([{
            id: 6,
            user_id: 2,
            title: 'work on novel',
            description: 'chapter 2 needs revision',
            complete: false
          }]);
          done();
        });
    });
  });

  describe('POST /api/v1/users/:user_id/todos', () => {
    it('creates a new todo for a user', (done) => {
      request(app)
        .post('/api/v1/users/3/todos')
        .send({ 
          user_id: 3,
          title: 'work on new song',
          description: 'third verse needs revision',
          complete: false
        })
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.containSubset([{
            user_id: 3,
            title: 'work on new song',
            description: 'third verse needs revision',
            complete: false
          }]);
          done();
        })
    });
  });

  describe('PUT /api/v1/users/:user_id/todos/:id', () => {
    it('responds with todo id and updated JSON columns', (done) => {
      request(app)
        .put('/api/v1/users/1/todos/2')
        .send({
          id: 2,
          user_id: 1,
          title: 'no longer contact emily',
          description: 'complete!',
          complete: true 
         })
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.be.json;
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(1);
          expect(res.body[0]).to.be.a('object');
          expect(res.body).to.containSubset([{
            id: 2,
            user_id: 1,
            title: 'no longer contact emily',
            description: 'complete!',
            complete: true 
          }]);
          done();
        });
    });

    it('does not allow update of ID or the user ID', (done) => {
      request(app)
        .put('/api/v1/users/1/todos/2')
        .send({
          id: 6,
          user_id: 1,
          title: 'no longer contact emily',
          description: 'complete!',
          complete: true 
         })
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(422);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('error');
          expect(res.body['error']).to.equal('You cannot update the id field.');
          if (err) return done(err);
          done();      
        });
      request(app)
        .put('/api/v1/users/1/todos/2')
        .send({
          id: 2,
          user_id: 2,
          title: 'no longer contact emily',
          description: 'complete!',
          complete: true 
         })
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(422);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('error');
          expect(res.body['error']).to.equal('You cannot update the user id field.');
          if (err) return done(err);
          done();      
        });
    });
  });

  describe('DELETE /api/v1/users/:user_id/todos/:id', () => {
    it('deletes the user\'s specified todo, and returns 204(success, no content)', (done) => {
      request(app)
        .del('/api/v1/users/2/todos/4')
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          request(app)
            .get('/api/v1/users/2/todos')
            .end(function(err, res) {
              if (err) return done(err);
              expect(res).to.be.json;
              expect(res.status).to.equal(200);
              expect(res.body).to.be.a('array');
              expect(res.body.length).to.equal(2);
              expect(res.body).to.not.containSubset([{
                id: 4,
                user_id: 2,
                title: 'call mom',
                description: '',
                complete: false
              }]);
              expect(res.body).to.containSubset([{
                id: 5,
                user_id: 2,
                title: 'respond to emails',
                description: 'make sure to clear out junk mail',
                complete: true
              }]);
              expect(res.body).to.containSubset([{
                id: 6,
                user_id: 2,
                title: 'work on novel',
                description: 'chapter 2 needs revision',
                complete: false
              }]);
              done();
            });
        });
    });
  });
});
