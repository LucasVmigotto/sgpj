import { gql } from '../gql'

const QUERY_LIST_CLIENTS = token => `
  query ($limit: Int, $offset: Int) {
    viewer(token: ${token}) {
      clients(limit: $limti, offset: $offset) {
        count
        items {
          clientId
          name
          cpf
          email
          phone
          createAt
          updateAt
        }
      }
    }
  }
`

const QUERY_GET_CLIENT = token => `
  query ($clientId: ID!) {
    viewer(token: ${token}) {
      client(clientId: $clientId) {
        clientId
        name
        cpf
        email
        phone
        lawSuits {
          lawSuitId
          title
          description
          createAt
          updateAt
        }
        createAt
        updateAt
      }
    }
  }
`

const MUTATION_CREATE_CLIENT = token => `
  mutation ($input: ClientInput!) {
    authorization(token: ${token})
    persistClient(input: $input) {
      clientId
      name
    }
  }
`

const MUTATION_UPDATE_CLIENT = token => `
  mutation ($clientId: ID, $input: ClientInput!) {
    authorization(token: ${token})
    persistClient(clientId: $clientId, input: $input) {
      clientId
      name
      cpf
      email
      phone
      createAt
      updateAt
    }
  }
`

const MUTATION_DELETE_CLIENT = token => `
  mutation ($clientId: ID!) {
    authorization(token: ${token})
    deleteClient(clientId: $clientId)
  }
`
export async function listClients ({ token, limit, offset }) {
  const {
    viewer: { clients }
  } = await gql(QUERY_LIST_CLIENTS(token), { limit, offset })
  return clients
}

export async function getClient ({ token, clientId }) {
  const {
    viewer: { client }
  } = await gql(QUERY_GET_CLIENT(token), { clientId })
  return client
}

export async function createClient ({ token, input }) {
  const { persistClient } = await gql(
    MUTATION_CREATE_CLIENT(token), { input })
  return persistClient
}

export async function updateClient ({ token, clientId, input }) {
  const { persistClient } = await gql(
    MUTATION_UPDATE_CLIENT(token), { clientId, input })
  return persistClient
}

export async function deleteClient ({ token, clientId }) {
  const { deleteClient } = await gql(
    MUTATION_DELETE_CLIENT(token), { clientId })
  return deleteClient
}
