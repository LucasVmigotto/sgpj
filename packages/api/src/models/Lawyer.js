const { gql } = require('apollo-server-express')
const { camelizeKeys } = require('humps')
const { cipher, getClients } = require('../utils')
const graphqlFields = require('graphql-fields')

const typeDefs = gql`
  type Lawyer {
    lawyerId: ID!
    name: String!
    user: User!
    roles: [String]!
    oab: String!
    clients: [Client]!
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
    user: UserInput
    oab: String!
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
    clients: ({ lawyerId }, _, { knex }) => {
      return getClients(knex, lawyerId)
        .then(res => res.map(el => camelizeKeys(el)))
    }
  },
  Query: {
    async lawyer (_, { lawyerId }, { knex }) {
      const [data] = await knex('lawyer')
        .select(
          'lawyer.lawyer_id',
          'lawyer.name',
          'lawyer.roles',
          'lawyer.oab',
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
        oab: data.oab,
        user: {
          userId: data.user_id,
          email: data.email
        }
      }
    },
    async lawyers (_, { limit = 100, offset = 0 }, { knex }) {
      const data = await knex('lawyer')
        .select(
          'lawyer.lawyer_id',
          'lawyer.name',
          'lawyer.roles',
          'lawyer.oab',
          'lawyer.create_at',
          'lawyer.update_at',
          'user.user_id',
          'user.email'
        )
        .join('user', { 'lawyer.user_id': 'user.user_id' })
        .limit(limit)
        .offset(offset)
      const [{ count }] = await knex('lawyer').count('lawyer_id')
      return {
        count,
        items: data.map(el => {
          return {
            lawyerId: el.lawyer_id,
            name: el.name,
            roles: el.roles,
            createAt: el.create_at,
            updateAt: el.update_at,
            oab: el.oab,
            user: {
              userId: el.user_id,
              email: el.email
            }
          }
        })
      }
    }
  },
  Mutation: {
    async persistLawyer (_, { lawyerId, input }, { knex }, info) {
      const lawyer = {
        name: input.name,
        roles: input.roles.length === 0
          ? ['LAWYER']
          : input.roles,
        oab: input.oab
      }
      if (lawyerId) {
        let [newLawyer] = await knex('lawyer')
          .update({
            ...lawyer,
            update_at: new Date().toISOString()
          })
          .where({ lawyer_id: lawyerId })
          .returning('*')
        if (graphqlFields(info).user) {
          const [user] = await knex('user')
            .select('user_id', 'email')
            .where({ user_id: newLawyer.user_id })
          newLawyer = {
            ...newLawyer,
            user: camelizeKeys(user)
          }
          delete newLawyer.user_id
        }
        return camelizeKeys(newLawyer)
      } else {
        if (!input.user) {
          throw new Error('To create a new Lawyer, first you must inform the user access info')
        }
        const user = {
          email: input.user.email,
          password: cipher(input.user.password)
        }
        const [newUser] = await knex('user')
          .insert({ ...user })
          .returning(['user_id', 'email'])
        const [newLawyer] = await knex('lawyer')
          .insert({
            ...lawyer,
            user_id: newUser.user_id
          })
          .returning('*')
        return {
          ...camelizeKeys(newLawyer),
          user: {
            ...camelizeKeys(newUser)
          }
        }
      }
    },
    async deleteLawyer (_, { lawyerId }, { knex, logger }) {
      const [{ user_id: userId }] = await knex('lawyer')
        .select('user_id')
        .where({ lawyer_id: lawyerId })
      const data = await knex('user')
        .where({ user_id: userId })
        .del()
      return !!data
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
