const {
  expect,
  request,
  handleResponseError
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
  describe('Queries', function () {
    it('login', async function () {
      const body = {
        query: `
          query ($input: UserInput!) {
            login(input: $input) {
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
        `,
        variables: {
          input: {
            email: 'admin@admin.com',
            password: 'rootroot'
          }
        }
      }
      const {
        body: { data: { login } }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
        .then(handleResponseError)
      expect(login).to.be.not.null
      expect(login).to.be.haveOwnProperty('lawyerId')
      expect(login).to.be.haveOwnProperty('name')
      expect(login).to.be.haveOwnProperty('roles')
      expect(login).to.be.haveOwnProperty('user')
      expect(login.user).to.be.haveOwnProperty('userId')
      expect(login.user).to.be.haveOwnProperty('email')
      expect(login).to.be.haveOwnProperty('createAt')
      expect(login).to.be.haveOwnProperty('updateAt')
    })
    it('login - fail', async function () {
      const body = {
        query: `
          query ($input: UserInput!) {
            login(input: $input) {
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
        `,
        variables: {
          input: {
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
  })
})
