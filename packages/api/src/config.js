module.exports = {
  PORT: process.env.PORT || 4000,
  HOST: process.env.HOST || '0.0.0.0',
  ENDPOINT: process.env.ENDPOINT || '/api/graphql',
  CIPHER_ALGORITHM: process.env.CIPHER_ALGORITHM || 'aes-192-cbc',
  CIPHER_SALT: process.env.CIPHER_SALT || 'salt',
  PG_CONNECTION_STRING: process.env.PG_CONNECTION_STRING || 'postgresql://user@pg/sgpj_db',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  NODE_ENV: process.env.NODE_ENV || 'dev',
  APOLLO_SERVER_DEBUG: process.env.APOLLO_SERVER_DEBUG === undefined ||
    process.env.APOLLO_SERVER_DEBUG === 'true'
}
