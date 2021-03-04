const config = require('../config')

module.exports = ({ endpoint, readFile }) => ({
  endpoint,
  name: 'Note',
  query: readFile('./note.gql'),
  variables: `{
    "lawyer": "${config.PLAYGROUND_TOKEN_LAWYER}"
  }`
})
