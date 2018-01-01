const chai  = require('chai');
    mocha = require('mocha');
    chaiHttp = require('chai-http');
    server = require('./server');
    should = chai.should();
    xToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImpreV8wdlhXRGRqMURGY0xtSUdiUGhCTDRIIn0.eyJpYXQiOjE1MTQ3NjY0MzYsImV4cCI6MTUxNDc4ODAzNiwidWlkIjoidXNyXzB2WFhGckFtcGpTV1hucjduMngybTgiLCJ1biI6InQ2cjZsNUBnbWFpbC5jb20iLCJmbiI6IlRob21hcyIsImxuIjoiTGFpcmQiLCJuIjoiVGhvbWFzIExhaXJkIiwidGsiOiJrc3NfMHZYbFpWVUtFUWVCOWNWNmViSlMweiJ9.rWS5OBxyKvBcbWFwq40KGSf-6FjXDCSl4VShIszpbi-jZI5oR3gqcreOmggiJvnB6VXXJAaVugcyIfLuXQlkQ3HhKlwZU26SYe1mJeszg1TRf_yPKERaJQVuh7PO2Dt0x0NAnZOFErsn1iajmQBPLkxEDchqmPmkX-Zer9Ra2th_Lu8-TlYFbGuQgtsq6hB180tGFpeIJE_SkuWV3WdTPicqS83k8EIKedbJjGIAu0gpoR50rUiSt_H_Q6GsE6Iq-mGoqdNc_XfPbYNfqzdlxt5IfhxhL72AyBBzubIHueJqBw1y4QzF7QqL8n-XF0hHJuyvzSFUT5cpDVvwL2pbsQ";
  
chai.use(chaiHttp);


describe('user routes', () => {
  it('should fetch the current user', () => {
    return chai.request(server)
      .get('/api/v1/users')
      .set('x-token', xToken)
      .then(response => {
        response.should.have.status(200);
        response.body[0].should.have.property('user_id');
        response.body[0].user_id.should.deep.equal(65);
        response.body[0].should.have.property('created_date');
        response.body[0].created_date.should.equal('2017-12-29T19:56:20.662Z');
        response.body[0].should.have.property('group_id');
        response.body[0].group_id.should.deep.equal(31);
        response.body[0].should.have.property('email');
        response.body[0].email.should.equal('t6r6l5@gmail.com');
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Thomas Laird');
        response.body[0].should.have.property('authrocket_id');
        response.body[0].authrocket_id.should.equal('usr_0vXXFrAmpjSWXnr7n2x2m8');
      })
      .catch(err => {
        throw err;
      });
  });

  it('should fetch all users belonging to a group', () => {
    return chai.request(server)
      .get('/api/v1/users/group/31')
      .set('x-token', xToken)
      .then(response => {
        response.should.have.status(200);
        response.body[0].should.have.property('user_id');
        response.body[0].should.have.property('authrocket_id');
        response.body[0].should.have.property('created_date');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('group_id');
        response.body[7].should.have.property('user_id');
        response.body[7].should.have.property('authrocket_id');
        response.body[7].should.have.property('created_date');
        response.body[7].should.have.property('name');
        response.body[7].should.have.property('group_id');       
        response.body.length.should.equal(8);
      })
      .catch(err => {
        throw err;
      });
    });
  });
  
  
  describe('events routes', () => {
    it('should sum the points belonging to a particular user', () => {
      return chai.request(server)
        .get('/api/v1/events/85/total')
        .set('x-token', xToken)
        .then(response => {
          response.should.have.status(200);
          response.body.should.have.property('user_id');
          response.body.should.have.property('total_points');
          response.body.user_id.should.be.deep.equal('85');
          response.body.total_points.should.deep.equal([{ sum: null}]);
        })
        .catch(err => {
          throw err;
        });
    });

    it.skip('should create a new event', () => {
      return chai.request(server)
        .post('/api/v1/eventtracking/new')
        .set('x-token', xToken)
        .send({send_id: 65,receive_id: 61, group_id: 31, point_value: 1, created_time: 1514698171542})
        .then(response => {
          response.should.have.status(200);
          response.body.should.have.property('status');
          response.body.status.should.equal('success');
          response.body.should.have.property('event');
        })
        .catch(err => {
          throw err;
        });
    });

    it('should get all the events related to a specific user', () => {
      return chai.request(server)
      .post('/api/v1/events/getuserdata')
      .set('x-token', xToken)
      .send({user: {user_id: 65, created_date: '2017-12-29T19:56:20.662Z', group_id: 31, email: 't6r6l5@gmail.com', name: 'Thomas Laird', authrocket_id: 'usr_0vXXFrAmpjSWXnr7n2x2m8'}})
      .then(response => {
        response.should.have.status(200);
        response.body[0].should.have.property('sent');
        response.body[0].should.have.property('received');
        response.body.length.should.equal(2);
      })
      .catch(err => {
        throw err;
      });
    });

    it('should get all the events related to a specific user', () => {
      return chai.request(server)
      .post('/api/v1/events/getgroupdata')
      .set('x-token', xToken)
      .send({group: { group_id: 31,
        group_name: null,
        group_passphrase: '19vns',
        weekly_points: 1000,
        administrator_id: 957,
        created_date: '2017-10-18T18:34:30.017Z' }})
      .then(response => {
        response.should.have.status(200);
        response.body[0].should.have.property('transactions');
        response.body.length.should.equal(12);
      })
      .catch(err => {
        throw err;
      });
    });

    it('should get all events', () => {
      return chai.request(server)
      .get('/api/v1/events')
      .then(response => {
        response.should.have.status(200);
        response.body.length.should.equal(75);
      })
      .catch(err => {
        throw err;
      });
    });
  });
  
  
  describe('groups routes', () => {
    it('should create a new group', () => {
      return chai.request(server)
      .post('/api/v1/group/new')
      .set('x-token', xToken)      
      .send(
        {group_name: 'test-group', group_passphrase: 'hello', weekly_points: 100}
      )
      .then(response => {
        response.should.have.status(200);
        response.body[0].should.have.property('group_id');
        response.body[0].should.have.property('group_passphrase');
        response.body[0].should.have.property('weekly_points');
        response.body[0].should.have.property('administrator_id');
        response.body[0].should.have.property('created_date');
        response.body[0].should.have.property('group_name');
      });
    });

    it('should validate a group when attempting to join', () => {
      return chai.request(server)
      .get('/api/v1/group/validate/19vns/65')
      .set('x-token', xToken)
      .then(response => {
        response.should.have.status(200);
        response.body[0].should.have.property('user_id');
        response.body[0].should.have.property('created_date');
        response.body[0].should.have.property('group_id');
        response.body[0].should.have.property('email');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('authrocket_id');
        response.body[0].group_id.should.deep.equal(31);
      });
    });

    it('should return a specific group given a group id', () => {
      return chai.request(server)
      .get('/api/v1/group/31')
      .set('x-token', xToken)
      .then(response => {
        response.should.have.status(200)
        response.body[0].should.have.property('group_id');
        response.body[0].should.have.property('group_passphrase');
        response.body[0].should.have.property('weekly_points');
        response.body[0].should.have.property('administrator_id');
        response.body[0].should.have.property('created_date');
        response.body[0].should.have.property('group_name');
      });
    });
  });

  describe('validation tests', () => {
    
  })
  
