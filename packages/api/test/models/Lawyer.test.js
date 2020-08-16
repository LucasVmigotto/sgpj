const {
  expect,
  request,
  handleResponseError
} = require('../utils')
const config = require('../../src/config')
const createApp = require('../../src/app')

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
describe('Models:Lawyer', function () {
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
  describe('Querys', function () {
    let lawyer = null
    it('lawyers', async function () {
      const query = `
        query {
          lawyers {
            count
            items {
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
      `
      const {
        body: {
          data: {
            lawyers: { count, items }
          }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({ query })
      lawyer = { ...items[0] }
      expect(count).to.be.not.null
      expect(count).to.be.an('number')
      expect(items).to.be.not.null
      expect(items).to.be.an('array')
    })
    it('lawyer', async function () {
      const query = `
        query ($lawyerId: ID!) {
          lawyer (lawyerId: $lawyerId) {
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
      `
      const {
        body: {
          data: { lawyer: item }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: { lawyerId: lawyer.lawyerId }
        })
      expect(item).to.be.not.null
      expect(item).to.have.property('lawyerId')
      expect(item).to.have.property('name')
      expect(item).to.have.property('user')
      expect(item.user).to.have.property('userId')
      expect(item.user).to.have.property('email')
      expect(item).to.have.property('createAt')
      expect(item).to.have.property('updateAt')
      expect(item).to.be.deep.equal(lawyer)
    })
  })
  /*describe('Mutation', function () {
    let user = null
    const body = {
      query: `
        mutation ($input: UserInput!) {
          persistUser(input: $input) {
            userId
            name
            email
            psw
            createAt
            updateAt
          }
        }
      `,
      variables: {
        input: {
          name: 'Test',
          email: `test${Date.now()}@mail.com`,
          psw: 'testpassword'
        }
      }
    }
    it('persistUser (create)', async function () {
      const {
        body: {
          data: { persistUser }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
      user = { ...persistUser }
      expect(user).to.be.not.null
      expect(user).to.be.an('object')
      expect(user).to.have.property('userId')
      expect(user).to.have.property('createAt')
      expect(user).to.have.property('updateAt')
    })
    it('persistUser (error - duplicate entry)', async function () {
      const res = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
      const err = res.body.errors[0]
      expect(err).to.be.not.null
      expect(err).to.be.an('object')
      expect(err.message).to.match(/duplicate key value/)
    })
    it('persistUser (update)', async function () {
      const body = {
        query: `
          mutation ($userId: ID, $input: UserInput!) {
            persistUser(userId: $userId, input: $input) {
              userId
              name
              email
              psw
              createAt
              updateAt
            }
          }
        `,
        variables: {
          userId: user.userId,
          input: {
            name: 'TestCHANGED',
            email: 'testCHANGED@mail.com',
            psw: 'testPAsswordChanged'
          }
        }
      }
      const {
        body: {
          data: { persistUser }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
      expect(persistUser).to.be.not.null
      expect(persistUser).to.be.an('object')
      expect(persistUser).to.have.property('createAt')
      expect(persistUser).to.have.property('updateAt')
      expect(persistUser.createAt).to.be.not.equal(persistUser.updateAt)
    })
    it('deleteUser', async function () {
      const query = `
        mutation ($userId: ID!) {
          deleteUser(userId: $userId)
        }
      `
      const {
        body: {
          data: { deleteUser }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: { userId: user.userId }
        })
      expect(deleteUser).to.be.not.null
      expect(deleteUser).to.be.true
    })
  })*/
})
