module.exports = ({ endpoint, readFile }) => ({
  endpoint,
  name: 'Appointment',
  query: readFile('./appointment.gql')
})
