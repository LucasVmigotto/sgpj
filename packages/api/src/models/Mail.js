const { gql } = require('apollo-server-express')
const { camelizeKeys } = require('humps')
const { hasAuthorization } = require('../security')
const { mountAddress } = require('../utils')

const typeDefs = gql`
  type UserAddress {
    name: String!
    email: String!
  }

  input UserAddressInput {
    name: String!
    email: String!
  }

  type Mail {
    from: UserAddress!
    to: UserAddress!
    subject: String!
    message: String!
  }

  extend type Mutation {
    notify(appointmentId: ID!): Mail
  }
`

const resolvers = {
  Mutation: {
    async notify (_, { appointmentId }, { knex, transport, lawyer }) {
      hasAuthorization(lawyer)
      const [data] = await knex('appointment')
        .select(
          'appointment.title',
          'appointment.description',
          'client.name as client_name',
          'client.email as client_email',
          'lawyer.name as lawyer_name',
          'user.email as lawyer_email',
          'law_suit.title as law_suit_title'
        )
        .join('client', 'client.client_id', 'appointment.client_id')
        .join('law_suit', 'law_suit.law_suit_id', 'appointment.law_suit_id')
        .join('lawyer', 'lawyer.lawyer_id', 'appointment.lawyer_id')
        .join('user', 'user.lawyer_id', 'lawyer.lawyer_id')
        .where({ appointment_id: appointmentId })

      const {
        title,
        description,
        clientName,
        clientEmail,
        lawyerName,
        lawyerEmail,
        lawSuitTitle
      } = camelizeKeys(data)

      transport.sendMail({
        from: mountAddress({
          name: lawyerName,
          email: lawyerEmail
        }),
        to: mountAddress({
          name: clientName,
          email: clientEmail
        }),
        subject: `${title} - ${lawSuitTitle}`,
        html: `<h1>${description}</h1>`
      })

      return {
        from: {
          name: lawyerName,
          email: lawyerEmail
        },
        to: {
          name: clientName,
          email: clientEmail
        },
        subject: `${title} - ${lawSuitTitle}`,
        message: `<h1>${description}</h1>`
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
