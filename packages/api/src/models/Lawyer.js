const { gql } = require('apollo-server-express')
const { camelizeKeys } = require('humps')
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
  Query: {
    async lawyer (_, { lawyerId }, { knex }) {
      const [data] = await knex('lawyer')
        .select(
          'lawyer.lawyer_id',
          'lawyer.name',
          'lawyer.roles',
          'lawyer.create_at',
          'lawyer.update_at',
          'user.user_id',
          'user.email'
        )
        .where({ 'lawyer.lawyer_id': lawyerId })
        .join('user', { 'lawyer.user_id': 'user.user_id' })
      return {
        lawyerId: data.lawyer_id,
        name: data.name,
        roles: data.roles,
        createAt: data.create_at,
        updateAt: data.update_at,
        user: {
          userId: data.user_id,
          email: data.email
        }
      }
    },
    async lawyers (_, { limit = 100, offset = 0 }, { knex }) {
      return { count: 1, items: [] }
    }
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
