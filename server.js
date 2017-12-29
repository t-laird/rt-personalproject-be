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

app.listen(3000, () => {
  console.log('database is running on localhost:3000');
});


//////  VALIDATAION ////////
validate = (request, response) => {
  try {
    var jwToken = request.headers['x-token'] || '';
    var pubkey = KEYUTIL.getKey(key);
    var isValid = KJUR.jws.JWS.verifyJWT(jwToken, pubkey, {alg: ['RS256']});
    if (isValid) {
      var payloadObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(jwToken.split(".")[1]));
      return payloadObj;
    } 
  } catch (e) {
    console.log('i errored')
  }
  console.log('invalid token')
  response.status(401).json({error: 'Invalid token.  Please login again.'})
};

const getCurrentUser =  async ( request, response ) => {
  const userObject = validate(request, response);
  const newUser = {
    group_id: null,
    email: userObject.un,
    name: userObject.n,
    authrocket_id: userObject.uid
  };

  let foundUser = null;
  await database('users').where('authrocket_id', userObject.uid).select()
    .then((user) =>{
      if (!user.length) {
        foundUser = createUser( response, newUser );
      }
      foundUser = user[0];
    })
    .catch(error => {
      console.log('error loading user')

      response.status(404).json({error});
    });
  return foundUser;
}

const createUser = async ( response, user ) => {
  let foundUser;
  await database('users').insert(user)
    .then( user => {
      foundUser = user;
    })
    .catch( error => {
      console.log('error creating user')
      response.status(500).json({error});
    });
  return foundUser;
};

/////  GET CURRENT USER  /////////
app.get('/api/v1/users', async (request, response) => { 
  const currentUser = await getCurrentUser(request, response);
  console.log(currentUser)
  if (!currentUser) {
    console.log('no current user')
    return
  }  //the first few lines should look the same for all calls

  database('users').where('user_id', currentUser.user_id).select()
    .then((user) => {
      response.status(200).json(user);
    })
});


////////  CREATE NEW GROUP /////////
app.post('/api/v1/group/new', async (request, response) => {
  const currentUser = await getCurrentUser(request, response)
  if (!currentUser) {
    console.log('no current user')
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



///////  ADD USER TO GROUP  ///////
const addUserGroup = async (request, response, groupid, userid) => {
  await database('users').where('user_id', userid).select().update({group_id: groupid})
    .then(async (user) => {
      const foundUser = await findUser(request, response, groupid);
      return foundUser
    })
    .catch(error => {
      response.status(500).json({error: 'error adding group to user - please try again'});
    });
}

app.get('/api/v1/group/validate/:passphrase/:userid', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    console.log('no current user')
    return
  }
  await database('group').where('group_passphrase', request.params.passphrase).select()
    .then(group => {
      if (!group.length) {
        return response.status(404).json({error: 'group passphrase not found'});
      }
      addUserGroup(request, response, group[0].group_id, request.params.userid);
    });
});

const findUser = async (request, response, groupid) => {
  await database('users').where('group_id', groupid).select()
    .then(user => {
      return response.status(200).json(user);
    })
    .catch(error => {
      return response.status(500).json({error: 'user not found'});
    });
}










app.get('/api/v1/events/:id/total', async (request, response) => {
  console.log(request.params.id)
  let total_points = await database('eventtracking').where('send_id', request.params.id).where('receive_id', 89234).select().sum('point_value')
    .then((user) => {
      // response.status(200).json(user)
      return user
    })
    .catch((error) => {
      response.status(500).json({error});
    })
    response.status(200).json({user_id: request.params.id, total_points: total_points})
})

app.get('/api/v1/events', (request, response) => {
  database('eventtracking').select()
    .then((event) => {
      response.status(200).json(event);
    })
    .catch((error) => {
      response.status(500).json({error});
    })
});

// app.get('/api/v1/users', (request, response) => {
//   database('users').select()
//     .then((user) => {
//       response.status(200).json(user)
//     })
//     .catch((error) => {
//       response.status(500).json({error});
//     })
// });

// app.get('/api/v1/users/:id', (request, response) => {
//   database('users').where('user_id', request.params.id).select()
//     .then((user) => {
//       response.status(200).json(user);
//     })
//     .catch((error) => {
//       response.status(500).json({error})
//     })
// });


app.post('/api/v1/eventtracking/new', (request, response) => {
  
  const event = request.body;
  event.created_time = Date.now();

  for(let requiredParameters of ['send_id', 'receive_id', 'group_id', 'point_value']) {
    if(!event[requiredParameters]) {
      return response
        .status(422)
        .send({ error: `missing parameter ${requiredParameters}`})
    }
  }

  database('eventtracking').insert(event, 'event_id')
    .then(event => {
      response.status(200).json({status: 'success'});
    })
    .catch(error => {
      response.status(500).json({error});
    })
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

// app.post('/api/v1/users/new', (request, response) => {
//   const user = request.body;

//   for(let requiredParameters of ['group_id', 'email', 'name', 'authrocket_id']) {
//     if(!user[requiredParameters]) {
//       return response
//         .status(422)
//         .send({ error: `missing parameter ${requiredParameters}`});
//     }
//   }  

//   database('users').insert(user, 'user_id')
//     .then(user => {
//       response.status(200).json({status: 'success'});
//     })
//     .catch(error => {
//       response.status(500).json({error: 'error adding user'});
//     });
// });



/////NOTES:  ALWAYS VALIDATE ON AN API CALL!  AND send the JWT in the headers from the FE.  EVERY TIME!!! - HELL YEAH


//query for user events
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

//find users in group network
app.get('/api/v1/users/group/:groupid/', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return
  }

  if (request.params.groupid === null) {
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

app.get('/api/v1/events/getgroupdata/', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return
  }

  const { group } = request.body;
  const currentDate = Date.now();

  const { created_date, group_id } = user;

  let earliestSunday = findSunday(created_date);
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