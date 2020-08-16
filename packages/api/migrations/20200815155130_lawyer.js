
exports.up = async function (knex) {
  await knex.schema.createTable('lawyer', t => {
    t.increments('lawyer_id')
    t.string('name', 250).notNullable()
    t.specificType('roles', 'text[]').defaultTo(`{'LAWYER'}`)
    t.timestamp('create_at').defaultTo(knex.fn.now())
    t.timestamp('update_at').defaultTo(knex.fn.now())
    t.integer('user_id').unsigned()
    t.foreign('user_id').references('user_id').inTable('user')
  })
  await knex('lawyer').insert({
    name: 'John Doe',
    roles: ['ADMIN'],
    user_id: '1'
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('lawyer')
}
