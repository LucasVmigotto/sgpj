import * as lawyerAPI from '../api/queries/lawyer'

const lawyer = {
  namespaced: true,
  state: () => ({
    lawyers: [],
    lawyer: null,
    limit: 100,
    offset: 0,
    count: 0
  }),
  getters: {
    lawyers (state) { return state.lawyers },
    lawyer (state) { return state.lawyer },
    limit (state) { return state.limit },
    offset (state) { return state.offset },
    count (state) { return state.count }
  },
  mutations: {
    LAWYERS_CHANGED (state, lawyers) { state.lawyers = lawyers },
    LAWYER_CHANGED (state, lawyer) { state.lawyer = lawyer },
    LIMIT_CHANGED (state, limit) { state.limit = limit },
    OFFSET_CHANGED (state, offset) { state.offset = offset },
    COUNT_CHANGED (state, count) { state.count = count }
  },
  actions: {
    async listLawyers ({ state, commit, dispatch }, token) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const { count, item } = await lawyerAPI.listLawyers({
          token,
          limit: state.limit,
          offset: state.offset
        })
        commit('LAWYERS_CHANGES', item)
        commit('COUNT_CHANGES', count)
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async getLawyers ({ commit, dispatch }, { token, lawyerId }) {
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
    async createLawyer ({ commit, dispatch }, { token, lawyerId, input }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        let data = null
        if (lawyerId) {
          data = await lawyerAPI.updateLawyer({ token, lawyerId, input })
        } else {
          data = await lawyerAPI.createLawyer({ token, input })
        }
        return data
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async deleteLawyer ({ commit, dispatch }, { token, lawyerId }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const success = await lawyerAPI.deleteLawyer({ token, lawyerId })
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

export default lawyer
