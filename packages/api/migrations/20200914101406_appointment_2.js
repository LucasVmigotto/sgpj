
exports.up = async function (knex) {
  await knex.schema.alterTable('appointment', t => {
    t.renameColumn('event_date', 'event_start')
    t.timestamp('event_end')
  })
  await knex('appointment')
    .update({
      event_end: new Date().toISOString()
    })
  return knex.schema.alterTable('appointment', t => {
    t.timestamp('event_end').notNullable().alter()
  })
}
exports.down = async function (knex) {
  return knex.schema.alterTable('appointment', t => {
    t.dropColumn('event_end')
    t.renameColumn('event_start', 'event_date')
  })
}
