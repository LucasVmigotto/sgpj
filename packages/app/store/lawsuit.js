import * as lawSuitAPI from '../api/queries/lawsuit'

const lawsuit = {
  namespaced: true,
  state: () => ({
    lawSuits: [],
    lawSuit: null,
    limit: 100,
    offset: 0,
    count: 0
  }),
  getters: {
    lawSuits (state) { return state.lawSuits },
    lawSuit (state) { return state.lawSuit },
    limit (state) { return state.limit },
    offset (state) { return state.offset },
    count (state) { return state.count }
  },
  mutations: {
    LAWSUITS_CHANGED (state, lawSuits) { state.lawSuits = lawSuits },
    LAWSUIT_CHANGED (state, lawSuit) { state.lawSuit = lawSuit },
    LIMIT_CHANGED (state, limit) { state.limit = limit },
    OFFSET_CHANGED (state, offset) { state.offset = offset },
    COUNT_CHANGED (state, count) { state.count = count }
  },
  actions: {
    async listLawSuits ({ state, commit, dispatch }, token) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const { count, item } = await lawSuitAPI.listLawSuits({
          token,
          limit: state.limit,
          offset: state.offset
        })
        commit('LAWSUITS_CHANGES', item)
        commit('COUNT_CHANGES', count)
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async getLawSuit ({ commit, dispatch }, { token, lawSuitId }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const lawSuit = await lawSuitAPI.getLawSuit({ token, lawSuitId })
        commit('LAWSUIT_CHANGED', lawSuit)
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async createLawSuit ({ commit, dispatch }, { token, lawSuitId, input }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        let data = null
        if (lawSuitId) {
          data = await lawSuitAPI.updateLawSuit({ token, lawSuitId, input })
        } else {
          data = await lawSuitAPI.createLawSuit({ token, input })
        }
        return data
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async deleteLawSuit ({ commit, dispatch }, { token, lawSuitId }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const success = await lawSuitAPI.deleteLawSuit({ token, lawSuitId })
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

export default lawsuit
