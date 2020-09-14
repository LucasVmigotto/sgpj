<template>
  <v-layout column>
    <v-row justify="space-around">
      <v-btn
        color="primary"
        fab
        outlined
        icon
        small
        @click="prev"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <span v-if="$refs.calendar">
        {{ $refs.calendar.title }}
      </span>
      <v-btn
        color="primary"
        fab
        outlined
        icon
        small
        @click="next"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-sheet height="450">
          <v-calendar
            ref="calendar"
            :events="events"
            type="month"
            @click:event="showEvent"
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
                <v-btn
                  icon
                  @click="selectedOpen = false"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
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

export default {
  data: () => ({
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false
  }),
  computed: {
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
    ...mapActions('appointment', [
      'getAppointmentsByLawyer'
    ]),
    format (date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
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
    }
  }
}
</script>
<style lang="stylus" scoped>
.title
  font-size 1.3rem

</style>
