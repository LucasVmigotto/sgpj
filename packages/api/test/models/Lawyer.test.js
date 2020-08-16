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
  describe('Queries', function () {
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
  describe('Mutations', function () {
    let lawyer = null
    const body = {
      query: `
        mutation ($input: LawyerInput!) {
          persistLawyer(input: $input) {
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
          name: 'John Doe 2',
          roles: [],
          user: {
            email: 'email@mail.com',
            password: 'John\'s Password'
          }
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
      lawyer = { ...persistLawyer }
      expect(lawyer).to.be.not.null
      expect(lawyer).to.be.an('object')
      expect(lawyer).to.have.property('name')
      expect(lawyer).to.have.property('roles')
      expect(lawyer).to.have.property('user')
      expect(lawyer.user).to.have.property('userId')
      expect(lawyer.user).to.have.property('email')
      expect(lawyer).to.have.property('createAt')
      expect(lawyer).to.have.property('updateAt')
    })
    it('persistLawyer (error - duplicate entry)', async function () {
      const res = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
      const err = res.body.errors[0]
      expect(err).to.be.not.null
      expect(err).to.be.an('object')
      expect(err.message).to.match(/duplicate key value/)
    })
    it('persistLawyer (update)', async function () {
      const body = {
        query: `
          mutation ($lawyerId: ID, $input: LawyerInput!) {
            persistLawyer(lawyerId: $lawyerId, input: $input) {
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
          lawyerId: lawyer.lawyerId,
          input: {
            name: 'John Doe 2 CHANGED',
            roles: ['ADMIN']
          }
        }
      }
      const {
        body: {
          data: { persistLawyer }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
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
        mutation ($lawyerId: ID!) {
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
          variables: { lawyerId: lawyer.lawyerId }
        })
      expect(deleteLawyer).to.be.not.null
      expect(deleteLawyer).to.be.true
    })
  })
})
