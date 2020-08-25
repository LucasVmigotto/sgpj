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
    message: {},
    messages: []
  }),
  getters: {
    loading (state) { return state.loading },
    error (state) { return state.error },
    message (state) {
      return state.messages.length
        ? state.messages[0]
        : null
    },
    messageText (state) { return state.message.text || '' },
    messageColor (state) { return state.message.color || 'default' },
    messageTimeout (state) { return state.message.timeout || 0 }
  },
  mutations: {
    LOADING_CHANGED (state, loading) { state.loading = loading },
    ERROR_CHANGED (state, error) { state.error = error },
    PUSH_MESSAGE (state, { text, color, timeout }) {
      state.messages.push({ text, color, timeout })
      state.message = state.messages[0]
    },
    PULL_MESSAGE (state) {
      state.messages.shift()
      if (state.messages.length) {
        state.message = state.messages[0]
      }
    }
  },
  actions: {
    setError ({ commit }, error) {
      commit('ERROR_CHANGED', error)
      let { message } = error
      const graphQLErrors = (error.networkError && error.networkError.graphQLErrors) ||
        error.graphQLErrors
      if (graphQLErrors && graphQLErrors.length) {
        const [graphQLError] = graphQLErrors
        message = graphQLError.message
      }
      commit('PUSH_MESSAGE', {
        message,
        timeout: 6000,
        color: 'error'
      })
    },
    pushMessage ({ commit }, message) {
      commit('PUSH_MESSAGE', message)
    },
    dismissMessage ({ commit }) {
      commit('PULL_MESSAGE')
    }
  }
}

export default store
