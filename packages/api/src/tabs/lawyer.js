module.exports = ({ endpoint, readFile }) => ({
  endpoint,
  name: 'Lawyer',
  query: readFile('./lawyer.gql')
})
