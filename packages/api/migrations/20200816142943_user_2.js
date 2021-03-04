exports.up = async function (knex) {
  await knex.schema.alterTable('user', t => {
    t.renameColumn('psw', 'password')
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('user', t => {
    t.renameColumn('password', 'psw')
  })
}
