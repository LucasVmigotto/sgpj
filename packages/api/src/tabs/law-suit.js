const config = require('../config')

module.exports = ({ endpoint, readFile }) => ({
  endpoint,
  name: 'Law Suit',
  query: readFile('./law-suit.gql'),
  variables: `{
    "lawyer": "${config.PLAYGROUND_TOKEN_LAWYER}"
  }`
})
