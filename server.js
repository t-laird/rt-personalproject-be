const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('express-cors');
const path = require('path');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const { KEYUTIL, KJUR, b64utoutf8 } = require('jsrsasign');
const key = require('./pubKey');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  allowedOrigins: ['localhost:3001'],
  preflightContinue: true,
  headers: ['Content-Type', 'x-token', 'x-temp']
};

app.use(cors(corsOptions));

app.listen(3000, () => {
  console.log('database is running on localhost:3000');
});

validate = (request) => {
  var jwToken = request.headers['x-token'];
  var pubkey = KEYUTIL.getKey(key);
  var isValid = KJUR.jws.JWS.verifyJWT(jwToken, pubkey, {alg: ['RS256']});
  //if isValid is false, we should throw an error before trying payload
  if (isValid) {
    var payloadObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(jwToken.split(".")[1]));
    return payloadObj;
  } else {
    throw Error('problem with validating user - please signin again');
  }
  //to get current user, take uid returned from validation and match with users.authrocketid
  //if not found, create one
  //then return current user

  //this function needs to be run on every api call
};

app.get('/api/v1/login', (request,response) => {
  const userObject = validate(request);
  const newUser = {
    group_id: null,
    email: userObject.un,
    name: userObject.n,
    authrocket_id: userObject.uid
  };

  console.log(newUser);

  database('users').where('authrocket_id', userObject.uid).select()
    .then((user) =>{
      if (!user.length) {
        return createUser(request, response, newUser);
      }
      response.status(200).json(user);
    })
    .catch((error => {
      response.status(404).json({error});
    }));
});

const createUser = ( request, response, user ) => {
  database('users').insert(user)
    .then( user => {
      response.status(200).json({status: 'success'});
    })
    .catch( error => {
      response.status(500).json({error});
    });
};

app.get('/api/v1/group/validate/:passphrase/:userid', (request, response) => {

  database('group').where('group_passphrase', request.params.passphrase).select()
    .then(group => {
      if (!group.length) {
        return response.status(404).json({error: 'group passphrase not found'});
      }
      addUserGroup(request, response, group[0], request.params.userid);
    });
});

function addUserGroup(request, response, group, userid) {
  database('users').where('user_id', userid).select().update({group_id: group.group_id})
    .then(user => {
      return findUser(request, response, group.group_id);
    })
    .catch(error => {
      response.status(500).json({error: 'error adding group to user - please try again'});
    });
}

function findUser(request, response, groupid) {
  console.log(groupid);
  database('users').where('group_id', groupid).select()
    .then(user => {
      return response.status(200).json(user);
    })
    .catch(error => {
      return response.status(500).json({error: 'user not found'});
    });
}

app.get('/api/v1/users/:id', (request, response) => {
  const userObject = validate(request);
  console.log(userObject);

  database('users').where('user_id', request.params.id).select()
    .then((user) => {
      response.status(200).json(user);
    })
    .catch((error) => {
      console.log('validationResponse: ', validationResponse);
      // response.status(500).json({error: error})
    });
});

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

app.get('/api/v1/users', (request, response) => {
  database('users').select()
    .then((user) => {
      response.status(200).json(user)
    })
    .catch((error) => {
      response.status(500).json({error});
    })
});

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

app.get('/api/v1/group/:id', (request, response) => {
  database('group').where('group_id', request.params.id).select()
    .then((group) => {
      response.status(200).json(group)
    })
    .catch((error) => {
      response.status(500).json({error})
    });
});

app.post('/api/v1/group/new', (request, response) => {
  const group = request.body;
  console.log(group);
  for(let requiredParameters of ['group_name', 'group_passphrase', 'weekly_points', 'administrator_id']) {
    if(!group[requiredParameters]) {
      return response
        .status(422)
        .send({ error: `missing parameter ${requiredParameters}`})
    }
  }  

  database('group').insert(group, 'group_id')
    .then(event => {
      response.status(200).json({status: 'success'})
    })
    .catch(error => {
      response.status(500).json({error});
    })
});

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
