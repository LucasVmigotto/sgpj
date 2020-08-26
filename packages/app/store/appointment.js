import * as appointmentAPI from '../api/queries/appointment'

const appointment = {
  namespaced: true,
  state: () => ({
    appointments: [],
    appointment: null,
    limit: 100,
    offset: 0,
    count: 0
  }),
  getters: {
    appointments (state) { return state.appointments },
    appointment (state) { return state.appointment },
    limit (state) { return state.limit },
    offset (state) { return state.offset },
    count (state) { return state.count }
  },
  mutations: {
    APPOINTMENTS_CHANGED (state, appointments) { state.appointments = appointments },
    APPOINTMENT_CHANGED (state, appointment) { state.appointment = appointment },
    LIMIT_CHANGED (state, limit) { state.limit = limit },
    OFFSET_CHANGED (state, offset) { state.offset = offset },
    COUNT_CHANGED (state, count) { state.count = count }
  },
  actions: {
    async listAppointments ({ state, commit, dispatch }, token) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const { count, item } = await appointmentAPI.listAppointments({
          token,
          limit: state.limit,
          offset: state.offset
        })
        commit('APPOINTMENTS_CHANGES', item)
        commit('COUNT_CHANGES', count)
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async getAppointment ({ commit, dispatch }, { token, appointmentId }) {
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
    async createClient ({ commit, dispatch }, { token, appointmentId, input }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        let data = null
        if (appointmentId) {
          data = await appointmentAPI.updateAppointment({ token, appointmentId, input })
        } else {
          data = await appointmentAPI.createAppointment({ token, input })
        }
        return data
      } catch (err) {
        commit('ERROR_CHANGED', err, { root: true })
        dispatch('setError', err, { root: true })
      } finally {
        commit('LOADING_CHANGED', false, { root: true })
      }
    },
    async deleteAppointment ({ commit, dispatch }, { token, appointmentId }) {
      commit('LOADING_CHANGED', true, { root: true })
      try {
        const success = await appointmentAPI.deleteAppointment({ token, appointmentId })
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

export default appointment
