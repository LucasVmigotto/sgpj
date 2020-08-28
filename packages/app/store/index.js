import appointment from './appointment'
import client from './client'
import lawsuit from './lawsuit'
import lawyer from './lawyer'
import user from './user'

const store = {
  modules: {
    appointment,
    client,
    lawsuit,
    lawyer,
    user
  },
  state: () => ({
    loading: false,
    error: null,
    message: '',
    type: '',
    timeout: 3000,
    alertVisible: false
  }),
  getters: {
    loading (state) { return state.loading },
    error (state) { return state.error },
    messageText (state) { return state.message },
    messageType (state) { return state.type },
    messageTimeout (state) { return state.timeout },
    alertVisible (state) { return state.alertVisible }
  },
  mutations: {
    LOADING_CHANGED (state, loading) { state.loading = loading },
    ERROR_CHANGED (state, error) { state.error = error },
    PUSH_MESSAGE (state, { type, text, alertVisible }) {
      state.message = text
      state.type = type
      state.alertVisible = alertVisible
    }
  },
  actions: {
    setError ({ state, commit }, error) {
      commit('ERROR_CHANGED', error)
      let { message } = error
      const graphQLErrors = (error.networkError && error.networkError.graphQLErrors) ||
        error.graphQLErrors
      if (graphQLErrors && graphQLErrors.length) {
        const [graphQLError] = graphQLErrors
        message = graphQLError.message
      }
      commit('PUSH_MESSAGE', {
        text: message,
        type: 'error',
        alertVisible: true
      })
      setTimeout(() => {
        commit('PUSH_MESSAGE', {
          alertVisible: false
        })
      }, state.timeout)
    },
    pushMessage ({ commit }, { type, text }) {
      commit('PUSH_MESSAGE', {
        type, text, alertVisible: true
      })
    },
    dismissMessage ({ commit }) {
      commit('PUSH_MESSAGE', {
        alertVisible: false
      })
    }
  }
}

export default store
