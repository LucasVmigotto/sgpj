import * as appointmentAPI from '../api/queries/appointment'

const appointment = {
  namespaced: true,
  state: () => ({
    appointments: [],
    appointment: null,
    limit: 5,
    offset: 0,
    count: 0,
    page: 0,
    pageLength: 0
  }),
  getters: {
    appointments (state) { return state.appointments },
    appointment (state) { return state.appointment },
    limit (state) { return state.limit },
    offset (state) { return state.offset },
    count (state) { return state.count },
    page (state) { return state.page + 1 },
    pageLength (state) { return Math.ceil(state.count / state.limit) }
  },
  mutations: {
    APPOINTMENTS_CHANGED (state, appointments) { state.appointments = appointments },
    APPOINTMENT_CHANGED (state, appointment) { state.appointment = appointment },
    LIMIT_CHANGED (state, limit) { state.limit = limit },
    OFFSET_CHANGED (state, offset) { state.offset = offset },
    COUNT_CHANGED (state, count) { state.count = count },
    PAGE_CHANGED (state, page) { state.page = page }
  },
  actions: {
    async listAppointments ({
      state, commit, dispatch, rootState: { user: { token } }
    }, { limit = state.limit, offset = state.offset } = {}) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const { count, items } = await appointmentAPI.listAppointments({
          token, limit, offset
        })
        commit('APPOINTMENTS_CHANGED', items)
        commit('COUNT_CHANGED', count)
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async getAppointment ({
      commit, dispatch, rootState: { user: { token } }
    }, appointmentId) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const appointment = await appointmentAPI.getAppointment({ token, appointmentId })
        commit('APPOINTMENT_CHANGED', appointment)
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async createClient ({
      state, commit, dispatch, rootState: { user: { token } }
    }, { appointmentId, input }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        let data = null
        if (appointmentId) {
          data = await appointmentAPI.updateAppointment({ token, appointmentId, input })
        } else {
          data = await appointmentAPI.createAppointment({ token, input })
        }
        dispatch('listAppointments', {
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
    async deleteAppointment ({
      state, commit, dispatch, rootState: { user: { token } }
    }, appointmentId) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const success = await appointmentAPI.deleteAppointment({ token, appointmentId })
        dispatch('listAppointments', {
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
      dispatch('listAppointments', {
        limit: state.limit,
        offset
      })
      commit('OFFSET_CHANGED', offset)
    },
    changePage ({ state, commit, dispatch }, next) {
      const offset = next
        ? state.offset + state.limit
        : state.offset - state.limit
      dispatch('listAppointments', {
        limit: state.limit,
        offset
      })
      commit('OFFSET_CHANGED', offset)
    }
  }
}

export default appointment
