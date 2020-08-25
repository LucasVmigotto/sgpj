import * as clientAPI from '../../api/queries/client'

const client = {
  namespaced: true,
  state: () => ({
    clients: [],
    client: null,
    limit: 100,
    offset: 0,
    count: 0
  }),
  getters: {
    clients (state) { return state.clients },
    client (state) { return state.client },
    limit (state) { return state.limit },
    offset (state) { return state.offset },
    count (state) { return state.count }
  },
  mutations: {
    CLIENTS_CHANGED (state, clients) { state.clients = clients },
    CLIENT_CHANGED (state, client) { state.client = client },
    LIMIT_CHANGED (state, limit) { state.limit = limit },
    OFFSET_CHANGED (state, offset) { state.offset = offset },
    COUNT_CHANGED (state, count) { state.count = count }
  },
  actions: {
    async listClients ({ state, commit, dispatch }, token) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const { count, item } = await clientAPI.listClients({
          token,
          limit: state.limit,
          offset: state.offset
        })
        commit('CLIENTS_CHANGES', item)
        commit('COUNT_CHANGES', count)
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async getClient ({ commit, dispatch }, { token, clientId }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const client = await clientAPI.getClient({ token, clientId })
        commit('CLIENT_CHANGED', client)
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async createClient ({ commit, dispatch }, { token, clientId, input }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        let data = null
        if (clientId) {
          data = await clientAPI.updateClient({ token, clientId, input })
        } else {
          data = await clientAPI.createClient({ token, input })
        }
        return data
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async deleteClient ({ commit, dispatch }, { token, clientId }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const success = await clientAPI.deleteClient({ token, clientId })
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

export default client
