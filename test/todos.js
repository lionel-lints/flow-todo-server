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

  xdescribe('POST /api/v1/users', () => {
    it('creates a new todo for a user', (done) => {
      request(app)
        .post('/api/v1/users')
        .send({ 
          first_name:"testUser",
          last_name:"lastTest",
          github_id:"506571",
          avatar_url:"https://avatars.githubusercontent.com/u/5067571?v=3",
          email:"adam.someone@example.com"
        })
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.containSubset([{
            id: 5,
            user_id: 2,
            title: 'respond to emails',
            description: 'make sure to clear out junk mail',
            due_at: new Date().now,
            complete: true
          }]);
          done();
        })
    });
  });

  xdescribe('PUT /api/v1/users/:id', () => {
    it('responds with todo id and updated JSON columns', (done) => {
      request(app)
        .put('/api/v1/users/1')
        .send({ 
           id:1,
           first_name:"newTestUser",
           last_name:"PUTlastTest",
           github_id:"33506571",
           avatar_url:"https://avatars.githubusercontent.com/u/335067571?v=3",
           email:"newguy.someone@example.com"
         })
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.be.json;
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(1);
          expect(res.body[0]).to.be.a('object');
          expect(res.body[0]).to.containSubset({ 
           first_name:"newTestUser",
           last_name:"PUTlastTest",
           github_id:"33506571",
           avatar_url:"https://avatars.githubusercontent.com/u/335067571?v=3",
          });
          done();
        });
    });

    it('does not allow update of ID', (done) => {
      request(app)        
        .put('/api/v1/users/2')
        .send({ 
          id: 11,
          first_name:"newTestUser",
          last_name:"PUTlastTest",
          github_id:"33506571",
          avatar_url:"https://avatars.githubusercontent.com/u/335067571?v=3",
          email:"newguy.someone@example.com"
         })
        .end(function(err, res) {
          expect(res.status).to.equal(422);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('error');
          expect(res.body['error']).to.equal('You cannot update the id field.');
          if (err) return done(err);
          done();      
        });
    });
  });

  xdescribe('DELETE /api/v1/users/:user_id/todos/:id', () => {
    it('deletes the user\'s specified todo, and returns 204(success, no content)', (done) => {
      request(app)
        .del('/api/v1/users/2')
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          request(app)
            .get('/api/v1/users')
            .end(function(err, res) {
              if (err) return done(err);
              expect(res).to.be.json;
              expect(res.status).to.equal(200);
              expect(res.body).to.be.a('array');
              expect(res.body.length).to.equal(3);
              expect(res.body).to.containSubset([{
                id: 3,
                first_name: 'Chris',
                last_name: 'Burkhart',
                github_id: '53454',
                avatar_url: 'https://avatars.githubusercontent.com/u/53454?v=3',
                email: 'chris@example.com'
              }]);
              expect(res.body).to.containSubset([{
                id: 1,
                first_name: 'CJ',
                last_name: 'Reynolds',
                github_id: '14241866',
                avatar_url: 'https://avatars.githubusercontent.com/u/14241866?v=3',
                email: 'cj@example.com' 
              }]);
              expect(res.body).to.containSubset([{
                id: 4,
                first_name: 'Adam',
                last_name: 'Lichty',
                github_id: '5067571',
                avatar_url: 'https://avatars.githubusercontent.com/u/5067571?v=3',
                email: 'adam@example.com' 
              }]);
              expect(res.body).to.not.containSubset([{
                id: 2,
                first_name: 'Lionel',
                last_name: 'Lints',
                github_id: '13045341',
                avatar_url: 'https://avatars.githubusercontent.com/u/13045341?v=3',
                email: 'lionel@example.com',
              }]);
              done();
            });
        });
    });
  });
});
