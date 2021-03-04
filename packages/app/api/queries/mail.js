import { gql } from '../gql'

const MUTATION_NOTIFY_BY_MAIL = token => `
  mutation ($appointmentId: ID!) {
    authorization(token: "${token}") { lawyerId }
    notify(appointmentId: $appointmentId) {
      from {
        name
        email
      }
      to {
        name
        email
      }
      subject
      message
    }
  }
`

export async function notify ({ token, appointmentId }) {
  const { notify } = await gql(
    MUTATION_NOTIFY_BY_MAIL(token), { appointmentId })
  return notify
}
