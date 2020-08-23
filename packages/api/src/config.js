module.exports = {
  PORT: process.env.PORT || 4000,
  HOST: process.env.HOST || '0.0.0.0',
  ENDPOINT: process.env.ENDPOINT || '/api/graphql',
  CIPHER_ALGORITHM: process.env.CIPHER_ALGORITHM || 'aes-192-cbc',
  CIPHER_SALT: process.env.CIPHER_SALT || 'salt',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-key',
  JWT_EXP: process.env.JWT_EXP || '7d',
  PG_CONNECTION_STRING: process.env.PG_CONNECTION_STRING || 'postgresql://user:rootroot@pg/sgpj_db',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  PLAYGROUND_TOKEN_ADMIN: process.env.PLAYGROUND_TOKEN_ADMIN ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsYXd5ZXJJZCI6MSwibmFtZSI6IkpvaG4gRG9lIiwicm9sZXMiOlsiQURNSU4iXSwidXNlciI6eyJ1c2VySWQiOjEsImVtYWlsIjoiZmFrZUBtYWlsLmNvbSJ9LCJjcmVhdGVBdCI6IjIwMjAtMDgtMjJUMTg6MjQ6NTkuNjcyWiIsInVwZGF0ZUF0IjoiMjAyMC0wOC0yMlQxODoyNDo1OS42NzJaIiwiaWF0IjoxNTk4MTIwNzQ4LCJleHAiOjk1OTg3MjU1NDh9.IvSRNeOtjEKg72qnUVqdLfxIu-_cRYALnGR3V3gJ7_U',
  PLAYGROUND_TOKEN_LAWYER: process.env.PLAYGROUND_TOKEN_LAWYER ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsYXd5ZXJJZCI6MSwibmFtZSI6IkpvaG4gRG9lIiwicm9sZXMiOlsiTEFXWUVSIl0sInVzZXIiOnsidXNlcklkIjoxLCJlbWFpbCI6ImZha2VAbWFpbC5jb20ifSwiY3JlYXRlQXQiOiIyMDIwLTA4LTIyVDE4OjI0OjU5LjY3MloiLCJ1cGRhdGVBdCI6IjIwMjAtMDgtMjJUMTg6MjQ6NTkuNjcyWiIsImlhdCI6MTU5ODEyMDc0OCwiZXhwIjo5NTk4NzI1NTQ4fQ.9KO0lSey3nuzmin7XVMf2IM8CZAY5C_bT37Fm46bLXI',
  NODE_ENV: process.env.NODE_ENV || 'dev',
  APOLLO_SERVER_DEBUG: process.env.APOLLO_SERVER_DEBUG === undefined ||
    process.env.APOLLO_SERVER_DEBUG === 'true'
}
