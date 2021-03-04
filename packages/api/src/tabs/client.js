const config = require('../config')

module.exports = ({ endpoint, readFile }) => ({
  endpoint,
  name: 'Client',
  query: readFile('./client.gql'),
  variables: `{
    "lawyer": "${config.PLAYGROUND_TOKEN_LAWYER}"
  }`
})
