const { expect } = require('../utils')
const {
  UserTypes,
  defineType,
  userInRoles
} = require('../../src/utils')

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
describe('Utils', function () {
  describe('defineType', function () {
    it('return LAWYER', function () {
      expect(defineType('LAWYER', 0))
        .to.be.deep.equal({ lawyer_id: 0 })
    })
    it('return CLIENT', function () {
      expect(defineType('CLIENT', 0))
        .to.be.deep.equal({ client_id: 0 })
    })
    it('return LAWSUIT', function () {
      expect(defineType('LAWSUIT', 0))
        .to.be.deep.equal({ law_suit_id: 0 })
    })
    it('return ERROR', function () {
      expect(function () {
        defineType('ERROR', 0)
      }).to.throw(Error, /Invalid option selected/)
    })
  })
  describe('userInRoles', function () {
    const user = role => ({ roles: [role] })
    it('true - default', function () {
      expect(userInRoles(user('LAWYER')))
        .to.be.true
    })
    it('true', function () {
      expect(userInRoles(user('ADMIN'), UserTypes.LAWYER))
        .to.be.true
    })
    it('false', function () {
      expect(userInRoles(user('OTHER'), UserTypes.LAWYER))
        .to.be.false
    })
  })
})
