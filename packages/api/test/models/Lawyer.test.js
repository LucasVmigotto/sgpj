const {
  expect,
  request,
  handleResponseError,
  generateToken
} = require('../utils')
const config = require('../../src/config')
const createApp = require('../../src/app')

const generateOAB = () => `${Math.floor(Math.random() * 10000000)}`

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
describe('Models:Lawyer', function () {
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
    let lawyer = null
    it('lawyers', async function () {
      const query = `
        query ($token: String!) {
          viewer(token: $token) {
            lawyers {
              count
              items {
                lawyerId
                name
                roles
                oab
                user {
                  userId
                  email
                }
                clients {
                  clientId
                  name
                  register
                  email
                  phone
                  clientType
                  createAt
                  updateAt
                }
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
            viewer: { lawyers: { count, items } }
          }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: { token }
        })
        .then(handleResponseError)
      lawyer = { ...items[0] }
      expect(count).to.be.not.null
      expect(count).to.be.an('number')
      expect(items).to.be.not.null
      expect(items).to.be.an('array')
    })
    it('lawyer', async function () {
      const query = `
        query ($lawyerId: ID!, $token: String!) {
          viewer(token: $token) {
            lawyer (lawyerId: $lawyerId) {
              lawyerId
              name
              roles
              oab
              clients {
                clientId
                name
                register
                email
                phone
                clientType
                createAt
                updateAt
              }
              appointments {
                appointmentId
                title
                description
                eventStart
                eventEnd
                createAt
                updateAt
              }
              user {
                userId
                email
              }
              createAt
              updateAt
            }
          }
        }
      `
      const {
        body: {
          data: { viewer: { lawyer: item } }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: {
            token,
            lawyerId: lawyer.lawyerId
          }
        })
        .then(handleResponseError)
      expect(item).to.be.not.null
      expect(item).to.have.property('lawyerId')
      expect(item).to.have.property('name')
      expect(item).to.have.property('user')
      expect(item.user).to.be.an('object')
      expect(item.user).to.have.property('userId')
      expect(item.user).to.have.property('email')
      expect(item).to.have.property('clients')
      expect(item.clients).to.be.an('array')
      expect(item).to.have.property('appointments')
      expect(item.appointments).to.be.an('array')
      expect(item).to.have.property('oab')
      expect(item).to.have.property('createAt')
      expect(item).to.have.property('updateAt')
    })
  })
  describe('Mutations', function () {
    let lawyer = null
    const body = {
      query: `
        mutation ($input: LawyerInput!, $token: String!) {
          authorization(token: $token) { lawyerId }
          persistLawyer(input: $input) {
            lawyerId
            name
            roles
            oab
            user {
              userId
              email
            }
            createAt
            updateAt
          }
        }
      `,
      variables: {
        token,
        input: {
          name: 'John Doe 2',
          roles: [],
          user: {
            email: `${new Date().getMilliseconds()}@mail.com`,
            password: 'John\'s Password'
          },
          oab: generateOAB()
        }
      }
    }
    it('persistLawyer (create)', async function () {
      const {
        body: {
          data: { persistLawyer }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
        .then(handleResponseError)
      lawyer = { ...persistLawyer }
      expect(lawyer).to.be.not.null
      expect(lawyer).to.be.an('object')
      expect(lawyer).to.have.property('name')
      expect(lawyer).to.have.property('roles')
      expect(lawyer).to.have.property('oab')
      expect(lawyer).to.have.property('user')
      expect(lawyer.user).to.have.property('userId')
      expect(lawyer.user).to.have.property('email')
      expect(lawyer).to.have.property('createAt')
      expect(lawyer).to.have.property('updateAt')
    })
    it('persistLawyer (create)', async function () {
      const { body: { errors: [{ message }] } } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query: body.query,
          variables: {
            token,
            input: {
              name: 'John Doe 2 CHANGED',
              roles: ['ADMIN'],
              oab: generateOAB()
            }
          }
        })
      expect(message).to.be.not.null
      expect(message)
        .to.match(/To create a new Lawyer, first you must inform the user access info/)
    })
    it('persistLawyer (update)', async function () {
      const body = {
        query: `
          mutation ($token: String!, $lawyerId: ID, $input: LawyerInput!) {
            authorization(token: $token) { lawyerId }
            persistLawyer(lawyerId: $lawyerId, input: $input) {
              lawyerId
              name
              roles
              user {
                userId
                email
              }
              oab
              createAt
              updateAt
            }
          }
        `,
        variables: {
          token,
          lawyerId: lawyer.lawyerId,
          input: {
            name: 'John Doe 2 CHANGED',
            roles: ['ADMIN'],
            oab: generateOAB()
          }
        }
      }
      const {
        body: {
          data: { persistLawyer }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .set('authorization', `Bearer ${token}`)
        .send(body)
        .then(handleResponseError)
      expect(persistLawyer).to.be.not.null
      expect(persistLawyer).to.be.an('object')
      expect(persistLawyer).to.have.property('createAt')
      expect(persistLawyer).to.have.property('updateAt')
      expect(persistLawyer.createAt).to.be.not.equal(persistLawyer.updateAt)
    })
    it('deleteLawyer', async function () {
      const query = `
        mutation ($token: String!, $lawyerId: ID!) {
          authorization(token: $token) { lawyerId }
          deleteLawyer(lawyerId: $lawyerId)
        }
      `
      const {
        body: {
          data: { deleteLawyer }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: {
            token,
            lawyerId: lawyer.lawyerId
          }
        })
        .then(handleResponseError)
      expect(deleteLawyer).to.be.not.null
      expect(deleteLawyer).to.be.true
    })
  })
})
