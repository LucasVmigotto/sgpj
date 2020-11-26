const { gql } = require('apollo-server-express')
const { camelizeKeys, decamelizeKeys } = require('humps')
const { hasAuthorization } = require('../security')

const typeDefs = gql`
  type Appointment {
    appointmentId: ID!
    title: String!
    description: String!
    eventStart: DateTime!
    eventEnd: DateTime!
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
    eventStart: DateTime!
    eventEnd: DateTime!
    lawyerId: ID!
    clientId: ID!
    lawSuitId: ID!
  }

  extend type Viewer {
    appointment(appointmentId: ID!): Appointment!
    appointments(limit: Int, offset: Int): AppointmentList!
    appointmentsByLawyer(lawyerId: ID!): [Appointment]!
  }

  extend type Mutation {
    persistAppointment(appointmentId: ID, input: AppointmentInput!): Appointment!
    deleteAppointment(appointmentId: ID!): Boolean!
  }
`

const resolvers = {
  Viewer: {
    async appointment (_, { appointmentId }, { knex }) {
      const [data] = await knex('appointment')
        .select(
          'appointment_id',
          'title',
          'description',
          'event_start',
          'event_end',
          'create_at',
          'update_at'
        )
        .where({ appointment_id: appointmentId })
      return camelizeKeys(data)
    },
    async appointments (_, { limit = 100, offset = 0 }, { knex }) {
      const data = await knex('appointment')
        .select(
          'appointment_id',
          'title',
          'description',
          'event_start',
          'event_end',
          'create_at',
          'update_at'
        )
        .limit(limit)
        .offset(offset)
      const [{ count }] = await knex('appointment').count('appointment_id')
      return {
        count,
        items: data.map(el => camelizeKeys(el))
      }
    },
    async appointmentsByLawyer (_, { lawyerId }, { knex }) {
      const data = await knex('appointment')
        .select(
          'appointment_id',
          'title',
          'description',
          'event_start',
          'event_end',
          'create_at',
          'update_at'
        )
        .where({ lawyer_id: lawyerId })
      return data.map(el => camelizeKeys(el))
    }
  },
  Mutation: {
    async persistAppointment (_, { appointmentId, input }, { knex, lawyer }) {
      hasAuthorization(lawyer)
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
    async deleteAppointment (_, { appointmentId }, { knex, lawyer }) {
      hasAuthorization(lawyer)
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
