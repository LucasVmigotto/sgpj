const { expect, generateToken } = require('./utils')
const {
  parseAuthorization,
  hasAuthorization
} = require('../src/security')
const { UserTypes } = require('../src/utils')

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
describe('Security', function () {
  describe('parseAuthorization', function () {
    const token = generateToken(true)
    it('return token', function () {
      expect(parseAuthorization(`Bearer ${token}`))
        .to.be.equal(token)
    })
    it('return token', function () {
      expect(function () {
        parseAuthorization(`Error ${token}`)
      }).to.throw(Error, /Unsupported authorization method/)
    })
  })
  describe('hasAuthorization', function () {
    it('true', function () {
      expect(function () {
        hasAuthorization(
          { roles: ['LAWYER'] }, UserTypes.LAWYER)
      }).to.not.throw(Error, /Access denied/)
    })
    it('false - error', function () {
      expect(function () {
        hasAuthorization(
          { roles: [] }, UserTypes.LAWYER)
      }).to.throw(Error, /Access denied/)
    })
  })
})
