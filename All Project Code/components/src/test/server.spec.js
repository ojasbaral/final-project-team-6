
// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

//setting up random email for testing
const tempInt = Math.floor(Math.random() * (1000000 - 1 + 1)) + 1;
const email = `${tempInt}@gmail.com`

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });

  // ===========================================================================
  // Register Unit Test Case
  describe('/register', () => {
    it('positive : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({email: email, password: '12345678'})
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(302);
        expect(res.redirect).to.equals(true);
        done();
      });
  });

    it('negative : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({email: 'john.doe@example.com', password: '12345678'})
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.redirect).to.equals(false);
        done();
      });
  });
  })

  // ===========================================================================
  // Students Unit Test Case
  describe('/students', () => {
    describe('positive: /students', () => {
      it('should return an array of students', (done) => {
        chai
          .request(app)
          .get('/students')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          });
      });
    });
  
    describe('negative: /students', () => {
      it('should handle errors and respond with an error message', (done) => {
        chai
          .request(app)
          .get('/nonexistentroute') // Assuming this route does not exist
          .end((err, res) => {
            expect(res).to.have.status(404); // Or whichever status code you expect for a nonexistent route
            // Additional error handling assertions can be added based on your application's behavior
            done();
          });
      });
    });
  });

  // ===========================================================================
  // TO-DO: Part A Login unit test case
  describe('/login', () => {
    it('positive : /login', done => {
    chai
      .request(server)
      .post('/login')
      .send({email: email, password: '12345678'})
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(302);
        expect(res.redirect).to.equals(true);
        done();
      });
  });

    it('negative : /login', done => {
    chai
      .request(server)
      .post('/login')
      .send({email: 'john.doe@example.com', password: '12345678'})
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.redirect).to.equals(false);
        done();
      });
  });
  })
});
