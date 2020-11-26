const {
  expect,
  request,
  handleResponseError,
  generateToken
} = require('../utils')
const config = require('../../src/config')
const createApp = require('../../src/app')

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
describe('Models:Note', function () {
  const token = generateToken(true)
  let knex, httpServer
  before(function () {
    const {
      knex: localKnex,
      httpServer: localHttpServer
    } = createApp(config)
    knex = localKnex
    httpServer = localHttpServer
  })
  after(async function () {
    await knex.destroy()
  })
  describe('Queries', function () {
    let note = null
    it('notes', async function () {
      const query = `
        query ($token: String!, $lawSuitId: ID!) {
          viewer(token: $token) {
            notes(lawSuitId: $lawSuitId){
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
      const {
        body: {
          data: {
            viewer: { notes: { count, items } }
          }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: {
            token,
            lawSuitId: 1
          }
        })
        .then(handleResponseError)
      note = { ...items[0] }
      expect(count).to.be.not.null
      expect(count).to.be.an('number')
      expect(items).to.be.not.null
      expect(items).to.be.an('array')
    })
    it('note', async function () {
      const query = `
        query ($token: String!, $noteId: ID!) {
          viewer(token: $token) {
            note (noteId: $noteId) {
              noteId
              text
              createAt
              updateAt
            }
          }
        }
      `
      const {
        body: {
          data: { viewer: { note: item } }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: {
            token,
            noteId: note.noteId
          }
        })
        .then(handleResponseError)
      expect(item).to.be.not.null
      expect(item).to.have.property('noteId')
      expect(item).to.have.property('text')
      expect(item).to.have.property('createAt')
      expect(item).to.have.property('updateAt')
    })
  })
  describe('Mutations', function () {
    let note = null
    const body = {
      query: `
        mutation ($token: String!, $input: NoteInput!) {
          authorization(token: $token) { lawyerId }
          persistNote(input: $input) {
            noteId
            text
            createAt
            updateAt
          }
        }
      `,
      variables: {
        token,
        input: {
          text: 'Note text',
          lawSuitId: 1
        }
      }
    }
    it('persistNote (create)', async function () {
      const {
        body: {
          data: { persistNote }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
        .then(handleResponseError)
      note = { ...persistNote }
      expect(note).to.be.not.null
      expect(note).to.be.an('object')
      expect(note).to.have.property('noteId')
      expect(note).to.have.property('text')
      expect(note).to.have.property('createAt')
      expect(note).to.have.property('updateAt')
    })
    it('persistNote (update)', async function () {
      const body = {
        query: `
          mutation ($token: String!, $noteId: ID, $input: NoteInput!) {
            authorization(token: $token) { lawyerId }
            persistNote(noteId: $noteId, input: $input) {
              noteId
              text
              createAt
              updateAt
            }
          }
        `,
        variables: {
          token,
          noteId: note.noteId,
          input: {
            text: 'Note Text CHANGED',
            lawSuitId: 1
          }
        }
      }
      const {
        body: {
          data: { persistNote }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send(body)
        .then(handleResponseError)
      expect(persistNote).to.be.not.null
      expect(persistNote).to.be.an('object')
      expect(persistNote).to.have.property('createAt')
      expect(persistNote).to.have.property('updateAt')
      expect(persistNote.createAt).to.be.not.equal(persistNote.updateAt)
    })
    it('deleteNote', async function () {
      const query = `
        mutation ($token: String!, $noteId: ID!) {
          authorization(token: $token) { lawyerId }
          deleteNote(noteId: $noteId)
        }
      `
      const {
        body: {
          data: { deleteNote }
        }
      } = await request(httpServer)
        .post(config.ENDPOINT)
        .send({
          query,
          variables: {
            token,
            noteId: note.noteId
          }
        })
        .then(handleResponseError)
      expect(deleteNote).to.be.not.null
      expect(deleteNote).to.be.true
    })
  })
})
