import * as lawSuitAPI from '../api/queries/lawsuit'

const lawsuit = {
  namespaced: true,
  state: () => ({
    lawSuits: [],
    lawSuit: null,
    limit: 5,
    offset: 0,
    count: 0,
    page: 0,
    pageLength: 0
  }),
  getters: {
    lawSuits (state) { return state.lawSuits },
    lawSuit (state) { return state.lawSuit },
    limit (state) { return state.limit },
    offset (state) { return state.offset },
    count (state) { return state.count },
    page (state) { return state.page + 1 },
    pageLength (state) { return Math.ceil(state.count / state.limit) }
  },
  mutations: {
    LAWSUITS_CHANGED (state, lawSuits) { state.lawSuits = lawSuits },
    LAWSUIT_CHANGED (state, lawSuit) { state.lawSuit = lawSuit },
    LIMIT_CHANGED (state, limit) { state.limit = limit },
    OFFSET_CHANGED (state, offset) { state.offset = offset },
    COUNT_CHANGED (state, count) { state.count = count },
    PAGE_CHANGED (state, page) { state.page = page }
  },
  actions: {
    async listLawSuits ({
      state, commit, dispatch, rootState: { user: { token } }
    }, { limit = state.limit, offset = state.offset } = {}) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const { count, items } = await lawSuitAPI.listLawSuits({
          token, limit, offset
        })
        commit('LAWSUITS_CHANGED', items)
        commit('COUNT_CHANGED', count)
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async getLawSuit ({
      commit, dispatch, rootState: { user: { token } }
    }, lawSuitId) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const lawSuit = await lawSuitAPI.getLawSuit({ token, lawSuitId })
        commit('LAWSUIT_CHANGED', lawSuit)
        return lawSuit
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    resetLawSuit ({ commit }) {
      commit('LAWSUIT_CHANGED', null)
    },
    async createLawSuit ({
      state, commit, dispatch, rootState: { user: { token } }
    }, { lawSuitId, input }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        let data = null
        if (lawSuitId) {
          data = await lawSuitAPI.updateLawSuit({ token, lawSuitId, input })
        } else {
          data = await lawSuitAPI.createLawSuit({ token, input })
        }
        dispatch('listLawSuits', {
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
    async deleteLawSuit ({
      state, commit, dispatch, rootState: { user: { token } }
    }, { lawSuitId }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const success = await lawSuitAPI.deleteLawSuit({ token, lawSuitId })
        dispatch('listLawSuits', {
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
      dispatch('listLawSuits', {
        limit: state.limit,
        offset
      })
      commit('OFFSET_CHANGED', offset)
    },
    changePage ({ state, commit, dispatch }, next) {
      const offset = next
        ? state.offset + state.limit
        : state.offset - state.limit
      dispatch('listLawSuits', {
        limit: state.limit,
        offset
      })
      commit('OFFSET_CHANGED', offset)
    }
  }
}

export default lawsuit
