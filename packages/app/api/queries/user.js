import { gql } from '../gql'

const MUTATION_USER_LOGIN = `
  mutation ($login: UserInput!) {
    login(login: $login) {
      token
      lawyer {
        lawyerId
        name
      }
    }
  }
`

export async function login ({ login }) {
  const { login } = await gql(MUTATION_USER_LOGIN, { login })
  return login
}
