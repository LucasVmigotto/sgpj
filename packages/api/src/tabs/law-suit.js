module.exports = ({ endpoint, readFile }) => ({
  endpoint,
  name: 'Law Suit',
  query: readFile('./law-suit.gql')
})
