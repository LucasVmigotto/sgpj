import { gql } from '../gql'

const QUERY_LIST_APPOINTMENT = token => `
  query ($limit: Int, $offset: Int) {
    viewer(token: "${token}") {
      appointments(limit: $limit, offset: $offset) {
        count
        items {
          appointmentId
          title
          description
          eventStart
          eventEnd
          createAt
          updateAt
        }
      }
    }
  }
`

const QUERY_LIST_APPOINTMENT_BY_LAWYER = token => `
  query ($lawyerId: ID!) {
    viewer(token: "${token}") {
      appointmentsByLawyer(lawyerId: $lawyerId) {
        appointmentId
        title
        description
        eventStart
        eventEnd
        createAt
        updateAt
      }
    }
  }
`

const QUERY_GET_APPOINTMENT = token => `
  query ($appointmentId: ID!) {
    viewer(token: "${token}") {
      appointment(appointmentId: $appointmentId) {
        appointmentId
        title
        description
        eventStart
        eventEnd
        createAt
        updateAt
      }
    }
  }
`

const MUTATION_CREATE_APPOINTMENT = token => `
  mutation ($input: AppointmentInput!) {
    authorization(token: "${token}") { lawyerId }
    persistAppointment(input: $input) {
      appointmentId
      title
      description
      eventStart
      eventEnd
    }
  }
`

const MUTATION_UPDATE_APPOINTMENT = token => `
  mutation ($appointmentId: ID, $input: AppointmentInput!) {
    authorization(token: "${token}") { lawyerId }
    persistAppointment(appointmentId: $appointmentId, input: $input) {
      appointmentId
      title
      description
      eventStart
      eventEnd
      createAt
      updateAt
    }
  }
`

const MUTATION_DELETE_APPOINTMENT = token => `
  mutation ($appointmentId: ID!) {
    authorization(token: "${token}") { lawyerId }
    deleteAppointment(appointmentId: $appointmentId)
  }
`
export async function listAppointments ({ token, limit, offset }) {
  const {
    viewer: { appointments }
  } = await gql(QUERY_LIST_APPOINTMENT(token), { limit, offset })
  return appointments
}

export async function appointmentsByLawyer ({ token, lawyerId }) {
  const {
    viewer: { appointmentsByLawyer }
  } = await gql(QUERY_LIST_APPOINTMENT_BY_LAWYER(token), { lawyerId })
  return appointmentsByLawyer
}

export async function getAppointment ({ token, appointmentId }) {
  const {
    viewer: { appointment }
  } = await gql(QUERY_GET_APPOINTMENT(token), { appointmentId })
  return appointment
}

export async function createAppointment ({ token, input }) {
  const { persistAppointment } = await gql(
    MUTATION_CREATE_APPOINTMENT(token), { input })
  return persistAppointment
}

export async function updateAppointment ({ token, appointmentId, input }) {
  const { persistAppointment } = await gql(
    MUTATION_UPDATE_APPOINTMENT(token), { appointmentId, input })
  return persistAppointment
}

export async function deleteAppointment ({ token, appointmentId }) {
  const { deleteAppointment } = await gql(
    MUTATION_DELETE_APPOINTMENT(token), { appointmentId })
  return deleteAppointment
}
