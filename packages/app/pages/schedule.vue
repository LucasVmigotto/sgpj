<template>
  <v-layout column>
    <calendar
      :events="appointmentsByLawyer"
      @notify="notifyByMail"
    />
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { notify } from '../api/queries/mail'
import Calendar from '../components/Calendar'

export default {
  comments: { Calendar },
  computed: {
    ...mapGetters('user', [
      'token'
    ]),
    ...mapGetters('appointment', [
      'appointmentsByLawyer'
    ])
  },
  created () {
    this.getAppointmentsByLawyer()
  },
  methods: {
    ...mapActions([
      'pushMessage'
    ]),
    ...mapActions('appointment', [
      'getAppointmentsByLawyer'
    ]),
    notifyByMail (appointmentId) {
      notify({ token: this.token, appointmentId })
        .then((res) => {
          if (res && res.subject) {
            this.pushMessage({
              type: 'success',
              text: `Email enviado com sucesso para ${res.to.email}!`
            })
          }
        })
    }
  }
}
</script>
