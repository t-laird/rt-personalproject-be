const weeks = 
  { one:   1514162103004,
    two:   1512868287190,
    three: 1512263487190,
    four:  1511658687190,
    five:  1511053887190 };

let transactionData = [
  {
    'send_id': 1,
    'receive_id': 5,
    'group_id': 789,
    'created_time': weeks.one, 
    'point_value': 10},
  {
    'send_id': 1,
    'receive_id': 5,
    'group_id': 789,
    'created_time': weeks.two,
    'point_value': 5},
  {
    'send_id': 1,
    'receive_id': 7,
    'group_id': 789,
    'created_time': weeks.two,    
    'point_value': 15},
  {
    'send_id': 2,
    'receive_id': 1,
    'group_id': 789,
    'created_time': weeks.three,    
    'point_value': 20},
  {
    'send_id': 2,
    'receive_id': 3,
    'group_id': 789,
    'created_time': weeks.four,    
    'point_value': 5},
  {
    'send_id': 1,
    'receive_id': 5,
    'group_id': 789,
    'created_time': weeks.one,   
    'point_value': 15},
  {
    'send_id': 1,
    'receive_id': 3,
    'group_id': 789,
    'created_time': weeks.five,    
    'point_value': 10},
  {
    'send_id': 2,
    'receive_id': 1,
    'group_id': 789,
    'created_time': weeks.one,
    
    'point_value': 10},
  {
    'send_id': 4,
    'receive_id': 3,
    'group_id': 789,
    'created_time': weeks.three,    
    'point_value': 25},
  {
    'send_id': 5,
    'receive_id': 3,
    'group_id': 789,
    'created_time': weeks.one,    
    'point_value': 20}
];

const createEvent = (knex, event) => {
  return knex('eventtracking').insert({
    send_id: event.send_id,
    receive_id: event.receive_id,
    group_id: event.group_id,
    created_time: event.created_time,
    point_value: event.point_value
  }, 'event_id');
};

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('eventtracking').del()
    .then(() => {
      let eventPromises = [];

      transactionData.forEach(event => {
        eventPromises.push(createEvent(knex, event));
      });

      return Promise.all(eventPromises);
    })
    .catch(error => console.log(`error seeding data: ${error}`))
};