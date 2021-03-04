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
describe('Models:LawSuit', function () {
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
    let lawSuit = null
    it('lawSuits', async function () {
      const query = `
        query ($token: String!) {
          viewer(token: $token) {
            lawSuits {
              count
              items {
                lawSuitId
                title
                description
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
            viewer: { lawSuits: { count, items } }
          }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: { token }
        })
        .then(handleResponseError)
      lawSuit = { ...items[0] }
      expect(count).to.be.not.null
      expect(count).to.be.an('number')
      expect(items).to.be.not.null
      expect(items).to.be.an('array')
    })
    it('lawSuit', async function () {
      const query = `
        query ($token: String!, $lawSuitId: ID!) {
          viewer(token: $token) {
            lawSuit (lawSuitId: $lawSuitId) {
              lawSuitId
              title
              description
              appointments {
                appointmentId
                title
                description
                eventStart
                eventEnd
                createAt
                updateAt
              }
              notes {
                noteId
                text
                createAt
                updateAt
              }
              createAt
              updateAt
            }
          }
        }
      `
      const {
        body: {
          data: { viewer: { lawSuit: item } }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: {
            token,
            lawSuitId: lawSuit.lawSuitId
          }
        })
        .then(handleResponseError)
      expect(item).to.be.not.null
      expect(item).to.have.property('lawSuitId')
      expect(item).to.have.property('title')
      expect(item).to.have.property('description')
      expect(item).to.have.property('appointments')
      expect(item).to.have.property('notes')
      expect(item).to.have.property('createAt')
      expect(item).to.have.property('updateAt')
    })
  })
  describe('Mutations', function () {
    let lawSuit = null
    const body = {
      query: `
        mutation ($token: String!, $input: LawSuitInput!) {
          authorization(token: $token) { lawyerId }
          persistLawSuit(input: $input) {
            lawSuitId
            title
            description
            createAt
            updateAt
          }
        }
      `,
      variables: {
        token,
        input: {
          title: 'Law Suit Title',
          description: 'Law Suit Description',
          clientId: 1
        }
      }
    }
    it('persistLawSuit (create)', async function () {
      const {
        body: {
          data: { persistLawSuit }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
        .then(handleResponseError)
      lawSuit = { ...persistLawSuit }
      expect(lawSuit).to.be.not.null
      expect(lawSuit).to.be.an('object')
      expect(lawSuit).to.have.property('title')
      expect(lawSuit).to.have.property('description')
      expect(lawSuit).to.have.property('createAt')
      expect(lawSuit).to.have.property('updateAt')
    })
    it('persistLawSuit (update)', async function () {
      const body = {
        query: `
          mutation ($token: String!, $lawSuitId: ID, $input: LawSuitInput!) {
            authorization(token: $token) { lawyerId }
            persistLawSuit(lawSuitId: $lawSuitId, input: $input) {
              lawSuitId
              title
              description
              createAt
              updateAt
            }
          }
        `,
        variables: {
          token,
          lawSuitId: lawSuit.lawSuitId,
          input: {
            title: 'Law Suit Title CHANGED',
            description: 'Law Suit Description CHANGED',
            clientId: 1
          }
        }
      }
      const {
        body: {
          data: { persistLawSuit }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
        .then(handleResponseError)
      expect(persistLawSuit).to.be.not.null
      expect(persistLawSuit).to.be.an('object')
      expect(persistLawSuit).to.have.property('createAt')
      expect(persistLawSuit).to.have.property('updateAt')
      expect(persistLawSuit.createAt).to.be.not.equal(persistLawSuit.updateAt)
    })
    it('deleteLawSuit', async function () {
      const query = `
        mutation ($token: String!, $lawSuitId: ID!) {
          authorization(token: $token) { lawyerId }
          deleteLawSuit(lawSuitId: $lawSuitId)
        }
      `
      const {
        body: {
          data: { deleteLawSuit }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: {
            token,
            lawSuitId: lawSuit.lawSuitId
          }
        })
        .then(handleResponseError)
      expect(deleteLawSuit).to.be.not.null
      expect(deleteLawSuit).to.be.true
    })
  })
})
