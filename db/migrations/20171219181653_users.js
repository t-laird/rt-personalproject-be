exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments('user_id').primary();
    table.timestamp('created_date').defaultTo(knex.fn.now());
    table.integer('group_id');
    table.string('email');
    table.string('name');
    table.string('authrocket_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
