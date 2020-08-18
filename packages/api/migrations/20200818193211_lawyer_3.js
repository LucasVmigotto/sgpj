exports.up = async function (knex) {
  await knex.schema.alterTable('lawyer', t => {
    t.string('oab', 7)
    t.unique('oab')
  })
  await knex('lawyer')
    .update({ oab: '1234567' })
    .where({ lawyer_id: 1 })
  await knex.schema.alterTable('lawyer', t => {
    t.string('oab', 7).notNullable().alter()
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('lawyer', t => {
    t.dropColumn('oab')
  })
}
