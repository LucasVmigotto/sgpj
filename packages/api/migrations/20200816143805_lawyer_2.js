exports.up = async function (knex) {
  await knex.schema.alterTable('lawyer', t => {
    t.specificType('roles', 'text[]')
      .notNullable()
      .alter()
    t.dropForeign('user_id')
    t.foreign('user_id')
      .references('user_id')
      .inTable('user')
      .onDelete('CASCADE')
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('lawyer', t => {
    t.specificType('roles', 'text[]')
      .defaultTo('{\'LAWYER\'}')
      .alter()
    t.dropForeign('user_id')
    t.foreign('user_id')
      .references('user_id')
      .inTable('user')
  })
}
