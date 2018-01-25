/* eslint-disable no-console */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('express-cors');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';

const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const moment = require('moment');
const { KEYUTIL, KJUR, b64utoutf8 } = require('jsrsasign');
const key = require('./pubKey');
var pg = require('pg');


const app = express();
const corsOptions = {
  allowedOrigins: ['localhost:3001', 't-laird.github.io', 'localhost:3000', 't-laird.com', 'http://t-laird.com', 'https://t-laird.com', '*'],
  // allowedOrigins: false,
  preflightContinue: true,
  headers: ['Content-Type', 'x-token']
};

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-token');

  // intercept OPTIONS method
  next();
};

app.use(allowCrossDomain);
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


pg.types.setTypeParser(20, 'text', parseInt);
const { findSunday } =  require('./helpers');

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`database is running on ${app.get('port')}`);
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

////////////////////////////////////////////////////////////////////////////////////
//USER API FETCHES//////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

const getCurrentUser =  async ( request, response ) => {
  const userObject = await validate(request, response);
  
  if (!userObject) {
    return;
  }

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
};

const createUser = async ( response, user ) => {
  let foundUser;
  await database('users').insert(user)
    .then(() => {
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
    return;
  }

  database('users').where('authrocket_id', currentUser.authrocket_id).select()
    .then((user) => {
      response.status(200).json(user);
    });
});

///////////////////////////////////////////////////////////////////////////////////
//GROUP API FETCHES////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

app.get('/api/v1/users/group/:groupid/', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return;
  }
  if (request.params.groupid === 'null') {
    return response.status(404).json({error: 'user not in a group.. join to see users in your network'});
  }
  
  database('users').where('group_id', request.params.groupid).select()
    .then((users) => {
      response.status(200).json(users);
    })
    .catch(() => {
      response.status(500).json({error: 'error retrieving users'});
    });
});

app.get('/api/v1/group', (request, response) => {
  database('group').select()
    .then((group) => {
      response.status(200).json(group);
    })
    .catch(error => {
      response.status(500).json({error});
    });
});

app.get('/api/v1/group/:id', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return;
  }

  database('group').where('group_id', request.params.id).select()
    .then((group) => {
      response.status(200).json(group);
    })
    .catch((error) => {
      response.status(500).json({error});
    });
});

function getGroup(request, response, groupId) {
  database('group').where('group_id', groupId).select()
    .then(group => {
      response.status(200).json(group);
    })
    .catch(() => {
      response.status(500).json({error: 'idk it did not work'});
    });
}

app.get('/api/v1/group/validate/:passphrase/:userid', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return;
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
    .then(async () => {
      response.status(200).json({status: 'success'});
    })
    .catch(() => {
      response.status(500).json({error: 'error adding group to user - please try again'});
    });
};

app.post('/api/v1/group/new', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return;
  }

  const group = request.body;

  for (let requiredParameters of ['group_name', 'group_passphrase', 'weekly_points']) {
    if (!group[requiredParameters]) {
      return response
        .status(422)
        .send({ error: `missing parameter ${requiredParameters}`});
    }
  }  
  group.administrator_id = currentUser.user_id;

  database('group').insert(group, 'group_id')
    .then(group => {
      return getGroup(request, response, group[0]);
    })
    .catch(error => {
      response.status(500).json({error});
    });
});

////////////////////////////////////////////////////////////////////////
//EVENTS API FETCHES ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

app.post('/api/v1/events/getgroupdata/', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return;
  }

  const { group } = request.body;
  const currentDate = Date.now();

  const { created_date, group_id } = group;
  const adjDate = moment(created_date).subtract(7, 'days');

  let earliestSunday = findSunday(adjDate);
  let dateCollection = [];

  while (earliestSunday < currentDate) {
    let transactions = await getGroupTransactions(earliestSunday, group_id, 'group_id');

    earliestSunday += (1000 * 60 * 60 * 24 * 7);
    dateCollection = [...dateCollection, {transactions: transactions}];
  }

  response.status(200).json(dateCollection);
});

app.post('/api/v1/events/getuserdata/', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return;
  }

  const { user } = request.body;
  const currentDate = Date.now();

  const { created_date, user_id, group_id } = user;
  const adjDate = moment(created_date).subtract(7, 'days');

  let earliestSunday = findSunday(adjDate);
  let dateCollection = [];
  while (earliestSunday < currentDate) {
    let sentTransactions = await getUserTransactions(earliestSunday, user_id, group_id, 'send_id');
    let receivedTransactions = await getUserTransactions(earliestSunday, user_id, group_id, 'receive_id');

    earliestSunday += (1000 * 60 * 60 * 24 * 7);
    dateCollection = [...dateCollection, {sent: sentTransactions, received: receivedTransactions}];
  }

  response.status(200).json(dateCollection);
});

app.post('/api/v1/eventtracking/new', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return;
  }

  const event = request.body;
  event.created_time = Date.now();

  for (let requiredParameters of ['send_id', 'receive_id', 'group_id', 'point_value']) {
    if (!event[requiredParameters]) {
      return response
        .status(422)
        .send({ error: `missing parameter ${requiredParameters}`});
    }
  }

  if (event.point_value < 0) {
    return response.status(400).send({ status: 'failure', error: 'please enter a valid snaps value'});
  }

  let getSendingUser = null;  
  let getReceivingUser = null;
  let groupSettings = null;
  const lastSunday = findSunday(new Date(Date.now()));
  let getRecentTransactions = null;

  await database('users').where('user_id', event.send_id).select()
    .then((user) => {
      getSendingUser = user[0];
    });

  await database('users').where('user_id', event.receive_id).select()
    .then((user) => {
      getReceivingUser = user[0];
    });

  await database('group').where('group_id', event.group_id).select()
    .then((group) => {
      groupSettings = group[0];
    });

  getRecentTransactions = await getUserTransactions(lastSunday, getSendingUser.user_id, groupSettings.group_id, 'send_id');

  const sumRecentSentTransactions = getRecentTransactions.reduce( (total, transaction) => {
    total += transaction.point_value;
    return total;
  }, 0);
  
  if (!getReceivingUser || !getSendingUser) {
    return response.status(450).json({status: 'failure', error: 'Receiving user not found.'});
  } else if (getReceivingUser.name === getSendingUser.name) {
    return response.status(450).json({status: 'failure', error: 'You can\'t send points to yourself!'});
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
    });
});

app.get('/api/v1/events', (request, response) => {
  database('eventtracking').select()
    .then((event) => {
      response.status(200).json(event);
    })
    .catch((error) => {
      response.status(500).json({error});
    });
});

const getUserTransactions = (start, id, groupid, criteria) => {
  const endTime = start + (1000 * 60 * 60 * 24 * 7);
  return database('eventtracking').whereBetween('created_time', [start, endTime]).where('group_id', groupid).where(criteria, id).select()
    .then(userEvents => {
      return userEvents;
    });
};

const getGroupTransactions = (start, id, criteria) => {
  const endTime = start + (1000 * 60 * 60 * 24 * 7);
  return database('eventtracking').whereBetween('created_time', [start, endTime]).where(criteria, id).select()
    .then(userEvents => {
      return userEvents;
    });
};

///////////////////////////////////////////////////////////////////
// SLACK Requests /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

app.post('/slack/snap', async (request, response) => {

  // if (request.body.token !== verificationToken) {
  //   return response.status(401).json({error: 'invalid request token'});
  // }

  checkSlackId(request.body.user_id, true);

  const getUser = await findUser(request.body.user_id);
  if (!getUser) {
    return response.status(200).json(
      {
        "response_type": "ephemeral",
        "text": "You have not configured Snap Ninja with Slack yet! Link your Snap Ninja account to Slack for access to this feature!",
        "attachments": [
          {
            "fallback": "Snap Ninja - Connect to Slack",
            "color": "#df4054",
            "author_icon": ":snap-ninja:",
            "title": "Link your Snap Ninja account to Slack",
            "text": `On the link slack page, input your user id: ${request.body.user_id}`,
            "title_link": "https://t-laird.com/login/slack",
            "footer": "SNAP NINJA",
            "footer_icon": ":snap-ninja:",
            "ts": "{time_short}"
          }
        ]
      }
    );
  }

  const testForRecipient = new RegExp(/<@\w+\|\w+>/);
  const containsRecipient = testForRecipient.test(request.body.text);
  const testForAttempt = new RegExp(/@/);
  const validAttempt = testForAttempt.test(request.body.text);
  const getReceivingSlackId = request.body.text.match(/\w+(?=\|)/);

  if (!containsRecipient && validAttempt) {
    return response.status(200).json(
      {
        "response_type": "ephemeral",
        "text": "Error: Slack could not find the user specified. Make sure you input their correct Slack handle!"
      }
    );
  }

  if (!containsRecipient && !validAttempt) {
    return response.status(200).json(
      {
        "response_type": "ephemeral",
        "text": "Error: Please include the recipient's Slack handle following the /snap command (e.g. /snap @handle 10)"
      }
    );
  }

  const verifyId = await checkSlackId(getReceivingSlackId[0], false);
  
  if (!verifyId) {
    return response.status(200).json(
      {
        "response_type": "ephemeral",
        "text": "Error: The recipient has not yet configured their Slack to accept Snaps :("
      }
    );
  }


  const sentStuff = request.body.text;
  const extractRecipient = new RegExp(/<@\w+\|\w+>\s+/);
  const removeRecipient = sentStuff.replace(extractRecipient, '');
  const extractPoints = new RegExp(/\d+/);
  const getPoints = removeRecipient.match(extractPoints)[0];
  const rmPoints = new RegExp(/\d+\s+/);
  const getMessage = removeRecipient.replace(rmPoints, '');

  const validPoints = getPoints;

  if (!validPoints) {
    return response.status(200).json(
      {
        "response_type": "ephemeral",
        "text": "Error: Please enter a valid number of points at the end of the message (e.g. /snap @handle 10)"
      }
    );
  }
  
  const lastSunday = findSunday(new Date(Date.now()));
  const getRecipient = await findUser(getReceivingSlackId[0]);

  if (getRecipient.group_id !== getUser.group_id) {
    return response.status(200).json(
      {
        "response_type": "ephemeral",
        "text": "Error: You must be in the same Snap Ninja group as the recipient of the points",
        "attachments": [
          {
            "fallback": "Snap Ninja - Connect to Slack",
            "color": "#df4054",
            "author_icon": ":snap-ninja:",
            "title": "Join a Group on Snap Ninja",
            "text": "Join the same group as the person you want to send points to!",
            "title_link": "https://t-laird.com/joingroup",
            "footer": "SNAP NINJA",
            "footer_icon": ":snap-ninja:",
            "ts": "{time_short}"
          }
        ]
      }
    );
  }

  let getRecentTransactions = await getUserTransactions(lastSunday, getUser.user_id, getUser.group_id, 'send_id');

  const sumRecentSentTransactions = getRecentTransactions.reduce( (total, transaction) => {
    total += transaction.point_value;
    return total;
  }, 0);

  let groupSettings;

  await database('group').where('group_id', getUser.group_id).select()
    .then((group) => {
      groupSettings = group[0];
    });
  
  if (!groupSettings) {
    return response.status(200).json(
      {
        "response_type": "ephemeral",
        "text": "Error: You are not currently in a group. Visit the Slack Ninja website to join a group!",
        "attachments": [
          {
            "fallback": "Snap Ninja - Connect to Slack",
            "color": "#df4054",
            "author_icon": ":snap-ninja:",
            "title": "Join a Group on Snap Ninja",
            "text": "Go to the 'Join Group' tab on the Slack Ninja website",
            "title_link": "https://t-laird.com/login/slack",
            "footer": "SNAP NINJA",
            "footer_icon": ":snap-ninja:",
            "ts": "{time_short}"
          }
        ]
      }
    );
  }


  if (groupSettings.weekly_points - sumRecentSentTransactions < parseInt(getPoints)){
    return response.status(200).json(
      {
        "response_type": "ephemeral",
        "text": `Error: The snaps could not be sent because you only have ${groupSettings.weekly_points - sumRecentSentTransactions} left but you tried to send ${getPoints}`
      }
    );
  }

  console.log(getRecipient);
  console.log(getUser);

  const event = {
    send_id: getUser.user_id,
    created_time: Date.now(),
    receive_id: getRecipient.user_id,
    group_id: getUser.group_id,
    point_value: parseInt(getPoints),
    send_name: getUser.name,
    received_name: getRecipient.name,
    note: getMessage || ''
  };
  
  
  await database('eventtracking').insert(event, 'event_id')
    .then(event => {
      console.log(event);
      console.log('we did it');
    })
    .catch(() => {
      console.log('we did not do it');
    });


  return response.status(200).json(
    {
      "response_type": "in_channel",
      "text": `:snap-ninja: <@${request.body.user_id}> sent ${getPoints} snaps to<@${getReceivingSlackId[0]}>! :snap-ninja:`      
    }
  );
});

const findUser = async (slackId) => {
  let foundUser;
  await database('users').where('slack_id', slackId).select()
    .then(async (user) => {
      foundUser = user;
    });
  return foundUser[0];
};

const checkSlackId = async (slackId, insert) => {
  let foundId;
  await database('slackIds').where('slack_id', slackId).select()
    .then(async (id) => {
      foundId = id;
    });
  
  if (!foundId.length && insert) {
    return insertSlackId(slackId);
  }

  return foundId[0];
};

const insertSlackId = async (slackId) => {
  database('slackIds').insert({ slack_id: slackId })
    .then(() => {
      console.log('success');
    });
};

app.post('/api/v1/slack', async (request, response) => {
  const currentUser = await getCurrentUser(request, response);
  if (!currentUser) {
    return;
  }
  console.log(currentUser);
  const slackId = request.body.id;

  let validateId = await checkSlackId(slackId, false);
  console.log(validateId);
  
  if (!validateId) {
    return response.status(404).json({ status: 'failure', error: 'user not found' });
  }

  return await updateUserSlackId(currentUser.authrocket_id, slackId, response);
});

const updateUserSlackId = async (authrocketId, slackId, response) => {
  await database('users').where('authrocket_id', authrocketId).select().update({slack_id: slackId})
    .then(() => {
      return response.status(200).json({ status: 'success' });
    })
    .catch(() => {
      return response.status(500).json({ status: 'failure', message: 'could not add slackId to user, please try again.' });
    });
};

app.get('/backdoor/users', async (request, response) => {
  await database('users').select()
    .then((users) => {
      return response.status(200).json({users});
    })
    .catch(() => {
      return response.status(404).json({error: 'could not retrieve users'})
    })
});

module.exports = app;

