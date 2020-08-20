
exports.up = async function (knex) {
  await knex.schema.createTable('appointment', t => {
    t.increments('appointment_id')
    t.string('title', 100).notNullable()
    t.text('description').notNullable()
    t.timestamp('event_date').notNullable()
    t.timestamp('create_at').defaultTo(knex.fn.now())
    t.timestamp('update_at').defaultTo(knex.fn.now())
    t.integer('lawyer_id').unsigned()
    t.integer('client_id').unsigned()
    t.integer('law_suit_id').unsigned()
    t.foreign('lawyer_id')
      .references('lawyer_id')
      .inTable('lawyer')
      .onDelete('CASCADE')
    t.foreign('client_id')
      .references('client_id')
      .inTable('client')
      .onDelete('CASCADE')
    t.foreign('law_suit_id')
      .references('law_suit_id')
      .inTable('law_suit')
      .onDelete('CASCADE')
  })
  return knex('appointment')
    .insert({
      title: 'Appointment Title',
      description: 'Apointment Description',
      event_date: new Date().toISOString(),
      lawyer_id: 1,
      client_id: 1,
      law_suit_id: 1
    })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('appointment')
}
