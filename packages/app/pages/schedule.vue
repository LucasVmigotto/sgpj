<template>
  <v-layout column>
    <v-row>
      <v-col cols="2" justify-content="center">
        <v-btn
          :disabled="calendarType !== 'day'"
          color="primary"
          text
          outlined
          block
          @click="calendarType = 'month'"
        >
          Mês
        </v-btn>
      </v-col>
      <v-col cols="10" justify-items="center">
        <span v-if="$refs.calendar">
          {{ capWord($refs.calendar.title) }}
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-sheet height="450">
          <v-calendar
            ref="calendar"
            v-model="focus"
            :events="events"
            :type="calendarType"
            locale="pt-br"
            @click:event="showEvent"
            @click:more="viewDay"
          />
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
            >
              <v-toolbar
                color="primary"
                dark
              >
                <v-toolbar-title>{{ selectedEvent.title }}</v-toolbar-title>
                <v-spacer />
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      v-on="on"
                      @click="notifyByMail(selectedEvent.appointmentId)"
                    >
                      <v-icon>mdi-email-send</v-icon>
                    </v-btn>
                  </template>
                  <span>Notificar por E-mail</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      v-on="on"
                      @click="selectedOpen = false"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </template>
                  <span>Fechar</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <span>{{ selectedEvent.description }}</span>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import { notify } from '../api/queries/mail'

export default {
  data: () => ({
    calendarType: 'month',
    focus: '',
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false
  }),
  computed: {
    ...mapGetters('user', [
      'token'
    ]),
    ...mapGetters('appointment', [
      'appointmentsByLawyer'
    ]),
    events () {
      return this.appointmentsByLawyer
        .map((el, i) => ({
          eventId: i,
          name: el.title,
          start: this.format(el.eventStart),
          end: this.format(el.eventEnd)
        }))
    }
  },
  created () {
    this.getAppointmentsByLawyer()
  },
  mounted () {
    this.$refs.calendar.checkChange()
  },
  methods: {
    ...mapActions([
      'pushMessage'
    ]),
    ...mapActions('appointment', [
      'getAppointmentsByLawyer'
    ]),
    capWord: v => `${v.substring(0, 1).toUpperCase()}${v.substring(1, v.length)}`,
    format (date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    viewDay ({ date }) {
      this.focus = date
      this.calendarType = 'day'
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = this.appointmentsByLawyer[event.eventId]
        this.selectedElement = nativeEvent.target
        setTimeout(() => {
          this.selectedOpen = true
        }, 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
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
<style lang="stylus" scoped>
.title
  font-size 1.3rem

</style>
