exports.up = function(knex, Promise) {
  return knex.schema.createTable('group', function(table) {
    table.increments('group_id').primary();
    table.string('group_name');
    table.string('group_passphrase')
    table.integer('weekly_points');
    table.integer('administrator_id');
    table.timestamp('created_date').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('group');
};
