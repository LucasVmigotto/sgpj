const { gql } = require('apollo-server-express')
const { camelizeKeys } = require('humps')
const { hasAuthorization } = require('../security')
const {
  UserTypes,
  cipher,
  getClients,
  getUser,
  getAppointments,
  promiseHandler
} = require('../utils')

const typeDefs = gql`
  type Lawyer {
    lawyerId: ID!
    name: String!
    user: User!
    roles: [String]!
    oab: String!
    clients: [Client]!
    appointments: [Appointment]!
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

  extend type Viewer {
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
    user: async ({ lawyerId }, _, { knex }) => {
      const [user] = await promiseHandler(getUser(knex, lawyerId))
      return user
    },
    clients: ({ lawyerId }, _, { knex }) => {
      return promiseHandler(getClients(knex, lawyerId))
    },
    appointments: ({ lawyerId }, _, { knex }) => {
      return promiseHandler(getAppointments(knex, lawyerId, 'LAWYER'))
    }
  },
  Viewer: {
    async lawyer (_, { lawyerId }, { knex }) {
      const [data] = await knex('lawyer')
        .select(
          'lawyer_id',
          'name',
          'roles',
          'oab',
          'create_at',
          'update_at'
        )
        .where({ 'lawyer.lawyer_id': lawyerId })
      return {
        lawyerId: data.lawyer_id,
        name: data.name,
        roles: data.roles,
        oab: data.oab,
        createAt: data.create_at,
        updateAt: data.update_at
      }
    },
    async lawyers (_, { limit = 100, offset = 0 }, { knex }) {
      const data = await knex('lawyer')
        .select(
          'lawyer_id',
          'name',
          'roles',
          'oab',
          'create_at',
          'update_at'
        )
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
            oab: el.oab,
            createAt: el.create_at,
            updateAt: el.update_at
          }
        })
      }
    }
  },
  Mutation: {
    async persistLawyer (_, { lawyerId, input }, { knex, lawyer }) {
      hasAuthorization(lawyer)
      const addLawyer = {
        name: input.name,
        roles: input.roles.length === 0
          ? ['LAWYER']
          : input.roles,
        oab: input.oab
      }
      if (lawyerId) {
        const [newLawyer] = await knex('lawyer')
          .update({
            ...addLawyer,
            update_at: new Date().toISOString()
          })
          .where({ lawyer_id: lawyerId })
          .returning('*')
        return camelizeKeys(newLawyer)
      } else {
        if (!input.user) {
          throw new Error('To create a new Lawyer, first you must inform the user access info')
        }
        const user = {
          email: input.user.email,
          password: cipher(input.user.password)
        }
        const [newLawyer] = await knex('lawyer')
          .insert({ ...addLawyer })
          .returning('*')
        const [newUser] = await knex('user')
          .insert({
            ...user,
            lawyer_id: newLawyer.lawyer_id
          })
          .returning(['user_id', 'email'])
        return {
          ...camelizeKeys(newLawyer),
          user: {
            ...camelizeKeys(newUser)
          }
        }
      }
    },
    async deleteLawyer (_, { lawyerId }, { knex, lawyer }) {
      hasAuthorization(lawyer, UserTypes.ADMIN)
      const data = await knex('lawyer')
        .where({ lawyer_id: lawyerId })
        .del()
      return !!data
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
