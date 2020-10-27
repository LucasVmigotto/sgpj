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
describe('Models:Mail', function () {
  const token = generateToken(true)
  let knex, httpServer, transport
  before(function () {
    const {
      knex: localKnex,
      httpServer: localHttpServer,
      transport: localTransport
    } = createApp(config)
    knex = localKnex
    httpServer = localHttpServer
    transport = localTransport
  })
  after(async function () {
    await knex.destroy()
    transport.close()
  })
  describe('Mutations', function () {
    it('notify', async function () {
      const body = {
        query: `
          mutation ($token: String!, $appointmentId: ID!) {
            authorization(token: $token) { lawyerId }
            notify(appointmentId: $appointmentId) {
              from { name email }
              to { name email }
              subject
              message
            }
          }
        `,
        variables: {
          token, appointmentId: 1
        }
      }
      const {
        body: {
          data: { notify }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
        .then(handleResponseError)
      expect(notify).not.null
      expect(notify).to.be.haveOwnProperty('from')
      expect(notify).to.be.haveOwnProperty('to')
      expect(notify).to.be.haveOwnProperty('subject')
      expect(notify).to.be.haveOwnProperty('message')
      expect(notify.from).to.be.an('object')
      expect(notify.from).to.be.haveOwnProperty('name')
      expect(notify.from).to.be.haveOwnProperty('email')
      expect(notify.to).to.be.haveOwnProperty('name')
      expect(notify.to.name).to.be.equal('Client John')
      expect(notify.to).to.be.haveOwnProperty('email')
    })
  })
})
