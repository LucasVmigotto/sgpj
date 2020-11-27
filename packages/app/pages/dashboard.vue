<template>
  <v-layout>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          class="greet"
        >
          <span>{{ dayPeriod }}</span> {{ userLoggedIn.name }}
        </v-col>
        <v-col
          cols="12"
          class="oab"
        >
          <span>OAB:</span> {{ userLoggedIn.oab }}
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-card>
            <v-card-title>Clientes</v-card-title>
            <v-card-text>
              <v-simple-table v-if="hasClients">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th />
                      <th>Nome</th>
                      <th>Telefone</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(el, index) in clients"
                      :key="index"
                    >
                      <td>
                        <client-type :type="el.clientType" />
                      </td>
                      <td>{{ el.name }}</td>
                      <td>{{ el.phone }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-row v-else>
                <v-col cols="6">
                  <v-icon large>
                    mdi-account-alert
                  </v-icon>
                  Sem clientes no momento
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-card-title>Compromissos</v-card-title>
            <v-card-text>
              <v-simple-table v-if="hasAppointments">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(el, index) in appointments"
                      :key="index"
                    >
                      <td>{{ el.title }}</td>
                      <td>{{ formatDate(el.eventStart) }} até {{ formatDate(el.eventEnd, 'HH:MM') }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-row v-else>
                <v-col cols="6">
                  <v-icon large>
                    mdi-calendar-alert
                  </v-icon>
                  Sem compromissos no momento
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import ClientType from '../components/ClientType'

export default {
  components: { ClientType },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters('user', [
      'userLoggedIn'
    ]),
    dayPeriod () {
      const hour = moment().hour()
      return hour < 13
        ? 'Bom dia'
        : hour < 19
          ? 'Boa Tarde'
          : 'Boa Noite'
    },
    hasClients () {
      return this.userLoggedIn.clients.length > 0
    },
    clients () {
      return this.userLoggedIn.clients
    },
    appointments () {
      return this.userLoggedIn.appointments
        .filter(el => moment(el.eventStart).isAfter(moment()))
    },
    hasAppointments () {
      return this.appointments.length > 0
    }
  },
  methods: {
    formatDate (date, pattern = 'LLL') {
      return moment(date).locale('pt-BR').format(pattern)
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

.oab
  font-size 1.5rem
  padding-top 0
  span
    font-weight bold

</style>
