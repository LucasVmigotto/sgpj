
exports.up = async function (knex) {
  await knex.schema.alterTable('lawyer', t => {
    t.dropColumn('user_id')
  })
  await knex.schema.alterTable('user', t => {
    t.integer('lawyer_id').unsigned()
    t.foreign('lawyer_id')
      .references('lawyer_id')
      .inTable('lawyer')
      .onDelete('CASCADE')
  })
  return knex('user')
    .update({ lawyer_id: 1 })
    .where({ user_id: 1 })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('user', t => {
    t.dropColumn('lawyer_id')
  })
  await knex.schema.alterTable('lawyer', t => {
    t.integer('user_id').unsigned()
    t.foreign('user_id')
      .references('user_id')
      .inTable('user')
      .onDelete('CASCADE')
  })
  return knex('lawyer')
    .update({ user_id: 1 })
    .where({ lawyer_id: 1 })
}
