const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const { KEYUTIL, KJUR, b64utoutf8 } = require('jsrsasign');

var key = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3fw1WN9UXW2DT4dbsDXZ
77R5PpOp+lPwwg548Eiurx0ZX5X0LH7OSfXcpD+Ll0C9yQLg7KsN0fKA1pChNflH
AKZaqJtMKgLnXGTOamAeLXct23oSwtP+3DSieqZJ+RZxd7irPBgK4jEm09bkfITq
Y82BoqaBIDkuNiORu8pyc7C9FVfIH4JuLcd1URvzRl+/8hWDXry4a/pa3zwKRCHp
nPBKaijTKwL5jtOKCLY32KHE2I+VTfI1q/kyCxFCFYB+OHRZC1Rk23a4OYxnPBlD
UjL6DOzD6HX4KvolXDuJ3UkA28jU9K75Z9wzrzARgQEq6c8E+6QaCJb2/9M8ncDz
8wIDAQAB
-----END PUBLIC KEY-----
`
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000, () => {
  console.log('database is running on localhost:3000');
  // console.log(key);
});

validate = (request) => {
  var jwToken = request.headers['x-token'];
  var pubkey = KEYUTIL.getKey(key);
  var isValid = KJUR.jws.JWS.verifyJWT(jwToken, pubkey, {alg: ['RS256']});
  //if isValid is false, we should throw an error before trying payload
  var payloadObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(jwToken.split(".")[1]));
  console.log(isValid, payloadObj)
  //to get current user, take uid returned from validation and match with users.authrocketid
  //if not found, create one
  //then return current user

  //this function needs to be run on every api call
}

app.get('/api/v1/users/:id', (request, response) => {
  validate(request);
  database('users').where('user_id', request.params.id).select()
    .then((user) => {
      response.status(200).json(user);
    })
    .catch((error) => {
      response.status(500).json({error})
    })
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

app.post('/api/v1/users/new', (request, response) => {
  const user = request.body;

  for(let requiredParameters of ['group_id', 'email', 'name', 'authrocket_id']) {
    if(!user[requiredParameters]) {
      return response
        .status(422)
        .send({ error: `missing parameter ${requiredParameters}`})
    }
  }  

  database('users').insert(user, 'user_id')
    .then(event => {
      response.status(200).json({status: 'success'})
    })
    .catch(error => {
      response.status(500).json({error});
    })
});



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
