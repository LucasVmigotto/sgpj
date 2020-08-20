const {
  expect,
  request,
  handleResponseError
} = require('../utils')
const config = require('../../src/config')
const createApp = require('../../src/app')

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
describe('Models:Client', function () {
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
    let client = null
    it('clients', async function () {
      const query = `
        query {
          clients {
            count
            items {
              clientId
              name
              cpf
              email
              phone
              lawSuits {
                lawSuitId
                title
                description
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
          data: {
            clients: { count, items }
          }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({ query })
        .then(handleResponseError)
      client = { ...items[0] }
      expect(count).to.be.not.null
      expect(count).to.be.an('number')
      expect(items).to.be.not.null
      expect(items).to.be.an('array')
    })
    it('client', async function () {
      const query = `
        query ($clientId: ID!) {
          client (clientId: $clientId) {
            clientId
            name
            cpf
            email
            phone
            lawSuits {
              lawSuitId
              title
              description
              createAt
              updateAt
            }
            createAt
            updateAt
          }
        }
      `
      const {
        body: {
          data: { client: item }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: { clientId: client.clientId }
        })
        .then(handleResponseError)
      expect(item).to.be.not.null
      expect(item).to.have.property('clientId')
      expect(item).to.have.property('name')
      expect(item).to.have.property('cpf')
      expect(item).to.have.property('email')
      expect(item).to.have.property('phone')
      expect(item).to.have.property('lawSuits')
      expect(item.lawSuits).to.be.an('array')
      expect(item).to.have.property('createAt')
      expect(item).to.have.property('updateAt')
      expect(item).to.be.deep.equal(client)
    })
  })
  describe('Mutations', function () {
    let client = null
    const body = {
      query: `
        mutation ($input: ClientInput!) {
          persistClient(input: $input) {
            clientId
            name
            cpf
            email
            phone
            createAt
            updateAt
          }
        }
      `,
      variables: {
        input: {
          name: 'John Doe 2',
          cpf: `85743928583`,
          email: `${new Date().getMilliseconds()}@mail.com`,
          phone: `987654321`,
          lawyerId: 1
        }
      }
    }
    it('persistClient (create)', async function () {
      const {
        body: {
          data: { persistClient }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
        .then(handleResponseError)
      client = { ...persistClient }
      expect(client).to.be.not.null
      expect(client).to.be.an('object')
      expect(client).to.have.property('name')
      expect(client).to.have.property('cpf')
      expect(client).to.have.property('email')
      expect(client).to.have.property('phone')
      expect(client).to.have.property('createAt')
      expect(client).to.have.property('updateAt')
    })
    /*
    it('persistClient (error - duplicate entry)', async function () {
      const res = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
      const err = res.body.errors[0]
      expect(err).to.be.not.null
      expect(err).to.be.an('object')
      expect(err.message).to.match(/duplicate key value/)
    })
    */
    it('persistClient (update)', async function () {
      const body = {
        query: `
          mutation ($clientId: ID, $input: ClientInput!) {
            persistClient(clientId: $clientId, input: $input) {
              clientId
              name
              cpf
              email
              phone
              createAt
              updateAt
            }
          }
        `,
        variables: {
          clientId: client.clientId,
          input: {
            name: 'John Doe 2 CHANGED',
            cpf: `${Math.floor(Math.random * 10000000000)}`,
            email: `${new Date().getMilliseconds()}@mail.com`,
            phone: `${Math.floor(Math.random * 10000000000)}`,
            lawyerId: 1
          }
        }
      }
      const {
        body: {
          data: { persistClient }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
        .then(handleResponseError)
      expect(persistClient).to.be.not.null
      expect(persistClient).to.be.an('object')
      expect(persistClient).to.have.property('createAt')
      expect(persistClient).to.have.property('updateAt')
      expect(persistClient.createAt).to.be.not.equal(persistClient.updateAt)
    })
    it('deleteClient', async function () {
      const query = `
        mutation ($clientId: ID!) {
          deleteClient(clientId: $clientId)
        }
      `
      const {
        body: {
          data: { deleteClient }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: { clientId: client.clientId }
        })
        .then(handleResponseError)
      expect(deleteClient).to.be.not.null
      expect(deleteClient).to.be.true
    })
  })
})
