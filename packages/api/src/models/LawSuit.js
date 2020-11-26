const { gql } = require('apollo-server-express')
const { camelizeKeys, decamelizeKeys } = require('humps')
const { getAppointments, promiseHandler, getNotes } = require('../utils')
const { hasAuthorization } = require('../security')
const { notifyLawSuit } = require('../utils/mail')

const typeDefs = gql`
  type LawSuit {
    lawSuitId: ID!
    title: String!
    description: String!
    appointments: [Appointment]!
    notes: [Note]!
    createAt: DateTime!
    updateAt: DateTime!
  }

  type LawSuitList {
    count: Int!
    items: [LawSuit]!
  }

  input LawSuitInput {
    title: String!
    description: String!
    clientId: ID!
  }

  extend type Viewer {
    lawSuit(lawSuitId: ID!): LawSuit!
    lawSuits(limit: Int, offset: Int): LawSuitList!
  }

  extend type Mutation {
    persistLawSuit(lawSuitId: ID, input: LawSuitInput!): LawSuit!
    deleteLawSuit(lawSuitId: ID!): Boolean!
  }
`

const resolvers = {
  LawSuit: {
    appointments: ({ lawSuitId }, _, { knex }) => {
      return promiseHandler(getAppointments(knex, lawSuitId, 'LAWSUIT'))
    },
    notes: ({ lawSuitId }, _, { knex }) => {
      return promiseHandler(getNotes(knex, lawSuitId))
    }
  },
  Viewer: {
    async lawSuit (_, { lawSuitId }, { knex }) {
      const [data] = await knex('law_suit')
        .select(
          'law_suit_id',
          'title',
          'description',
          'create_at',
          'update_at'
        )
        .where({ law_suit_id: lawSuitId })
      return {
        lawSuitId: data.law_suit_id,
        title: data.title,
        description: data.description,
        createAt: data.create_at,
        updateAt: data.update_at
      }
    },
    async lawSuits (_, { limit = 100, offset = 0 }, { knex }) {
      const data = await knex('law_suit')
        .select(
          'law_suit_id',
          'title',
          'description',
          'create_at',
          'update_at'
        )
        .limit(limit)
        .offset(offset)
      const [{ count }] = await knex('law_suit').count('law_suit_id')
      return {
        count,
        items: data.map(el => {
          return {
            lawSuitId: el.law_suit_id,
            title: el.title,
            description: el.description,
            createAt: el.create_at,
            updateAt: el.update_at
          }
        })
      }
    }
  },
  Mutation: {
    async persistLawSuit (_, { lawSuitId, input }, { transport, knex, lawyer }) {
      hasAuthorization(lawyer)
      let lawSuit = null
      if (lawSuitId) {
        lawSuit = await knex('law_suit')
          .update(decamelizeKeys({
            ...input,
            update_at: new Date().toISOString()
          }))
          .where({ law_suit_id: lawSuitId })
          .returning('*')
      } else {
        lawSuit = await knex('law_suit')
          .insert(decamelizeKeys({ ...input }))
          .returning('*')
        await notifyLawSuit(transport, knex, lawSuit[0].law_suit_id)
      }
      return camelizeKeys(lawSuit[0])
    },
    async deleteLawSuit (_, { lawSuitId }, { knex, lawyer }) {
      hasAuthorization(lawyer)
      const data = await knex('law_suit')
        .where({ law_suit_id: lawSuitId })
        .del()
      return !!data
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
