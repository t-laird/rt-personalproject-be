const weeks = 
  { one:    Date.now(),
    two:    1514682687190,
    three:  1514077887190,
    four:   1513473087190,
    five:   1512868287190,
    six:    1512263487190,
    seven:  1511658687190,
    eight:  1511053887190,
    nine:   1510449087190,
    ten:    1509844287190,
    eleven: 1509239487190,
    };

//60480

let transactionData = [
  {
    'send_id': 8,
    'receive_id': 5,
    'group_id': 1,
    'created_time': weeks.one, 
    'point_value': 10,
    'send_name': 'Rob Morgan',
    'note': 'Thanks!'
  },
  {
    'send_id': 11,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.two,
    'point_value': 5,
    'send_name': 'Gabriella Alvarez',
    'note': 'Grateful for your help with testing.'
  },
  {
    'send_id': 8,
    'receive_id': 7,
    'group_id': 1,
    'created_time': weeks.two,    
    'point_value': 15,
    'send_name': 'Rob Morgan',
    'note': 'You brought donuts!'
  },
  {
    'send_id': 2,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.three,    
    'point_value': 20,
    'send_name': 'Hugo Ferraro',
    'note': 'Holy moly thanks a lot!'
  },
  {
    'send_id': 2,
    'receive_id': 4,
    'group_id': 1,
    'created_time': weeks.one, 
    'point_value': 15,
    'send_name': 'Hugo Ferraro',
    'note': 'That lasagna T-shirt is lit.'
  },
  {
    'send_id': 1,
    'receive_id': 6,
    'group_id': 1,
    'created_time': weeks.two, 
    'point_value': 5,
    'send_name': 'Paavo Marsicek',
    'note': 'I owe you one!'
  },
  {
    'send_id': 4,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.eight,
    'point_value': 15,
    'send_name': 'Dominic Martelli',
    'note': 'Thanks for your help with JS array prototypes.  You totally crushed it!'
  },
  {
    'send_id': 5,
    'receive_id': 6,
    'group_id': 1,
    'created_time': weeks.nine,
    'point_value': 10,
    'send_name': 'Ronald Marshall',
    'note': 'Thank you!'
  },
  {
    'send_id': 3,
    'receive_id': 1,
    'group_id': 1,
    'created_time': weeks.ten,
    'point_value': 5,
    'send_name': 'Betsy Marsh',
    'note': 'You make a legit PBJ.'
  },
  {
    'send_id': 6,
    'receive_id': 2,
    'group_id': 1,
    'created_time': weeks.three, 
    'point_value': 5,
    'send_name': 'Ji Hyun Lee',
    'note': 'I like pizza.  And Redux.'
  },
  {
    'send_id': 8,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.four,    
    'point_value': 5,
    'send_name': 'Rob Morgan',
    'note': 'Your resume help was amazing.  Thanks a whole heap!'
  },
  {
    'send_id': 10,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.one,   
    'point_value': 15,
    'send_name': 'Jeev Singh',
    'note': 'You totally killed it on your lightning talk this morning!  I loved it.'
  },
  {
    'send_id': 6,
    'receive_id': 2,
    'group_id': 1,
    'created_time': weeks.four, 
    'point_value': 10,
    'send_name': 'Ji Hyun Lee',
    'note': 'Here, have some points for being extra rad'
  },
  {
    'send_id': 8,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.five,    
    'point_value': 10,
    'send_name': 'Rob Morgan',
    'note': 'Way to go'
  },
  {
    'send_id': 3,
    'receive_id': 1,
    'group_id': 1,
    'created_time': weeks.four, 
    'point_value': 5,
    'send_name': 'Betsy Marsh',
    'note': 'My app finally works!'
  },
  {
    'send_id': 2,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.three, 
    'point_value': 15,
    'send_name': 'Hugo Ferraro',
    'note': 'If React Testing were made out of Nutella, I would still avoid it.'
  },
  {
    'send_id': 5,
    'receive_id': 4,
    'group_id': 1,
    'created_time': weeks.eight, 
    'point_value': 5,
    'send_name': 'Ronald Marshall',
    'note': 'I need coffee'
  },
  {
    'send_id': 8,
    'receive_id': 1,
    'group_id': 1,
    'created_time': weeks.one,
    'point_value': 10,
    'send_name': 'Rob Morgan',
    'note': 'You brilliant sack of awesome'
  },
  {
    'send_id': 8,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.three,    
    'point_value': 25,
    'send_name': 'Rob Morgan',
    'note': 'We did it!'
  },
  {
    'send_id': 1,
    'receive_id': 5,
    'group_id': 1,
    'created_time': weeks.five, 
    'point_value': 20,
    'send_name': 'Paavo Marsicek',
    'note': 'Corgis forever!'
  },
  {
    'send_id': 14,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.four,    
    'point_value': 20,
    'send_name': 'Jimmy Decker',
    'note': 'Awesome lightning talk!'
  },
  {
    'send_id': 4,
    'receive_id': 5,
    'group_id': 1,
    'created_time': weeks.nine, 
    'point_value': 25,
    'send_name': 'Dominic Martelli',
    'note': 'Cleaning out the coffee machine deserves extra points!'
  },
  {
    'send_id': 8,
    'receive_id': 1,
    'group_id': 1,
    'created_time': weeks.five,    
    'point_value': 20,
    'send_name': 'Rob Morgan',
    'note': 'If you could buy a Coke with points, you would have tooth decay.'
  },
  {
    'send_id': 2,
    'receive_id': 6,
    'group_id': 1,
    'created_time': weeks.ten,
    'point_value': 10,
    'send_name': 'Hugo Ferraro',
    'note': 'Apples are yummy'
  },
  {
    'send_id': 12,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.two,
    'point_value': 10,
    'send_name': 'Vivian Liang',
    'note': 'Thank you!'
  },
  {
    'send_id': 5,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.six,
    'point_value': 35,
    'send_name': 'Ronald Marshall',
    'note': 'Winner!'
  },
  {
    'send_id': 2,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.six,
    'point_value': 35,
    'send_name': 'Hugo Ferraro',
    'note': 'Winner!'
  },
  {
    'send_id': 8,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.three,    
    'point_value': 5,
    'send_name': 'Rob Morgan',
    'note': 'Extra potatoes please.'
  },
  {
    'send_id': 17,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.two,    
    'point_value': 15,
    'send_name': 'Anders Karlsson',
    'note': 'Thank you for pairing with me yesterday!  It all makes sense now.'
  },
  {
    'send_id': 4,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.one, 
    'point_value': 10,
    'send_name': 'Dominic Martelli',
    'note': 'Thanks for the ride home!'
  },
  {
    'send_id': 1,
    'receive_id': 3,
    'group_id': 1,
    'created_time': weeks.two, 
    'point_value': 10,
    'send_name': 'Paavo Marsicek',
    'note': 'Your homemade guacamole is amazing'
  },
  {
    'send_id': 5,
    'receive_id': 2,
    'group_id': 1,
    'created_time': weeks.five, 
    'point_value': 20,
    'send_name': 'Ronald Marshall',
    'note': 'Thanks for letting me beat you at pool'
  },
  {
    'send_id': 5,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.three,    
    'point_value': 10,
    'send_name': 'Ronald Marshall',
    'note': 'Tacos make me happy.'
  },
  {
    'send_id': 1,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.two,
    'point_value': 10,
    'send_name': 'Paavo Marsicek',
    'note': 'I did not think we would ever get finished with testing.'  
  },
  {
    'send_id': 4,
    'receive_id': 8,
    'group_id': 1,
    'created_time': weeks.six,    
    'point_value': 25,
    'send_name': 'Dominic Martelli',
    'note': 'Project demolished.  Good work!'
  },
  {
    'send_id': 8,
    'receive_id': 1,
    'group_id': 1,
    'created_time': weeks.seven,    
    'point_value': 20,
    'send_name': 'Rob Morgan',
    'note': 'At last, we have reached the end'
  },
  {
    'send_id': 8,
    'receive_id': 2,
    'group_id': 1,
    'created_time': weeks.two,    
    'point_value': 20,
    'send_name': 'Rob Morgan',
    'note': 'You are super rad!'
  }
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