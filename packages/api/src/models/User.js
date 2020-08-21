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
      const [res] = await knex('user')
        .select('lawyer_id')
        .where({
          ...input,
          password: cipher(input.password)
        })
      if (!res) {
        throw new Error('Email or Password invalid')
      }
      const [data] = await knex('lawyer')
        .select(
          'lawyer_id',
          'name',
          'roles',
          'create_at',
          'update_at'
        )
        .where({ 'lawyer.lawyer_id': res.lawyer_id })
      return {
        lawyerId: data.lawyer_id,
        name: data.name,
        roles: data.roles,
        createAt: data.create_at,
        updateAt: data.update_at
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
