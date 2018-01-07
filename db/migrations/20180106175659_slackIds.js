exports.up = function(knex, Promise) {
  return knex.schema.createTable('slackIds', function(table) {
    table.increments('id').primary();
    table.string('slack_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('slackIds');
};
