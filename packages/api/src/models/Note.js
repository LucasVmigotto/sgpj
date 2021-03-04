const { gql } = require('apollo-server-express')
const { camelizeKeys, decamelizeKeys } = require('humps')
const { hasAuthorization } = require('../security')

const typeDefs = gql`
  type Note {
    noteId: ID!
    text: String!
    createAt: DateTime!
    updateAt: DateTime!
  }

  type NotesList {
    count: Int!
    items: [Note]!
  }

  input NoteInput {
    text: String!
    lawSuitId: ID!
  }

  extend type Viewer {
    note(noteId: ID!): Note!
    notes(lawSuitId: ID!): NotesList!
  }

  extend type Mutation {
    persistNote(noteId: ID, input: NoteInput!): Note!
    deleteNote(noteId: ID!): Boolean!
  }
`

const resolvers = {
  Viewer: {
    async note (_, { noteId }, { knex }) {
      const [data] = await knex('note')
        .select(
          'note_id',
          'text',
          'create_at',
          'update_at'
        )
        .where({ note_id: noteId })
      return camelizeKeys(data)
    },
    async notes (_, { lawSuitId }, { knex }) {
      const data = await knex('note')
        .select(
          'note_id',
          'text',
          'create_at',
          'update_at'
        )
        .where({ law_suit_id: lawSuitId })
      return {
        count: data.length,
        items: data.map(el => camelizeKeys(el))
      }
    }
  },
  Mutation: {
    async persistNote (_, { noteId, input }, { knex, lawyer }) {
      hasAuthorization(lawyer)
      let note = null
      if (noteId) {
        note = await knex('note')
          .update(decamelizeKeys({
            ...input,
            updateAt: new Date().toISOString()
          }))
          .where({ note_id: noteId })
          .returning('*')
      } else {
        note = await knex('note')
          .insert(decamelizeKeys({ ...input }))
          .returning('*')
      }
      return camelizeKeys(note[0])
    },
    async deleteNote (_, { noteId }, { knex, lawyer }) {
      hasAuthorization(lawyer)
      const data = await knex('note')
        .where({ note_id: noteId })
        .del()
      return !!data
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
