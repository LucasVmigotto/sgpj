const config = require('../config')
const crypto = require('crypto')

const cipher = password => {
  const cipher = crypto.createCipheriv(
    config.CIPHER_ALGORITHM,
    crypto.scryptSync(password, config.CIPHER_SALT, 24),
    Buffer.alloc(16, 0))
  return cipher.update(password, 'utf8', 'hex') + cipher.final('hex')
}

const getClients = async (knex, lawyerId) => await knex('client')
  .select(
    'client_id',
    'name',
    'cpf',
    'email',
    'phone',
    'create_at',
    'update_at',
  )
  .where({ lawyer_id: lawyerId})

module.exports = {
  cipher,
  getClients
}
