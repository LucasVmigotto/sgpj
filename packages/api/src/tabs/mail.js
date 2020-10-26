const config = require('../config')

module.exports = ({ endpoint, readFile }) => ({
  endpoint,
  name: 'Mail',
  query: readFile('./mail.gql'),
  variables: `{
    "lawyer": "${config.PLAYGROUND_TOKEN_LAWYER}"
  }`
})
