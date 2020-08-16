const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type User {
    userId: ID!
    email: String!
    password: String!
  }

  type UserList {
    count: Int!
    items: [User]!
  }

  input UserInput {
    email: String!
    password: String!
  }
`
module.exports = {
  typeDefs
}
