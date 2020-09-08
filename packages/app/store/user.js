import * as userAPI from '../api/queries/user'

const user = {
  namespaced: false,
  state: () => ({
    userLoggedIn: null,
    token: null
  }),
  getters: {
    userLoggedIn (state) { return state.userLoggedIn },
    token (state) { return state.token }
  },
  mutations: {
    USER_LOGGED_IN_CHANGED (state, userLoggedIn) { state.userLoggedIn = userLoggedIn },
    TOKEN_CHANGED (state, token) { state.token = token }
  },
  actions: {
    async login ({ commit, dispatch }, login) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const { lawyer, token } = await userAPI.login(login)
        commit('USER_LOGGED_IN_CHANGED', lawyer)
        commit('TOKEN_CHANGED', token)
        return !!token
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async updateEmail ({ state, commit, dispatch }, { lawyerId, email }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const data = await userAPI.updateEmail({
          token: state.token, lawyerId, email
        })
        return data
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async updatePassword ({ state, commit, dispatch }, { lawyerId, password }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const data = await userAPI.updatePassword({
          token: state.token, lawyerId, password
        })
        return data
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    }
  }
}

export default user
