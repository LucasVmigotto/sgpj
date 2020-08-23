const { gql } = require('apollo-server-express')
const { cipher, signJWT } = require('../utils')
const { tokenGraphQLResolver } = require('../security')

const typeDefs = gql`
  type User {
    userId: ID!
    email: String!
    password: String
  }

  type UserList {
    count: Int!
    items: [User]!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type LawyerAuth {
    token: String!
    lawyer: Lawyer
  }

  extend type Mutation {
    authorization(token: String!): Lawyer
    login(credentials: UserInput!): LawyerAuth!
  }
`

const resolvers = {
  Mutation: {
    authorization: tokenGraphQLResolver,
    async login (_, { credentials }, context) {
      const [res] = await context.knex('user')
        .select('lawyer_id')
        .where({
          ...credentials,
          password: cipher(credentials.password)
        })
      if (!res) {
        throw new Error('Email or Password invalid')
      }
      const [data] = await context.knex('lawyer')
        .select(
          'lawyer_id',
          'name',
          'roles',
          'create_at',
          'update_at'
        )
        .where({ 'lawyer.lawyer_id': res.lawyer_id })
      const lawyer = {
        lawyerId: data.lawyer_id,
        name: data.name,
        roles: data.roles,
        createAt: data.create_at,
        updateAt: data.update_at
      }
      context.lawyer = lawyer
      return {
        token: signJWT(lawyer),
        lawyer
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
