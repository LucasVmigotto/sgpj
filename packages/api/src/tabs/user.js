module.exports = ({ endpoint, readFile }) => ({
  endpoint,
  name: 'User',
  query: readFile('./user.gql')
})
