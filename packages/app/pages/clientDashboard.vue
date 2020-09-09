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
      </v-tooltip>
      <v-col
        class="greet"
        cols="6"
      >
        <span>Nome:</span> {{ client.name }}
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <law-suits-list
          v-if="hasLawSuits"
          :law-suits="client.lawSuits"
          @edit="editLawSuit"
          @remove="removeLawSuit"
        />
        <div v-else>
          <v-icon large>
            mdi-book-account
          </v-icon>
          Sem processos no momento
        </div>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="mt-3"
              color="green"
              block
              outlined
              v-on="on"
              @click="lawSuitDialog = true"
            >
              <v-icon>mdi-book-plus</v-icon>
            </v-btn>
          </template>
          <span>Adicionar processo</span>
        </v-tooltip>
      </v-col>
      <v-col cols="6">
        <appointments-list
          v-if="hasAppointments"
          :appointments="client.appointments"
        />
        <div v-else>
          <v-icon large>
            mdi-calendar-alert
          </v-icon>
          Sem compromissos no momento
        </div>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="mt-3"
              color="green"
              block
              outlined
              v-on="on"
            >
              <v-icon>mdi-calendar-plus</v-icon>
            </v-btn>
          </template>
          <span>Adicionar compromisso</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <law-suit-dialog
      :dialog="lawSuitDialog"
      @save="saveLawSuit"
      @close="lawSuitDialog = false"
    />
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
import LawSuitsList from '../components/LawSuitsList'
import AppointmentsList from '../components/AppointmentsList'
import LawSuitDialog from '../components/LawSuitDialog'

export default {
  components: {
    LawSuitsList,
    AppointmentsList,
    LawSuitDialog
  },
  data: () => ({
    lawSuitDialog: false,
    appointmentSelected: null,
    lawSuitSelected: null,
    confirmDialogVisible: false
  }),
  computed: {
    ...mapGetters([
      'loading'
    ]),
    ...mapGetters('client', [
      'client'
    ]),
    ...mapGetters('lawsuit', [
      'lawSuit'
    ]),
    hasLawSuits () {
      return this.client.lawSuits.length > 0
    },
    hasAppointments () {
      return this.client.appointments.length > 0
    }
  },
  methods: {
    ...mapActions([
      'pushMessage'
    ]),
    ...mapActions('lawsuit', [
      'getLawSuit',
      'resetLawSuit',
      'createLawSuit',
      'deleteLawSuit'
    ]),
    ...mapActions('client', [
      'getClient'
    ]),
    async refreshClient () {
      await this.getClient(this.client.clientId)
    },
    goBack () {
      this.$router.push({ name: 'clients' })
    },
    saveLawSuit (input) {
      this.lawSuitDialog = false
      if (this.lawSuit && this.lawSuit.lawSuitId) {
        this.createLawSuit({
          lawSuitId: this.lawSuit.lawSuitId,
          input
        })
          .then(async (res) => {
            if (res && res.lawSuitId) {
              this.pushMessage({
                type: 'success',
                text: 'Processo atualizado com sucesso'
              })
              this.resetLawSuit()
              await this.refreshClient()
            }
          })
      } else {
        this.createLawSuit({ input })
          .then(async (res) => {
            if (res && res.lawSuitId) {
              this.pushMessage({
                type: 'success',
                text: 'Processo adicionado com sucesso'
              })
              await this.refreshClient()
            }
          })
      }
    },
    editLawSuit (lawSuitId) {
      this.getLawSuit(lawSuitId)
        .then((res) => {
          if (res && res.lawSuitId) {
            this.lawSuitDialog = true
          }
        })
    },
    removeLawSuit (lawSuitId) {
      this.lawSuitSelected = lawSuitId
      this.confirmDialogVisible = true
    },
    cancelDel () {
      this.lawSuitSelected = null
      this.appointmentSelected = null
      this.confirmDialogVisible = false
    },
    confirmDel () {
      this.confirmDialogVisible = false
      if (this.lawSuitSelected) {
        this.deleteLawSuit({
          lawSuitId: this.lawSuitSelected
        })
          .then(async (res) => {
            if (res) {
              this.pushMessage({
                type: 'success',
                text: 'Processo removido com sucesso'
              })
              await this.refreshClient()
            }
          })
      }
      this.lawSuitSelected = null
      this.appointmentSelected = null
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
