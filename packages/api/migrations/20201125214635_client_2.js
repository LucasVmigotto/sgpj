exports.up = async function (knex) {
  await knex.schema.alterTable('client', t => {
    t.renameColumn('cpf', 'register')
  })
  await knex.schema.alterTable('client', t => {
    t.string('register', 14).notNullable().alter()
    t.string('client_type', 3).notNullable().defaultTo('FIS')
  })
  return knex('client')
    .update({
      client_type: 'FIS'
    })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('client', t => {
    t.renameColumn('register', 'cpf')
  })
  await knex.schema.alterTable('client', t => {
    t.string('cpf', 11).notNullable().alter()
    t.dropColumn('client_type')
  })
}
