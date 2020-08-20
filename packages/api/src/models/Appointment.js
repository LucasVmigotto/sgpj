const { gql } = require('apollo-server-express')
const { camelizeKeys, decamelizeKeys } = require('humps')

const typeDefs = gql`
  type Appointment {
    appointmentId: ID!
    title: String!
    description: String!
    eventDate: DateTime!
    createAt: DateTime!
    updateAt: DateTime!
  }

  type AppointmentList {
    count: Int!
    items: [Appointment]!
  }

  input AppointmentInput {
    title: String!
    description: String!
    eventDate: DateTime!
    lawyerId: ID!
    clientId: ID!
    lawSuitId: ID!
  }

  extend type Query {
    appointment(appointmentId: ID!): Appointment!
    appointments(limit: Int, offset: Int): AppointmentList!
  }

  extend type Mutation {
    persistAppointment(appointmentId: ID, input: AppointmentInput!): Appointment!
    deleteAppointment(appointmentId: ID!): Boolean
  }
`

const resolvers = {
  Query: {
    async appointment (_, { appointmentId }, { knex }) {
      const [data] = await knex('appointment')
        .select(
          'appointment_id',
          'title',
          'description',
          'event_date',
          'create_at',
          'update_at'
        )
        .where({ appointment_id: appointmentId })
      return {
        appointmentId: data.appointment_id,
        title: data.title,
        description: data.description,
        eventDate: data.event_date,
        createAt: data.create_at,
        updateAt: data.update_at
      }
    },
    async appointments (_, { limit = 100, offset = 0 }, { knex }) {
      const data = await knex('appointment')
        .select(
          'appointment_id',
          'title',
          'description',
          'event_date',
          'create_at',
          'update_at'
        )
        .limit(limit)
        .offset(offset)
      const [{ count }] = await knex('appointment').count('appointment_id')
      return {
        count,
        items: data.map(el => {
          return {
            appointmentId: el.appointment_id,
            title: el.title,
            description: el.description,
            eventDate: el.event_date,
            createAt: el.create_at,
            updateAt: el.update_at
          }
        })
      }
    }
  },
  Mutation: {
    async persistAppointment (_, { appointmentId, input }, { knex }) {
      let appointment = null
      if (appointmentId) {
        appointment = await knex('appointment')
          .update(decamelizeKeys({
            ...input,
            update_at: new Date().toISOString()
          }))
          .where({ appointment_id: appointmentId })
          .returning('*')
      } else {
        appointment = await knex('appointment')
          .insert(decamelizeKeys({ ...input }))
          .returning('*')
      }
      return camelizeKeys(appointment[0])
    },
    async deleteAppointment (_, { appointmentId }, { knex }) {
      const data = await knex('appointment')
        .where({ appointment_id: appointmentId })
        .del()
      return !!data
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
