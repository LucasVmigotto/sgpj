exports.up = async function (knex) {
  await knex.schema.createTable('law_suit', t => {
    t.increments('law_suit_id')
    t.string('title', 100).notNullable()
    t.text('description').notNullable()
    t.timestamp('create_at').defaultTo(knex.fn.now())
    t.timestamp('update_at').defaultTo(knex.fn.now())
    t.integer('client_id').unsigned()
    t.foreign('client_id')
      .references('client_id')
      .inTable('client')
  })
  return knex('law_suit')
    .insert({
      title: 'Law Suit #1',
      description: 'Sample text',
      client_id: 1
    })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('law_suit')
}
