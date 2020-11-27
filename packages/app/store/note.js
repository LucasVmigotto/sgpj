import * as noteAPI from '../api/queries/note'

const note = {
  namespaced: true,
  state: () => ({
    notes: [],
    note: null,
    count: 0
  }),
  getters: {
    notes (state) { return state.notes },
    note (state) { return state.note },
    count (state) { return state.count }
  },
  mutations: {
    NOTES_CHANGED (state, notes) { state.notes = notes },
    NOTE_CHANGED (state, note) { state.note = note },
    COUNT_CHANGED (state, count) { state.count = count }
  },
  actions: {
    async listNotes ({
      commit, dispatch, rootState: { user: { token } }
    }, lawSuitId) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const { count, items } = await noteAPI.listNotes({
          token, lawSuitId
        })
        commit('NOTES_CHANGED', items)
        commit('COUNT_CHANGED', count)
        return items
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async getNote ({
      commit, dispatch, rootState: { user: { token } }
    }, noteId) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const note = await noteAPI.getNote({ token, noteId })
        commit('NOTE_CHANGED', note)
        return note
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    resetNote ({ commit }) {
      commit('NOTE_CHANGED', null)
    },
    async createNote ({
      commit, dispatch, rootState: { user: { token } }
    }, { noteId, input }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        let data = null
        if (noteId) {
          data = await noteAPI.updateNote({ token, noteId, input })
        } else {
          data = await noteAPI.createNote({ token, input })
        }
        dispatch('listNotes', { lawSuitId: input.lawSuitId })
        return data
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async deleteNote ({
      state, commit, dispatch, rootState: { user: { token } }
    }, { noteId }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const success = await noteAPI.deleteNote({ token, noteId })
        dispatch('listNotes', { lawSuitId: state.note.lawSuitId })
        dispatch('resetNote')
        return success
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    }
  }
}

export default note
