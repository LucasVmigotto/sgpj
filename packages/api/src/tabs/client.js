module.exports = ({ endpoint, readFile }) => ({
  endpoint,
  name: 'Client',
  query: readFile('./client.gql')
})
