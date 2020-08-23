const {
  expect,
  request,
  handleResponseError,
  generateToken
} = require('../utils')
const config = require('../../src/config')
const createApp = require('../../src/app')

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
describe('Models:Appointment', function () {
  const token = generateToken(true)
  let knex, httpServer
  before(function () {
    const {
      knex: localKnex,
      httpServer: localHttpServer
    } = createApp(config)
    knex = localKnex
    httpServer = localHttpServer
  })
  after(async function () {
    await knex.destroy()
  })
  describe('Queries', function () {
    let appointment = null
    it('appointments', async function () {
      const query = `
        query ($token: String!) {
          viewer(token: $token) {
            appointments {
              count
              items {
                appointmentId
                title
                description
                eventDate
                createAt
                updateAt
              }
            }
          }
        }
      `
      const {
        body: {
          data: {
            viewer: { appointments: { count, items } }
          }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: { token }
        })
        .then(handleResponseError)
      appointment = { ...items[0] }
      expect(count).to.be.not.null
      expect(count).to.be.an('number')
      expect(items).to.be.not.null
      expect(items).to.be.an('array')
    })
    it('appointment', async function () {
      const query = `
        query ($token: String!, $appointmentId: ID!) {
          viewer(token: $token) {
            appointment (appointmentId: $appointmentId) {
              appointmentId
              title
              description
              eventDate
              createAt
              updateAt
            }
          }
        }
      `
      const {
        body: {
          data: { viewer: { appointment: item } }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: {
            token,
            appointmentId: appointment.appointmentId
          }
        })
        .then(handleResponseError)
      expect(item).to.be.not.null
      expect(item).to.have.property('appointmentId')
      expect(item).to.have.property('title')
      expect(item).to.have.property('description')
      expect(item).to.have.property('eventDate')
      expect(item).to.have.property('createAt')
      expect(item).to.have.property('updateAt')
      expect(item).to.be.deep.equal(appointment)
    })
  })
  describe('Mutations', function () {
    let appointment = null
    const body = {
      query: `
        mutation ($token: String!, $input: AppointmentInput!) {
          authorization(token: $token) { lawyerId }
          persistAppointment(input: $input) {
            appointmentId
            title
            description
            eventDate
            createAt
            updateAt
          }
        }
      `,
      variables: {
        token,
        input: {
          title: 'Appointment Title',
          description: 'Appointment Description',
          eventDate: new Date().toISOString(),
          clientId: 1,
          lawyerId: 1,
          lawSuitId: 1
        }
      }
    }
    it('persistAppointment (create)', async function () {
      const {
        body: {
          data: { persistAppointment }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
        .then(handleResponseError)
      appointment = { ...persistAppointment }
      expect(appointment).to.be.not.null
      expect(appointment).to.be.an('object')
      expect(appointment).to.have.property('appointmentId')
      expect(appointment).to.have.property('title')
      expect(appointment).to.have.property('description')
      expect(appointment).to.have.property('eventDate')
      expect(appointment).to.have.property('createAt')
      expect(appointment).to.have.property('updateAt')
    })
    it('persistAppointment (update)', async function () {
      const body = {
        query: `
          mutation ($token: String!, $appointmentId: ID, $input: AppointmentInput!) {
            authorization(token: $token) { lawyerId }
            persistAppointment(appointmentId: $appointmentId, input: $input) {
              appointmentId
              title
              description
              eventDate
              createAt
              updateAt
            }
          }
        `,
        variables: {
          token,
          appointmentId: appointment.appointmentId,
          input: {
            title: 'Appointment Title CHANGED',
            description: 'Appointment Description CHANGED',
            eventDate: new Date().toISOString(),
            clientId: 1,
            lawyerId: 1,
            lawSuitId: 1
          }
        }
      }
      const {
        body: {
          data: { persistAppointment }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
        .then(handleResponseError)
      expect(persistAppointment).to.be.not.null
      expect(persistAppointment).to.be.an('object')
      expect(persistAppointment).to.have.property('createAt')
      expect(persistAppointment).to.have.property('updateAt')
      expect(persistAppointment.createAt).to.be.not.equal(persistAppointment.updateAt)
    })
    it('deleteAppointment', async function () {
      const query = `
        mutation ($token: String!, $appointmentId: ID!) {
          authorization(token: $token) { lawyerId }
          deleteAppointment(appointmentId: $appointmentId)
        }
      `
      const {
        body: {
          data: { deleteAppointment }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: {
            token,
            appointmentId: appointment.appointmentId
          }
        })
        .then(handleResponseError)
      expect(deleteAppointment).to.be.not.null
      expect(deleteAppointment).to.be.true
    })
  })
})
