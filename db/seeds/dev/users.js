let userData = [
  {
    group_id: 3,
    email:'sjf@gmail.com',
    name: 'Bob Smith',
    authrocket_id: "ajwoc1k3j342"
  },
  {
    group_id: 4,
    email: 'abcf@gmail.com',
    name: 'Mike Jenkins',
    authrocket_id: "jfnxcio42393"
  },
  {
    group_id: 4,
    email: 'qwi123@gmail.com',
    name: 'Josh Brown',
    authrocket_id: "lksdfjn23413"
  },
  {
    group_id: 4,
    email: '293xcnv@gmail.com',
    name: 'Alan Michaelson',
    authrocket_id: "xmcv3941nv"
  },
  {
    group_id: 4,
    email: 'nc-1n23a@gmail.com',
    name: 'Sarah Hilman',
    authrocket_id: "3490xxa1j"
  },
  {
    group_id: 3,
    email: 'xmhhh@gmail.com',
    name: 'Jane Johnson',
    authrocket_id: "123jlkaf"
  },
  {
    group_id: 3,
    email: 'bnzx9123@gmail.com',
    name: 'Ally Benson',
    authrocket_id: "zxqweio933"
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

