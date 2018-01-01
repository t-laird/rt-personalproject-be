exports.up = function(knex, Promise) {
  return knex.schema.createTable('eventtracking', function(table) {
    table.increments('event_id').primary();
    table.timestamp('event_time').defaultTo(knex.fn.now());
    table.integer('send_id');
    table.bigint('created_time');
    table.integer('receive_id');
    table.integer('group_id');
    table.integer('point_value');
    table.text('send_name');
    table.text('note');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('eventtracking');
};
