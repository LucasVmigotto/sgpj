const chai = require('chai')
const chaiHttp = require('chai-http')
const { signJWT } = require('../src/utils')

chai.use(chaiHttp)

const { expect, request } = chai

const lawyer = {
  lawyerId: 1,
  name: 'John Doe',
  roles: ['LAWYER'],
  createAt: new Date().toISOString(),
  updateAt: new Date().toISOString()
}

const handleResponseError = res => {
  if (res.body.errors) {
    const { message, exception, extensions } = res.body.errors[0]
    if (extensions) {
      if (extensions.code === 'FORBIDDEN') {
        return res
      }
      const { exception } = extensions
      if (exception) return Promise.reject(exception)
    }
    return Promise.reject(exception || message)
  }
  return res
}

const generateToken = (valid, roles = ['ADMIN']) => valid
  ? signJWT({ ...lawyer, roles })
  : signJWT({ ...lawyer, roles }, 'fake')

module.exports = {
  expect,
  handleResponseError,
  request,
  generateToken
}
