import { gql } from '../gql'

const QUERY_LIST_LAWYERS = token => `
  query ($limit: Int, $offset: Int) {
    viewer(token: ${token}) {
      lawyers(limit: $limti, offset: $offset) {
        count
        items {
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
          }
          createAt
          updateAt
        }
      }
    }
  }
`

const QUERY_GET_LAWYER = token => `
  query ($lawyerId: ID!) {
    viewer(token: ${token}) {
      lawyer(lawyerId: $lawyerId) {
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
        }
        createAt
        updateAt
      }
    }
  }
`

const MUTATION_CREATE_LAWYER = token => `
  mutation ($input: LawyerInput!) {
    authorization(token: ${token})
    persistLawyer(input: $input) {
      lawyerId
      name
    }
  }
`

const MUTATION_UPDATE_LAWYER = token => `
  mutation ($lawyerId: ID, $input: LawyerInput!) {
    authorization(token: ${token})
    persistLawyer(lawyerId: $lawyerId, input: $input) {
      lawyerId
      name
      roles
      oab
    }
  }
`

const MUTATION_DELETE_LAWYER = token => `
  mutation ($lawyerId: ID!) {
    authorization(token: ${token})
    deleteLawyer(lawyerId: $lawyerId)
  }
`
export async function listLawyers ({ token, limit, offset }) {
  const {
    viewer: { lawyers }
  } = await gql(QUERY_LIST_LAWYERS(token), { limit, offset })
  return lawyers
}

export async function getLawyer ({ token, lawyerId }) {
  const {
    viewer: { lawyer }
  } = await gql(QUERY_GET_LAWYER(token), { lawyerId })
  return lawyer
}

export async function createLawyer ({ token, input }) {
  const { persistLawyer } = await gql(
    MUTATION_CREATE_LAWYER(token), { input })
  return persistLawyer
}

export async function updateLawyer ({ token, lawyerId, input }) {
  const { persistLawyer } = await gql(
    MUTATION_UPDATE_LAWYER(token), { lawyerId, input })
  return persistLawyer
}

export async function deleteLawyer ({ token, lawyerId }) {
  const { deleteLawyer } = await gql(
    MUTATION_DELETE_LAWYER(token), { lawyerId })
  return deleteLawyer
}
