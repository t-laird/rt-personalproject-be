const chai  = require('chai');
    mocha = require('mocha');
    chaiHttp = require('chai-http');
    server = require('./server');
    should = chai.should();
    xToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImpreV8wdlhXRGRqMURGY0xtSUdiUGhCTDRIIn0.eyJpYXQiOjE1MTUzNzgyNzksImV4cCI6MTUxNTM5OTg3OSwidWlkIjoidXNyXzB2WHBjeVozaHllZm1DdWpsdkNEaDIiLCJ1biI6InQ2cjZsNUBnbWFpbC5jb20iLCJmbiI6IlRob21hcyIsImxuIjoiTGFpcmQiLCJuIjoiVGhvbWFzIExhaXJkIiwidGsiOiJrc3NfMHZYdlFUaXdScWFwWU1ia053Q2JPVCJ9.cTNlAat4ylLXVwy4__AEQKbfYzv_USKho0A8IKKAj6uHHJH7eMSN_ykyrKpMd8eVXcGXEfTOuRlruZFYR441yW_jrykmDPq9R4xRQPB1QaqtP4V_AGqbn51WxEDoZj8TwD96pADQd1Pm1hFL1LplnOtEgx-iA8v1JdVb7WISHiSR1shZKZXDf5ARqRvD4G7XK0n4EAy23tahrXYdBUxdnMKIU86s_XdbW9B2QUCYEI1JgItysQI_OUNpCqGL-c3VdIQvb6f9zkKAz6ILwKNS6YDY52OA27iUloLLtH4Mq29fbDk2c6u4CbjdfII33KWIH3Ve_DJOGBg1pV0lclUYBw";
  
chai.use(chaiHttp);


describe('user routes', () => {
  it('should fetch the current user', () => {
    return chai.request(server)
      .get('/api/v1/users')
      .set('x-token', xToken)
      .then(response => {
        response.should.have.status(200);
        response.body[0].should.have.property('user_id');
        response.body[0].user_id.should.deep.equal(8);
        response.body[0].should.have.property('created_date');
        response.body[0].should.have.property('group_id');
        response.body[0].should.have.property('email');
        response.body[0].email.should.equal('t6r6l5@gmail.com');
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Thomas Laird');
        response.body[0].should.have.property('authrocket_id');
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
        response.body.length.should.equal(37);
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
        response.body.status.should.equal('success');
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
      .get('/api/v1/group/5')
      .set('x-token', xToken)
      .then(response => {
        response.should.have.status(200)
        response.body[0].should.have.property('group_id');
        response.body[0].should.have.property('group_passphrase');
        response.body[0].should.have.property('weekly_points');
        response.body[0].should.have.property('administrator_id');
        response.body[0].should.have.property('created_date');
        response.body[0].should.have.property('group_name');
      })
      .catch(err => {
        throw err;
      })
    });
  });

  describe('slack routes', () => {
    it('should be able to create an event from slack', () => {
      return chai.request(server)
        .post('/api/v1/slack')
        .set('x-token', xToken)
        .send({
          id: 'U8PU91694'
        })
        .then(response => {
          response.should.have.status(200);
          response.body.status.should.equal('success');
        })
        .catch(err => {
          throw err;
        });
    });

    it('should throw a 401 if the slackid is invalid', () => {
      return chai.request(server)
      .post('/api/v1/slack')
      .set('x-token', xToken)
      .send({
        id: 'sdfsdfdsf'
      })
      .then(response => {
        throw 'should have failed'
      })
      .catch(err => {
        err.should.have.status(404);
      });
    });

    it('give a 200 status when posting to /slack/snap', () => {
      return chai.request(server)
      .post('/slack/snap')
      .send({
        user_id: 3
      }).then(response => {
        response.should.have.status(200);
      })
      .catch(err => {
        throw err;
      });
    });
  });