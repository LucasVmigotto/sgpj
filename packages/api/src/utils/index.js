const graphqlFields = require('graphql-fields')
const config = require('../config')
const crypto = require('crypto')

const requestedFields = info => {
  const fields = graphqlFields(info)
  return fields.items
    ? Object.keys(fields.items)
      .map(el => decamelize(el))
    : Object.keys(fields)
      .map(el => decamelize(el))
}

const cipher = password => {
  const cipher = crypto.createCipheriv(
    config.CIPHER_ALGORITHM,
    crypto.scryptSync(password, config.CIPHER_SALT, 24),
    Buffer.alloc(16, 0))
  return cipher.update(password, 'utf8', 'hex') + cipher.final('hex')
}

module.exports = {
  requestedFields,
  cipher
}
