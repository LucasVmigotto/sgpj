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
describe('Models:User', function () {
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
  describe('Mutations', function () {
    it('login', async function () {
      const body = {
        query: `
          mutation ($credentials: UserInput!) {
            login(credentials: $credentials) {
              token
              lawyer {
                lawyerId
                name
                roles
                user {
                  userId
                  email
                }
                createAt
                updateAt
              }
            }
          }
        `,
        variables: {
          credentials: {
            email: 'admin@admin.com',
            password: 'rootroot'
          }
        }
      }
      const {
        body: { data: { login: { token, lawyer } } }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
        .then(handleResponseError)
      expect(token).to.be.not.null
      expect(lawyer).to.be.not.null
      expect(lawyer).to.be.haveOwnProperty('lawyerId')
      expect(lawyer).to.be.haveOwnProperty('name')
      expect(lawyer).to.be.haveOwnProperty('roles')
      expect(lawyer).to.be.haveOwnProperty('user')
      expect(lawyer.user).to.be.haveOwnProperty('userId')
      expect(lawyer.user).to.be.haveOwnProperty('email')
      expect(lawyer).to.be.haveOwnProperty('createAt')
      expect(lawyer).to.be.haveOwnProperty('updateAt')
    })
    it('login - fail', async function () {
      const body = {
        query: `
          mutation ($credentials: UserInput!) {
            login(credentials: $credentials) {
              token
              lawyer {
                lawyerId
                name
                roles
                user {
                  userId
                  email
                }
                createAt
                updateAt
              }
            }
          }
        `,
        variables: {
          credentials: {
            email: 'error@error.err',
            password: 'error'
          }
        }
      }
      const { body: { errors: [{ message }] } } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
      expect(message).to.be.not.null
      expect(message).to.match(/Email or Password invalid/)
    })
    const body = valid => ({
      query: `
        mutation ($token: String!){
          authorization(token: $token) {
            lawyerId
            name
            roles
            createAt
            updateAt
          }
        }
      `,
      variables: {
        token: generateToken(valid)
      }
    })
    it('authorization', async function () {
      const {
        body: { data: { authorization } }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body(true))
        .then(handleResponseError)
      expect(authorization).to.be.not.null
      expect(authorization).to.haveOwnProperty('lawyerId')
      expect(authorization).to.haveOwnProperty('name')
      expect(authorization).to.haveOwnProperty('roles')
      expect(authorization).to.haveOwnProperty('createAt')
      expect(authorization).to.haveOwnProperty('updateAt')
    })
    it('authorization - fail', async function () {
      const { body: { errors: [{ message }] } } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body(false))
      expect(message).to.be.not.null
      expect(message).to.match(/invalid signature/)
    })
  })
})
