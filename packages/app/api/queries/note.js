import { gql } from '../gql'

const QUERY_LIST_NOTES = token => `
  query ($lawSuitId: ID!) {
    viewer(token: "${token}") {
      notes(lawSuitId: $lawSuitId) {
        count
        items {
          noteId
          text
          createAt
          updateAt
        }
      }
    }
  }
`

const QUERY_GET_NOTE = token => `
  query ($noteId: ID!) {
    viewer(token: "${token}") {
      note(noteId: $noteId) {
        noteId
        text
        createAt
        updateAt
      }
    }
  }
`

const MUTATION_CREATE_NOTE = token => `
  mutation ($input: NoteInput!) {
    authorization(token: "${token}") { lawyerId }
    persistNote(input: $input) {
      noteId
      text
      createAt
      updateAt
    }
  }
`

const MUTATION_UPDATE_NOTE = token => `
  mutation ($noteId: ID, $input: NoteInput!) {
    authorization(token: "${token}") { lawyerId }
    persistNote(noteId: $noteId, input: $input) {
      noteId
      text
      createAt
      updateAt
    }
  }
`

const MUTATION_DELETE_LAWSUIT = token => `
  mutation ($noteId: ID!) {
    authorization(token: "${token}") { lawyerId }
    deleteNote(noteId: $noteId)
  }
`
export async function listNotes ({ token, lawSuitId }) {
  const {
    viewer: { notes }
  } = await gql(QUERY_LIST_NOTES(token), { lawSuitId })
  return notes
}

export async function getNote ({ token, noteId }) {
  const {
    viewer: { note }
  } = await gql(QUERY_GET_NOTE(token), { noteId })
  return note
}

export async function createNote ({ token, input }) {
  const { persistNote } = await gql(
    MUTATION_CREATE_NOTE(token), { input })
  return persistNote
}

export async function updateNote ({ token, noteId, input }) {
  const { persistNote } = await gql(
    MUTATION_UPDATE_NOTE(token), { noteId, input })
  return persistNote
}

export async function deleteNote ({ token, noteId }) {
  const { deleteNote } = await gql(
    MUTATION_DELETE_LAWSUIT(token), { noteId })
  return deleteNote
}
