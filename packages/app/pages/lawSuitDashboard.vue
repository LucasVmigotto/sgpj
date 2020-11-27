<template>
  <v-layout class="pa-4" column>
    <v-row align="center">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            icon
            outlined
            v-on="on"
            @click="goBack"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </template>
        <span>Voltar</span>
      </v-tooltip>
      <v-spacer />
    </v-row>
    <v-row>
      <v-col
        class="greet"
        cols="12"
      >
        <span>Processo:</span> {{ lawSuit.title }}
      </v-col>
      <v-col cols="12">
        <span>{{ lawSuit.description }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-tabs
          v-model="tab"
          grow
        >
          <v-tab>Notas</v-tab>
          <v-tab>Compromissos/Tarefas</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <notes-list
              :notes="notes"
              @remove="removeNote"
              @save="addNote"
            />
          </v-tab-item>
          <v-tab-item>
            <calendar
              :events="lawSuit.appointments"
              @notify="notifyByMail"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <confirm-action
      :visible="confirmDialogVisible"
      :loading="loading"
      @confirm="confirmDel"
      @cancel="cancelDel"
    />
  </v-layout>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { notify } from '../api/queries/mail'
import ConfirmAction from '../components/ConfirmAction'
import NotesList from '../components/NotesList'
import Calendar from '../components/Calendar'
export default {
  components: {
    ConfirmAction,
    NotesList,
    Calendar
  },
  data: () => ({
    tab: 0,
    noteSelected: null,
    confirmDialogVisible: false
  }),
  computed: {
    ...mapGetters([
      'loading'
    ]),
    ...mapGetters('user', [
      'token'
    ]),
    ...mapGetters('client', [
      'client'
    ]),
    ...mapGetters('lawsuit', [
      'lawSuit'
    ]),
    ...mapGetters('note', [
      'notes'
    ])
  },
  methods: {
    ...mapActions([
      'pushMessage'
    ]),
    ...mapActions('client', [
      'getClient'
    ]),
    ...mapActions('note', [
      'resetNote',
      'createNote',
      'getNote',
      'deleteNote'
    ]),
    goBack () {
      this.getClient(this.client.clientId)
        .then((res) => {
          if (res && res.clientId) {
            this.$router.push({ name: 'clientDashboard' })
          }
        })
    },
    addNote (text) {
      this.createNote({
        input: {
          text,
          lawSuitId: this.lawSuit.lawSuitId
        }
      })
        .then((res) => {
          if (res && res.noteId) {
            this.pushMessage({
              type: 'success',
              text: 'Nota criada com sucesso'
            })
          }
        })
    },
    removeNote (noteId) {
      this.getNote(noteId)
        .then((res) => {
          if (res && res.noteId) {
            this.confirmDialogVisible = true
          }
        })
    },
    cancelDel () {
      this.resetNote()
      this.confirmDialogVisible = false
    },
    confirmDel () {
      this.deleteNote(this.noteSelected)
        .then((res) => {
          if (res) {
            this.pushMessage({
              type: 'success',
              text: 'Nota removida com sucesso'
            })
          }
          this.confirmDialogVisible = false
        })
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
.greet
  font-size 2rem
  padding-bottom 0
  span
    font-weight bold
</style>
