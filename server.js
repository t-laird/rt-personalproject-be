const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('express-cors');
const path = require('path');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const moment = require('moment');
const { KEYUTIL, KJUR, b64utoutf8 } = require('jsrsasign');
const key = require('./pubKey');
var pg = require('pg')

pg.types.setTypeParser(20, 'text', parseInt);
const { findSunday } =  require('./helpers');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const corsOptions = {
  allowedOrigins: ['localhost:3001'],
  preflightContinue: true,
  headers: ['Content-Type', 'x-token']
};

app.use(cors(corsOptions));
app.set('port', process.env.PORT || 3000);


app.listen(app.get('port'), () => {
  console.log('database is running on localhost:3000');
});


//////  VALIDATAION ////////

const validate = (request, response) => {
  try {
    var jwToken = request.headers['x-token'] !== 'null' ? request.headers['x-token'] : '';
    var pubkey = KEYUTIL.getKey(key);
    var isValid = KJUR.jws.JWS.verifyJWT(jwToken, pubkey, {alg: ['RS256']});
    if (isValid) {
      var payloadObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(jwToken.split(".")[1]));
      return payloadObj;
    }
  } catch (e) {
    response.status(401).json({error: 'Invalid token.  Please login again.'});
  }
};


//USER API FETCHES

const getCurrentUser =  async ( request, response ) => {
  const userObject = await validate(request, response);
  const newUser = {
    group_id: null,
    email: userObject.un,
    name: userObject.n,
    authrocket_id: userObject.uid
  };

  let foundUser = null;
  await database('users').where('authrocket_id', userObject.uid).select()
    .then( async (user) =>{
      if (!user.length) {
        foundUser = await createUser( response, newUser );
      } else {
        foundUser = user[0];
      }
    })
    .catch(error => {
      response.status(404).json({error});
    });
  return foundUser;
}

const createUser = async ( response, user ) => {
  let foundUser;
  await database('users').insert(user)
    .then( newUser => {
      foundUser = user;
    })
    .catch( error => {
      response.status(500).json({error});
    });
  return foundUser;
};

app.get('/api/v1/users', async (request, response) => { 
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return
  }

  database('users').where('authrocket_id', currentUser.authrocket_id).select()
    .then((user) => {
      response.status(200).json(user);
    })
});

//GROUP API FETCHES
app.get('/api/v1/users/group/:groupid/', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return
  }
  if (request.params.groupid === 'null') {
    return response.status(404).json({error: 'user not in a group.. join to see users in your network'});
  }
  
  database('users').where('group_id', request.params.groupid).select()
    .then((users) => {
      response.status(200).json(users);
    })
    .catch(error => {
      response.status(500).json({error: 'error retrieving users'});
    });
});

app.get('/api/v1/group', (request, response) => {
  database('group').select()
    .then((group) => {
      response.status(200).json(group);
    })
    .catch(error => {
      response.status(500).json({error})
    });
});

app.get('/api/v1/group/:id', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return
  }

  database('group').where('group_id', request.params.id).select()
    .then((group) => {
      response.status(200).json(group)
    })
    .catch((error) => {
      response.status(500).json({error})
    });
});

function getGroup(request, response, groupId) {
  database('group').where('group_id', groupId).select()
    .then(group => {
      response.status(200).json(group);
    })
    .catch(error => {
      response.status(500).json({error: 'idk it did not work'});
    })
}

app.get('/api/v1/group/validate/:passphrase/:userid', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return
  }
  await database('group').where('group_passphrase', request.params.passphrase).select()
    .then(group => {
      if (!group.length) {
        return response.status(404).json({error: 'group passphrase not found'});
      }
      return addUserGroup(request, response, group[0].group_id, request.params.userid);
    });
});

const addUserGroup = async (request, response, groupid, userid) => {
  await database('users').where('user_id', userid).select().update({group_id: groupid})
    .then(async (user) => {
      response.status(200).json({status: 'success'})
    })
    .catch(error => {
      response.status(500).json({error: 'error adding group to user - please try again'});
    });
}

app.post('/api/v1/group/new', async (request, response) => {
  const currentUser = await getCurrentUser(request, response)
  if (!currentUser) {
    return
  }

  const group = request.body;

  for(let requiredParameters of ['group_name', 'group_passphrase', 'weekly_points']) {
    if(!group[requiredParameters]) {
      return response
        .status(422)
        .send({ error: `missing parameter ${requiredParameters}`})
    }
  }  
  group.administrator_id = currentUser.user_id;

  database('group').insert(group, 'group_id')
    .then(group => {
      return getGroup(request, response, group[0])
    })
    .catch(error => {
      response.status(500).json({error});
    })
});

//EVENTS API FETCHES

app.post('/api/v1/events/getgroupdata/', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return
  }

  const { group } = request.body;
  const currentDate = Date.now();

  const { created_date, group_id } = group;
  const adjDate = moment(created_date).subtract(7, 'days')

  let earliestSunday = findSunday(adjDate);
  let dateCollection = [];
  let weekCounter = 1;

  while(earliestSunday < currentDate) {
    let transactions = await getTransactions(earliestSunday, group_id, 'group_id');

    weekCounter++;
    earliestSunday += (1000 * 60 * 60 * 24 * 7);
    dateCollection = [...dateCollection, {transactions: transactions}];
  }

  response.status(200).json(dateCollection);
});

const getTransactions = (start, id, criteria) => {
  const endTime = start + (1000 * 60 * 60 * 24 * 7);
  return database('eventtracking').whereBetween('created_time', [start, endTime]).where(criteria, id).select()
  .then(userEvents => {
    return userEvents;
  });
}

app.post('/api/v1/events/getuserdata/', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  //attempt at validating user.. look right Rob?
  if (!currentUser) {
    return
  }

  //get start date and the date user created their account
  const { user } = request.body;
  const currentDate = Date.now();

  const { created_date, user_id } = user;
  const adjDate = moment(created_date).subtract(7, 'days')

  let earliestSunday = findSunday(adjDate);
  let dateCollection = [];
  let weekCounter = 1;
  while(earliestSunday < currentDate) {
    let sentTransactions = await getTransactions(earliestSunday, user_id, 'send_id');
    let receivedTransactions = await getTransactions(earliestSunday, user_id, 'receive_id');

    weekCounter++;
    earliestSunday += (1000 * 60 * 60 * 24 * 7);
    dateCollection = [...dateCollection, {sent: sentTransactions, received: receivedTransactions}];
  }

  response.status(200).json(dateCollection);
});

app.post('/api/v1/eventtracking/new', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return
  }

  const event = request.body;
  event.created_time = Date.now();

  for(let requiredParameters of ['send_id', 'receive_id', 'group_id', 'point_value']) {
    if(!event[requiredParameters]) {
      return response
        .status(422)
        .send({ error: `missing parameter ${requiredParameters}`})
    }
  }

  let getSendingUser = null;  
  let getReceivingUser = null;
  let groupSettings = null;
  const lastSunday = findSunday(new Date(Date.now()));
  let getRecentTransactions = null;

  await database('users').where('user_id', event.send_id).select()
    .then((user) => {
      getSendingUser = user[0];
    })

  await database('users').where('user_id', event.receive_id).select()
    .then((user) => {
      getReceivingUser = user[0];
    })

  await database('group').where('group_id', event.group_id).select()
    .then((group) => {
      groupSettings = group[0];
    })

    getRecentTransactions = await getTransactions(lastSunday, event.send_id, 'send_id');

    const sumRecentSentTransactions = getRecentTransactions.reduce( (total, transaction) => {
      total += transaction.point_value;
      return total;
    }, 0);
  
  if (!getReceivingUser || !getSendingUser) {
    return response.status(450).json({status: 'failure', error: 'Receiving user not found.'});
  } else if (getReceivingUser.group_id !== getSendingUser.group_id) {
    return response.status(450).json({status: 'failure', error: 'The receiving user is not in your group!'});
  } else if (!groupSettings) {
    return response.status(450).json({status: 'failure', error: 'You are not in a valid group.'});
  } else if ((sumRecentSentTransactions + event.point_value) > groupSettings.weekly_points) {
    const remainingPoints = groupSettings.weekly_points - sumRecentSentTransactions;
    return response.status(450).json({status: 'failure', error: `Transaction could not be completed. Your remaining point balance is ${remainingPoints}.`});
  }

  event.send_name = getSendingUser.name;
  event.received_name = getReceivingUser.name;

  database('eventtracking').insert(event, 'event_id')
    .then(event => {
      response.status(200).json({status: 'success', event: event[0]});
    })
    .catch(error => {
      response.status(500).json({status: 'failure', error});
    })
});

app.get('/api/v1/events', (request, response) => {
  database('eventtracking').select()
    .then((event) => {
      response.status(200).json(event);
    })
    .catch((error) => {
      response.status(500).json({error});
    })
});

const getTransactions = (start, id, criteria) => {
  console.log('start: ', start, 'id :', id, 'criteria: ', criteria);
  console.log(typeof id);
  const endTime = start + (1000 * 60 * 60 * 24 * 7);
  return database('eventtracking').whereBetween('created_time', [start, endTime]).where(criteria, id).select()
  .then(userEvents => {
    console.log('with found events: ', userEvents);
    return userEvents;
  });
}

module.exports = app;