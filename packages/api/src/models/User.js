const { gql } = require('apollo-server-express')
const { cipher } = require('../utils')

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

  extend type Query {
    login(input: UserInput!): Lawyer!
  }
`

const resolvers = {
  Query: {
    async login (_, { input }, { knex }) {
      const [{ user_id: userId }] = await knex('user')
        .select('user_id')
        .where({
          ...input,
          password: cipher(input.password)
        })
      if (!userId) {
        throw new Error('Email or Password invalid')
      }
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
        .where({ 'lawyer.user_id': userId })
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
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
