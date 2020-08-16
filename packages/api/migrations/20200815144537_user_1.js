require('dotenv').config()
const { cipher } = require('../src/utils')

exports.up = async function (knex) {
  await knex.schema.createTable('user', t => {
    t.increments('user_id')
    t.string('email', 250).notNullable()
    t.string('psw').notNullable()
    t.unique('email')
  })
  await knex('user').insert({
    email: 'admin@admin.com',
    psw: cipher('rootroot')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('user')
}
