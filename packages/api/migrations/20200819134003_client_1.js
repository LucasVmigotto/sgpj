
exports.up = async function (knex) {
  await knex.schema.createTable('client', t => {
    t.increments('client_id')
    t.string('name', 250).notNullable()
    t.string('cpf', 11).notNullable()
    t.string('email', 250)
    t.string('phone').notNullable()
    t.integer('lawyer_id').unsigned()
    t.timestamp('create_at').defaultTo(knex.fn.now())
    t.timestamp('update_at').defaultTo(knex.fn.now())
    t.foreign('lawyer_id')
      .references('lawyer_id')
      .inTable('lawyer')
      .onDelete('CASCADE')
    t.unique('cpf')
    t.unique('email')
    t.unique('phone')
  })
  return knex('client')
    .insert({
      name: 'Client John',
      cpf: '39844309843',
      email: 'mail@mail.com',
      phone: '849334502',
      lawyer_id: 1
    })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('client')
}
