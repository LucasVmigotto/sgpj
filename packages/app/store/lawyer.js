import * as lawyerAPI from '../api/queries/lawyer'

const lawyer = {
  namespaced: true,
  state: () => ({
    lawyers: [],
    lawyer: null,
    limit: 5,
    offset: 0,
    count: 0,
    page: 0,
    pageLength: 0
  }),
  getters: {
    lawyers (state) { return state.lawyers },
    lawyer (state) { return state.lawyer },
    limit (state) { return state.limit },
    offset (state) { return state.offset },
    count (state) { return state.count },
    page (state) { return state.page + 1 },
    pageLength (state) { return Math.ceil(state.count / state.limit) }
  },
  mutations: {
    LAWYERS_CHANGED (state, lawyers) { state.lawyers = lawyers },
    LAWYER_CHANGED (state, lawyer) { state.lawyer = lawyer },
    LIMIT_CHANGED (state, limit) { state.limit = limit },
    OFFSET_CHANGED (state, offset) { state.offset = offset },
    COUNT_CHANGED (state, count) { state.count = count },
    PAGE_CHANGED (state, page) { state.page = page }
  },
  actions: {
    async listLawyers ({
      state, commit, dispatch, rootState: { user: { token } }
    }, { limit = state.limit, offset = state.offset }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const { count, items } = await lawyerAPI.listLawyers({
          token, limit, offset
        })
        commit('LAWYERS_CHANGED', items)
        commit('COUNT_CHANGED', count)
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async getLawyer ({ commit, dispatch, rootState: { user: { token } } }, lawyerId) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const lawyer = await lawyerAPI.getLawyer({ token, lawyerId })
        commit('LAWYER_CHANGED', lawyer)
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async createLawyer ({
      state, commit, dispatch, rootState: { user: { token } }
    }, { lawyerId, input }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        let data = null
        if (lawyerId) {
          data = await lawyerAPI.updateLawyer({ token, lawyerId, input })
        } else {
          data = await lawyerAPI.createLawyer({ token, input })
        }
        dispatch('listLawyers', {
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
    async deleteLawyer ({
      state, commit, dispatch, rootState: { user: { token } }
    }, lawyerId) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const success = await lawyerAPI.deleteLawyer({ token, lawyerId })
        dispatch('listLawyers', {
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
      dispatch('listLawyers', {
        limit: state.limit,
        offset
      })
      commit('OFFSET_CHANGED', offset)
    },
    changePage ({ state, commit, dispatch }, next) {
      const offset = next
        ? state.offset + state.limit
        : state.offset - state.limit
      dispatch('listLawyers', {
        limit: state.limit,
        offset
      })
      commit('OFFSET_CHANGED', offset)
    }
  }
}

export default lawyer
