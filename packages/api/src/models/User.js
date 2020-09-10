const { gql } = require('apollo-server-express')
const { camelizeKeys } = require('humps')
const { cipher, signJWT } = require('../utils')
const { tokenGraphQLResolver, hasAuthorization } = require('../security')

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
    updateEmail(lawyerId: ID!, email: String!): User!
    updatePassword(lawyerId: ID!, password: String!): Boolean!
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
          'oab',
          'create_at',
          'update_at'
        )
        .where({ 'lawyer.lawyer_id': res.lawyer_id })
      const lawyer = {
        lawyerId: data.lawyer_id,
        name: data.name,
        roles: data.roles,
        oab: data.oab,
        createAt: data.create_at,
        updateAt: data.update_at
      }
      context.lawyer = lawyer
      return {
        token: signJWT(lawyer),
        lawyer
      }
    },
    async updateEmail (_, { lawyerId, email }, { knex, lawyer }) {
      hasAuthorization(lawyer)
      const [exists] = await knex('user')
        .select('email')
        .where({ email })
      if (exists) {
        throw new Error('This email already has been taken')
      }
      const [data] = await knex('user')
        .update({ email })
        .where({ lawyer_id: lawyerId })
        .returning(['user_id', 'email'])
      return camelizeKeys(data)
    },
    async updatePassword (_, { lawyerId, password }, { knex, lawyer }) {
      hasAuthorization(lawyer)
      const [data] = await knex('user')
        .update({ password: cipher(password) })
        .where({ lawyer_id: lawyerId })
        .returning(['user_id', 'email'])
      return !!data
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
