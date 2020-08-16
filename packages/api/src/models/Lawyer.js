const { gql } = require('apollo-server-express')
// const { camelizeKeys } = require('humps')
// const { requestedFields } = require('../utils')
// const debug = require('debug')('api:[models]user=>')

const typeDefs = gql`
  type Lawyer {
    lawyerId: ID!
    name: String!
    user: User!
    roles: [String]!
    createAt: DateTime!
    updateAt: DateTime!
  }

  type LawyerList {
    count: Int!
    items: [Lawyer]!
  }

  input LawyerInput {
    name: String!
    roles: [String]!
    user: UserInput!
  }

  extend type Query {
    lawyer(lawyerId: ID!): Lawyer!
    lawyers(limit: Int, offset: Int): LawyerList!
  }

  extend type Mutation {
    persistLawyer(lawyerId: ID, input: LawyerInput!): Lawyer!
    deleteLawyer(lawyerId: ID!): Boolean
  }
`

const resolvers = {
  Lawyer: {
    user: ({ lawyerId }, args, { knex }) => {}
  },
  Query: {
    async lawyer (_, { lawyerId }, { knex }) {},
    async lawyers (_, { limit = 100, offset = 0 }, { knex }) {}
  },
  Mutation: {
    async persistLawyer (_, { lawyerId, input }, { knex }) {},
    async deleteLawyer (_, { lawyerId }, { knex, logger }) {}
  }
}

module.exports = {
  typeDefs,
  resolvers
}
