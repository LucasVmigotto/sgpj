const { gql } = require('apollo-server-express')
const { camelizeKeys, decamelizeKeys } = require('humps')
const { getLawSuits, promiseHandler } = require('../utils')
const { getAppointments, ClientTypes } = require('../utils')
const { hasAuthorization } = require('../security')

const typeDefs = gql`
  type Client {
    clientId: ID!
    name: String!
    register: String!
    email: String
    phone: String!
    clientType: String!
    lawSuits: [LawSuit]!
    appointments: [Appointment]!
    createAt: DateTime!
    updateAt: DateTime!
  }

  type ClientList {
    count: Int!
    items: [Client]!
  }

  input ClientInput {
    name: String!
    register: String!
    email: String
    phone: String!
    clientType: String
    lawyerId: ID!
  }

  extend type Viewer {
    client(clientId: ID!): Client!
    clients(limit: Int, offset: Int): ClientList!
  }

  extend type Mutation {
    persistClient(clientId: ID, input: ClientInput!): Client!
    deleteClient(clientId: ID!): Boolean!
  }
`

const resolvers = {
  Client: {
    lawSuits: ({ clientId }, _, { knex }) => {
      return promiseHandler(getLawSuits(knex, clientId))
    },
    appointments: ({ clientId }, _, { knex }) => {
      return promiseHandler(getAppointments(knex, clientId, 'CLIENT'))
    }
  },
  Viewer: {
    async client (_, { clientId }, { knex }) {
      const [data] = await knex('client')
        .select(
          'client_id',
          'name',
          'register',
          'email',
          'phone',
          'client_type',
          'create_at',
          'update_at'
        )
        .where({ 'client.client_id': clientId })
      return {
        clientId: data.client_id,
        name: data.name,
        register: data.register,
        email: data.email,
        phone: data.phone,
        clientType: ClientTypes[data.client_type],
        createAt: data.create_at,
        updateAt: data.update_at
      }
    },
    async clients (_, { limit = 100, offset = 0 }, { knex }) {
      const data = await knex('client')
        .select(
          'client_id',
          'name',
          'register',
          'email',
          'phone',
          'client_type',
          'create_at',
          'update_at'
        )
        .limit(limit)
        .offset(offset)
      const [{ count }] = await knex('client').count('client_id')
      return {
        count,
        items: data.map(el => {
          return {
            clientId: el.client_id,
            name: el.name,
            register: el.register,
            email: el.email,
            phone: el.phone,
            clientType: ClientTypes[el.client_type],
            createAt: el.create_at,
            updateAt: el.update_at
          }
        })
      }
    }
  },
  Mutation: {
    async persistClient (_, { clientId, input }, { knex, lawyer }) {
      hasAuthorization(lawyer)
      let client = null
      if (clientId) {
        client = await knex('client')
          .update(decamelizeKeys({
            ...input,
            update_at: new Date().toISOString()
          }))
          .where({ client_id: clientId })
          .returning('*')
      } else {
        client = await knex('client')
          .insert(decamelizeKeys({ ...input }))
          .returning('*')
      }
      return camelizeKeys(client[0])
    },
    async deleteClient (_, { clientId }, { knex, lawyer }) {
      hasAuthorization(lawyer)
      const data = await knex('client')
        .where({ client_id: clientId })
        .del()
      return !!data
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
