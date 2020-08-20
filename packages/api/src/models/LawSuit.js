const { gql } = require('apollo-server-express')
const { camelizeKeys, decamelizeKeys } = require('humps')
const { getAppointments, promiseHandler } = require('../utils')

const typeDefs = gql`
  type LawSuit {
    lawSuitId: ID!
    title: String!
    description: String!
    appointments: [Appointment]!
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

  extend type Query {
    lawSuit(lawSuitId: ID!): LawSuit!
    lawSuits(limit: Int, offset: Int): LawSuitList!
  }

  extend type Mutation {
    persistLawSuit(lawSuitId: ID, input: LawSuitInput!): LawSuit!
    deleteLawSuit(lawSuitId: ID!): Boolean
  }
`

const resolvers = {
  LawSuit: {
    appointments: ({ lawSuitId }, _, { knex }) => {
      return promiseHandler(getAppointments(knex, lawSuitId, 'LAWSUIT'))
    }
  },
  Query: {
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
    async persistLawSuit (_, { lawSuitId, input }, { knex }) {
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
      }
      return camelizeKeys(lawSuit[0])
    },
    async deleteLawSuit (_, { lawSuitId }, { knex }) {
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
