const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const NodeRSA = require('node-rsa');

var key = new NodeRSA();
key.importKey(
  '-----BEGIN PUBLIC KEY-----\n'+
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3fw1WN9UXW2DT4dbsDXZ77R5PpOp\n'+
  'lPwwg548Eiurx0ZX5X0LH7OSfXcpD\n'+
  'Ll0C9yQLg7KsN0fKA1pChNflHAKZaqJtMKgLnXGTOamAeLXct23oSwtP\n'+
  '3DSieqZJ\n'+
  'RZxd7irPBgK4jEm09bkfITqY82BoqaBIDkuNiORu8pyc7C9FVfIH4JuLcd1URvzRl\n'+
  '/8hWDXry4a/pa3zwKRCHpnPBKaijTKwL5jtOKCLY32KHE2I\n'+
  'VTfI1q/kyCxFCFYB+OHRZC1Rk23a4OYxnPBlDUjL6DOzD6HX4KvolXDuJ3UkA28jU9K75Z9wzrzARgQEq6c8E\n'+
  '6QaCJb2/9M8ncDz8wIDAQAB\n'+
  '-----END PUBLIC KEY-----');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));



app.listen(3000, () => {
  console.log('database is running on localhost:3000');
  console.log(key);
});

// app.post('/api/v1/signup/:jwt', (request, response) => {

//   var cryptographer = new Jose.WebCryptographer();
//   cryptographer.setContentSignAlgorithm("RS256");


// })



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

app.get('/api/v1/users/:id', (request, response) => {
  database('users').where('user_id', request.params.id).select()
    .then((user) => {
      response.status(200).json(user);
    })
    .catch((error) => {
      response.status(500).json({error})
    })
});

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
