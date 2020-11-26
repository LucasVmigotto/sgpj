import * as clientAPI from '../api/queries/client'

const client = {
  namespaced: true,
  state: () => ({
    clients: [],
    client: null,
    limit: 5,
    offset: 0,
    count: 0,
    page: 0,
    pageLength: 0
  }),
  getters: {
    clients (state) { return state.clients },
    client (state) { return state.client },
    limit (state) { return state.limit },
    offset (state) { return state.offset },
    count (state) { return state.count },
    page (state) { return state.page + 1 },
    pageLength (state) { return Math.ceil(state.count / state.limit) }
  },
  mutations: {
    CLIENTS_CHANGED (state, clients) { state.clients = clients },
    CLIENT_CHANGED (state, client) { state.client = client },
    LIMIT_CHANGED (state, limit) { state.limit = limit },
    OFFSET_CHANGED (state, offset) { state.offset = offset },
    COUNT_CHANGED (state, count) { state.count = count },
    PAGE_CHANGED (state, page) { state.page = page }
  },
  actions: {
    async listClients ({
      state, commit, dispatch, rootState: { user: { token } }
    }, { limit = state.limit, offset = state.offset } = {}) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const { count, items } = await clientAPI.listClients({
          token, limit, offset
        })
        commit('CLIENTS_CHANGED', items)
        commit('COUNT_CHANGED', count)
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async getClient ({
      commit, dispatch, rootState: { user: { token } }
    }, clientId) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const client = await clientAPI.getClient({ token, clientId })
        commit('CLIENT_CHANGED', client)
        return client
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    resetClient ({ commit }) {
      commit('CLIENT_CHANGED', {
        name: '',
        register: '',
        email: '',
        phone: ''
      })
    },
    async createClient ({
      state, commit, dispatch, rootState: { user: { token, userLoggedIn } }
    }, { clientId, input }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        let data = null
        input = {
          ...input,
          lawyerId: userLoggedIn.lawyerId
        }
        if (clientId) {
          data = await clientAPI.updateClient({ token, clientId, input })
        } else {
          data = await clientAPI.createClient({ token, input })
        }
        dispatch('listClients', {
          limit: state.limit,
          offset: state.offset
        })
        return data
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async deleteClient ({
      state, commit, dispatch, rootState: { user: { token } }
    }, clientId) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const success = await clientAPI.deleteClient({ token, clientId })
        dispatch('listClients', {
          limit: state.limit,
          offset: state.offset
        })
        return success
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    jumpPage ({ state, commit, dispatch }, page) {
      const offset = page !== 1
        ? (page * state.limit) - state.limit
        : 0
      dispatch('listClients', {
        limit: state.limit,
        offset
      })
      commit('OFFSET_CHANGED', offset)
    },
    changePage ({ state, commit, dispatch }, next) {
      const offset = next
        ? state.offset + state.limit
        : state.offset - state.limit
      dispatch('listClients', {
        limit: state.limit,
        offset
      })
      commit('OFFSET_CHANGED', offset)
    }
  }
}

export default client
