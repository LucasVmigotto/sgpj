import { gql } from '../gql'

const MUTATION_USER_LOGIN = `
  mutation ($login: UserInput!) {
    login(credentials: $login) {
      token
      lawyer {
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
          phone
          clientType
        }
        appointments {
          appointmentId
          title
          eventStart
          eventEnd
        }
      }
    }
  }
`

const MUTATION_USER_UPDATE_EMAIL = token => `
  mutation ($lawyerId: ID!, $email: String!) {
    authorization(token: "${token}") { lawyerId }
    updateEmail(lawyerId: $lawyerId, email: $email) {
      userId
      email
    }
  }
`

const MUTATION_USER_UPDATE_PASSWORD = token => `
  mutation ($lawyerId: ID!, $password: String!) {
    authorization(token: "${token}") { lawyerId }
    updatePassword(lawyerId: $lawyerId, password: $password)
  }
`

export async function login ({ login: { email, password } }) {
  const { login } = await gql(MUTATION_USER_LOGIN, { login: { email, password } })
  return login
}

export async function updateEmail ({ token, lawyerId, email }) {
  const { updateEmail } = await gql(MUTATION_USER_UPDATE_EMAIL(token), { lawyerId, email })
  return updateEmail
}

export async function updatePassword ({ token, lawyerId, password }) {
  const { updatePassword } = await gql(
    MUTATION_USER_UPDATE_PASSWORD(token), { lawyerId, password })
  return updatePassword
}
