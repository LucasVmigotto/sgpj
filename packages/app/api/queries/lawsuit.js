import { gql } from '../gql'

const QUERY_LIST_LAWSUITS = token => `
  query ($limit: Int, $offset: Int) {
    viewer(token: "${token}") {
      lawSuits(limit: $limti, offset: $offset) {
        count
        items {
          lawSuitId
          title
          description
          createAt
          updateAt
        }
      }
    }
  }
`

const QUERY_GET_LAWSUIT = token => `
  query ($lawSuitId: ID!) {
    viewer(token: "${token}") {
      lawSuit(lawSuitId: $lawSuitId) {
        lawSuitId
        title
        description
        appointments {
          appointmentId
          title
          description
          eventDate
          createAt
          updateAt
        }
        createAt
        updateAt
      }
    }
  }
`

const MUTATION_CREATE_LAWSUIT = token => `
  mutation ($input: LawSuitInput!) {
    authorization(token: "${token}") { lawyerId }
    persistLawSuit(input: $input) {
      lawSuitId
      title
      description
    }
  }
`

const MUTATION_UPDATE_LAWSUIT = token => `
  mutation ($lawSuitId: ID, $input: LawSuitInput!) {
    authorization(token: "${token}") { lawyerId }
    persistLawSuit(lawSuitId: $lawSuitId, input: $input) {
      lawSuitId
      title
      description
      createAt
      updateAt
    }
  }
`

const MUTATION_DELETE_LAWSUIT = token => `
  mutation ($lawSuitId: ID!) {
    authorization(token: "${token}") { lawyerId }
    deleteLawSuit(lawSuitId: $lawSuitId)
  }
`
export async function listLawSuits ({ token, limit, offset }) {
  const {
    viewer: { lawSuits }
  } = await gql(QUERY_LIST_LAWSUITS(token), { limit, offset })
  return lawSuits
}

export async function getLawSuit ({ token, lawSuitId }) {
  const {
    viewer: { lawSuit }
  } = await gql(QUERY_GET_LAWSUIT(token), { lawSuitId })
  return lawSuit
}

export async function createLawSuit ({ token, input }) {
  const { persistLawSuit } = await gql(
    MUTATION_CREATE_LAWSUIT(token), { input })
  return persistLawSuit
}

export async function updateLawSuit ({ token, lawSuitId, input }) {
  const { persistLawSuit } = await gql(
    MUTATION_UPDATE_LAWSUIT(token), { lawSuitId, input })
  return persistLawSuit
}

export async function deleteLawSuit ({ token, lawSuitId }) {
  const { deleteLawSuit } = await gql(
    MUTATION_DELETE_LAWSUIT(token), { lawSuitId })
  return deleteLawSuit
}
