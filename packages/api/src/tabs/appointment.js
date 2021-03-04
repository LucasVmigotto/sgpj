const config = require('../config')

module.exports = ({ endpoint, readFile }) => ({
  endpoint,
  name: 'Appointment',
  query: readFile('./appointment.gql'),
  variables: `{
    "lawyer": "${config.PLAYGROUND_TOKEN_LAWYER}"
  }`
})
