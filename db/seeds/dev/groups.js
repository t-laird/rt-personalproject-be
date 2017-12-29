let groupData = [
  {
    group_name: 'turing',
    group_passphrase: '9139z',
    weekly_points: 100,
    administrator_id: 8,
  },
  {
    group_name: 'facebook',
    group_passphrase: '19vns',
    weekly_points: 1000,
    administrator_id: 957,
  },
  {
    group_name: 'twitter',
    group_passphrase: '19cix',
    weekly_points: 100,
    administrator_id: 957,
  },
  {
    group_name: 'google',
    group_passphrase: '31uza',
    weekly_points: 100,
    administrator_id: 957,
  },
];                                    

const createGroup = ( knex, group ) => {
  return knex('group').insert({
    group_name: group.name,
    group_passphrase: group.group_passphrase,
    weekly_points: group.weekly_points,
    administrator_id: group.administrator_id
  }, 'group_id');
};

exports.seed = function(knex, Promise) {
  return knex('group').del()
    .then(() => {
      let groupPromises = [];
      groupData.forEach(group => {
        groupPromises.push(createGroup(knex, group));
      });

      return Promise.all(groupPromises);
    })
    .catch(error => console.log(`error seeding data: ${error}`))
};
