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
        }
        appointments {
          appointmentId
          title
          eventDate
        }
      }
    }
  }
`

export async function login ({ login: { email, password } }) {
  const { login } = await gql(MUTATION_USER_LOGIN, { login: { email, password } })
  return login
}
