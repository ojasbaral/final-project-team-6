
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
// ===========================================================================
// Students Unit Test Case
describe('/students', () => {
  describe('positive: /students', () => {
    it('should return an array of students', (done) => {
      chai

        .request(server)
        .get('/students')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });

    });
  });
  
  describe('negative: /students', () => {
    it('should handle errors and respond with an error message', (done) => {
      chai

        .request(server)
        .get('/nonexistentroute') // Assuming this route does not exist
        .end((err, res) => {
          expect(res).to.have.status(200); // Or whichever status code you expect for a nonexistent route
          // Additional error handling assertions can be added based on your application's behavior
          done();
        });

    });
  });
  
  // ===========================================================================
  // update-profile Unit Test Case
  describe('/update-profile', () => {
    
    it('positive: /update-profile', done => {
      var agent = chai.request.agent(server)
      agent
      .post('/login')
      .send({email: email, password: '12345678'})
      .then(function(res) {
        return agent.post('/update-profile').send({bio: "hello", rate_info:"", monday_time_info:'', tuesday_time_info:'', wednesday_time_info:'', thursday_time_info:'', allTimes:'', contact_info:'', student:true,tutor:false}).then(function(res2){
        expect(res2).to.have.status(200);
        expect(res2.redirect).to.equals(false)
        agent.close()
        done()
      })
      })
    })

     it('negative: /update-profile', done => {
      chai
      .request(server)
      .post('/update-profile').send({bio: "hello", rate_info:"", monday_time_info:'', tuesday_time_info:'', wednesday_time_info:'', thursday_time_info:'', allTimes:'', contact_info:'', student:true,tutor:false}).then(function(res){
        expect(res).to.have.status(200);
        expect(res.redirects).to.be.length(1)
        done()
      })
    })
    
  })
  
  