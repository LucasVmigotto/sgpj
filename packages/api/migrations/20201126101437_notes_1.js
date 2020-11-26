
exports.up = async function (knex) {
  await knex.schema.createTable('note', t => {
    t.increments('note_id')
    t.text('text').notNullable()
    t.timestamp('create_at').defaultTo(knex.fn.now())
    t.timestamp('update_at').defaultTo(knex.fn.now())
    t.integer('law_suit_id').unsigned()
    t.foreign('law_suit_id')
      .references('law_suit_id')
      .inTable('law_suit')
      .onDelete('CASCADE')
  })
  return knex('note')
    .insert({
      text: 'Note text description',
      law_suit_id: 1
    })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('note')
}
