const chai  = require('chai');
    mocha = require('mocha');
    chaiHttp = require('chai-http');
    server = require('./server');
    should = chai.should();
    xToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImpreV8wdlhXRGRqMURGY0xtSUdiUGhCTDRIIn0.eyJpYXQiOjE1MTQ4NTI5MzksImV4cCI6MTUxNDg3NDUzOSwidWlkIjoidXNyXzB2WFhGckFtcGpTV1hucjduMngybTgiLCJ1biI6InQ2cjZsNUBnbWFpbC5jb20iLCJmbiI6IlRob21hcyIsImxuIjoiTGFpcmQiLCJuIjoiVGhvbWFzIExhaXJkIiwidGsiOiJrc3NfMHZYbXh0MzRrQ3NDdWJEemxrQUpUViJ9.xuKGB1FGQG1ObPzH7_6qd2yNb5bD6pbmvJo9B4ntsBdATsEi-S4aD5MUKFeqLTg3AgBE_QKoF9zq6pcNQqkA24tuRChCmUMvUaO3fDlcdhoL4jm1llWUHb8Vz3kp_z12NzCEOr1HqUNjFiAZGJc-3B5gZPwnm-mvXNyT_KhD-S05ijslrZurlbGF5cx9sQCdGuX9ARdzbt8P0aTf9tVaC5gQ1VgT-xhJ4KYvD4uanYxD3nloaPF11qobBW9eqZ-xY_moqByDobvlA-bJWDtpcp7ECZRJwfwIdJfxUDZv1U7g0ewyFpsDDmC9hSEWqxlCJwBnvVeWxd5V0CBpMu9wyg";
  
chai.use(chaiHttp);


describe('user routes', () => {
  it('should fetch the current user', () => {
    return chai.request(server)
      .get('/api/v1/users')
      .set('x-token', xToken)
      .then(response => {
        response.should.have.status(200);
        response.body[0].should.have.property('user_id');
        response.body[0].user_id.should.deep.equal(9);
        response.body[0].should.have.property('created_date');
        response.body[0].should.have.property('group_id');
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

  it('should return a 401 error without a valid auth', () => {
    return chai.request(server)
      .get('/api/v1/users')
      .set('x-token', 'asdf')
    .then( response => {
      response.should.have.status(401);
    }).catch( err => {
      err.should.have.status(401);
    });
  })

  it('should fetch all users belonging to a group', () => {
    return chai.request(server)
      .get('/api/v1/users/group/1')
      .set('x-token', xToken)
      .then(response => {
        response.should.have.status(200);
        response.body[0].should.have.property('user_id');
        response.body[0].should.have.property('authrocket_id');
        response.body[0].should.have.property('created_date');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('group_id');
        response.body[6].should.have.property('user_id');
        response.body[6].should.have.property('authrocket_id');
        response.body[6].should.have.property('created_date');
        response.body[6].should.have.property('name');
        response.body[6].should.have.property('group_id');       
        response.body.length.should.equal(7);
      })
      .catch(err => {
        throw err;
      });
    });
  });

  it('should return 404 if a group is not specified', () => {
    return chai.request(server)
    .get('/api/v1/users/group/null/')
    .set('x-token', xToken)
    .then(response => {
    })
    .catch(err => {
      err.should.have.status(404);
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

    it('should return a 422 error if missing a param and trying to create an event', () => {
      return chai.request(server)
      .post('/api/v1/eventtracking/new')
      .set('x-token', xToken)
      .send({send_id: 65,receive_id: 61, group_id: 31})
      .then( response => {

      })
      .catch(err => {
        err.should.have.status(422);
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
        response.body.length.should.equal(3);
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
        response.body.length.should.equal(13);
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
        response.body.length.should.equal(35);
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

    it('should return a 422 error if missing a parameter when creating a new group', () => {
      return chai.request(server)
      .post('/api/v1/group/new')
      .set('x-token', xToken)      
      .send(
        {group_passphrase: 'hello', weekly_points: 100}
      )
      .then(response => {
      })
      .catch(err => {
        err.should.have.status(422);
      });
    });

    it('should validate a group when attempting to join', () => {
      return chai.request(server)
      .get('/api/v1/group/validate/19vns/9')
      .set('x-token', xToken)
      .then(response => {
        response.should.have.status(200);
        response.body[0].should.have.property('user_id');
        response.body[0].should.have.property('created_date');
        response.body[0].should.have.property('group_id');
        response.body[0].should.have.property('email');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('authrocket_id');
        response.body[0].group_id.should.deep.equal(15);
      });
    });

    it('should return a 404 error given an invalid passphrase', () => {
      return chai.request(server)
      .get('/api/v1/group/validate/98x13/9')
      .set('x-token', xToken)
      .then(response => {
      })
      .catch(err => {
        err.should.have.status(404);
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
