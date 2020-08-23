const { verify } = require('jsonwebtoken')
const config = require('./config')
const { userInRoles } = require('./utils')

const verifyToken = (token, secret) =>
  new Promise((resolve, reject) => {
    verify(token, secret, (err, decodedToken) => {
      if (err) {
        reject(err)
      }
      resolve(decodedToken)
    })
  })

const tokenGraphQLResolver = async (_, args, context) => {
  const { lawyer } = context
  if (args.token) {
    context.lawyer = await verifyToken(args.token, config.JWT_SECRET)
  } else if (lawyer) {
    context.lawyer = lawyer
  } else {
    throw new Error('Access Denied')
  }
  return context.lawyer
}

const parseAuthorization = (auth) => {
  const [type, token] = auth.split(' ')
  if (type !== 'Bearer') {
    throw new Error('Unsupported authorization method')
  }
  return token
}

const tokenExpressResolver = (req, _, next) => {
  const { headers: { authorization } } = req
  if (authorization) {
    try {
      verifyToken(parseAuthorization(authorization), config.JWT_SECRET)
        .then((lawyer) => {
          req.lawyer = lawyer
          next()
        })
        .catch(next)
    } catch (err) {
      next(err)
    }
  } else {
    next()
  }
}

const hasAuthorization = (
  user, role, message = 'Access denied'
) => {
  if (!user || !userInRoles(user, role)) {
    throw new Error(message)
  }
}

module.exports = {
  parseAuthorization,
  tokenGraphQLResolver,
  tokenExpressResolver,
  hasAuthorization
}
