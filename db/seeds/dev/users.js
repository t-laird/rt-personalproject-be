let transactionData = [
  {
    'send_id': 123,
    'receive_id': 456,
    'group_id': 789,
    'point_value': 5},
  {
    'send_id': 123,
    'receive_id': 456,
    'group_id': 789,
    'point_value': 5}
];

const createEvent = (knex, event) => {
  return knex('eventtracking').insert({
    send_id: event.send_id,
    receive_id: event.receive_id,
    group_id: event.group_id,
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
