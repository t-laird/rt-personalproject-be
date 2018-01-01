const weeks = 
  { one:   Date.now(),
    two:   1512868287190,
    three: 1512263487190,
    four:  1511658687190,
    five:  1511053887190,
    six:   1510449087190,
    seven: 1509844287190,
    eight: 1509239487190,
    nine:  1508634687190,
    ten:   1508029887190 };

let transactionData = [
  {
    'send_id': 8,
    'receive_id': 5,
    'group_id': 1,
    'created_time': weeks.one, 
    'point_value': 10},
  {
    'send_id': 1,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.two,
    'point_value': 5},
  {
    'send_id': 8,
    'receive_id': 7,
    'group_id': 1,
    'created_time': weeks.two,    
    'point_value': 15},
  {
    'send_id': 2,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.three,    
    'point_value': 20},
  {
    'send_id': 2,
    'receive_id': 4,
    'group_id': 1,
    'created_time': weeks.one, 
    'point_value': 15},
  {
    'send_id': 1,
    'receive_id': 6,
    'group_id': 1,
    'created_time': weeks.two, 
    'point_value': 5},
  {
    'send_id': 4,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.eight,
    'point_value': 15,
    'send_name': 'Joe Montana',
    'note': 'Thanks for your help with JS array prototypes.  You totally crushed it!'
  },
  {
    'send_id': 5,
    'receive_id': 6,
    'group_id': 1,
    'created_time': weeks.nine,
    'point_value': 10},
  {
    'send_id': 3,
    'receive_id': 1,
    'group_id': 1,
    'created_time': weeks.ten,
    'point_value': 5},
  {
    'send_id': 6,
    'receive_id': 2,
    'group_id': 1,
    'created_time': weeks.three, 
    'point_value': 5},
  {
    'send_id': 8,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.four,    
    'point_value': 5},
  {
    'send_id': 1,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.one,   
    'point_value': 15,
    'send_name': 'Jerry Rice',
    'note': 'You totally killed it on your lightning talk this morning!  I loved it.'
  },
  {
    'send_id': 6,
    'receive_id': 2,
    'group_id': 1,
    'created_time': weeks.four, 
    'point_value': 10},
  {
    'send_id': 8,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.five,    
    'point_value': 10},
  {
    'send_id': 3,
    'receive_id': 1,
    'group_id': 1,
    'created_time': weeks.four, 
    'point_value': 5},
  {
    'send_id': 2,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.three, 
    'point_value': 15},
  {
    'send_id': 5,
    'receive_id': 4,
    'group_id': 1,
    'created_time': weeks.eight, 
    'point_value': 5},
  {
    'send_id': 8,
    'receive_id': 1,
    'group_id': 1,
    'created_time': weeks.one,
    'point_value': 10},
  {
    'send_id': 8,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.three,    
    'point_value': 25},
  {
    'send_id': 1,
    'receive_id': 5,
    'group_id': 1,
    'created_time': weeks.five, 
    'point_value': 20},
  {
    'send_id': 5,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.four,    
    'point_value': 20},
  {
    'send_id': 4,
    'receive_id': 5,
    'group_id': 1,
    'created_time': weeks.nine, 
    'point_value': 25},
  {
    'send_id': 8,
    'receive_id': 1,
    'group_id': 1,
    'created_time': weeks.five,    
    'point_value': 20},
  {
    'send_id': 2,
    'receive_id': 6,
    'group_id': 1,
    'created_time': weeks.ten,
    'point_value': 10},
  {
    'send_id': 1,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.two,
    'point_value': 10},
  {
    'send_id': 5,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.six,
    'point_value': 35},
  {
    'send_id': 8,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.three,    
    'point_value': 5},
  {
    'send_id': 5,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.two,    
    'point_value': 15},
  {
    'send_id': 4,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.one, 
    'point_value': 10},
  {
    'send_id': 1,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.two, 
    'point_value': 10},
  {
    'send_id': 5,
    'receive_id': 2,
    'group_id': 1,
    'created_time': weeks.five, 
    'point_value': 20},
  {
    'send_id': 5,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.three,    
    'point_value': 10},
  {
    'send_id': 1,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.two,
    'point_value': 10},
  {
    'send_id': 4,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.six,    
    'point_value': 25},
  {
    'send_id': 8,
    'receive_id': 1,
    'group_id': 1,
    'created_time': weeks.seven,    
    'point_value': 20}
];

const createEvent = (knex, event) => {
  return knex('eventtracking').insert({
    send_id: event.send_id,
    receive_id: event.receive_id,
    group_id: event.group_id,
    created_time: event.created_time,
    point_value: event.point_value,
    send_name: event.send_name,
    note: event.note
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