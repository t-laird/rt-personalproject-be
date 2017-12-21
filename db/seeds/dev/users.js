// let transactionData = [
//   {
//     'send_id': 123,
//     'receive_id': 456,
//     'group_id': 789,
//     'point_value': 5},
//   {
//     'send_id': 123,
//     'receive_id': 456,
//     'group_id': 789,
//     'point_value': 5}
// ];

// const createEvent = (knex, event) => {
//   return knex('eventtracking').insert({
//     send_id: event.send_id,
//     receive_id: event.receive_id,
//     group_id: event.group_id,
//     point_value: event.point_value
//   }, 'event_id');
// };

// exports.seed = function(knex, Promise) {
//   // Deletes ALL existing entries
//   return knex('eventtracking').del()
//     .then(() => {
//       let eventPromises = [];

//       transactionData.forEach(event => {
//         eventPromises.push(createEvent(knex, event));
//       });

//       return Promise.all(eventPromises);
//     })
//     .catch(error => console.log(`error seeding data: ${error}`))
// };

let userData = [
  {
    group_id: 3,
    email:'sjf@gmail.com',
    name: 'bob',
    authrocket_id: 1
  },
  {
    group_id: 4,
    email: 'abcf@gmail.com',
    name: 'mike',
    authrocket_id: 3
  }
];

const createUser = ( knex, user ) => {
  return knex('users').insert({
    group_id: user.group_id,
    email: user.email, 
    name: user.name,
    authrocket_id: user.authrocket_id
  }, 'user_id');
};

exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(() => {
      let userPromises = [];
      userData.forEach(user => {
        userPromises.push(createUser(knex, user));
      });

      return Promise.all(userPromises);
    })
    .catch(error => console.log(`error seeding data: ${error}`))
};

// let groupData = [
//   {
//     group_name: 'turing',
//     group_passphrase: '9139z',
//     weekly_points: 100,
//     administrator_id: 123,
//   },
//   {
//     group_name: 'facebook',
//     group_passphrase: '19vns',
//     weekly_points: 1000,
//     administrator_id: 957,
//   }
// ];

// const createGroup = ( knex, group ) => {
//   return knex('group').insert({
//     group_name: group.name,
//     group_passphrase: group.group_passphrase,
//     weekly_points: group.weekly_points,
//     administrator_id: group.administrator_id
//   }, 'group_id');
// };

// exports.seed = function(knex, Promise) {
//   return knex('group').del()
//     .then(() => {
//       let groupPromises = [];
//       groupData.forEach(group => {
//         groupPromises.push(createGroup(knex, group));
//       });

//       return Promise.all(groupPromises);
//     })
//     .catch(error => console.log(`error seeding data: ${error}`))
// };


