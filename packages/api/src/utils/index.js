const config = require('../config')
const crypto = require('crypto')

const cipher = password => {
  const cipher = crypto.createCipheriv(
    config.CIPHER_ALGORITHM,
    crypto.scryptSync(password, config.CIPHER_SALT, 24),
    Buffer.alloc(16, 0))
  return cipher.update(password, 'utf8', 'hex') + cipher.final('hex')
}

module.exports = {
  cipher
}
