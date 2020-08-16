const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

const { expect, request } = chai

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

module.exports = {
  expect,
  handleResponseError,
  request
}
