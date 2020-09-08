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
        />
        <div v-else>
          <v-icon large>
            mdi-calendar-alert
          </v-icon>
          Sem compromissos no momento
        </div>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('client', [
      'client'
    ]),
    hasLawSuits () {
      return this.client.lawSuits.length > 0
    },
    hasAppointments () {
      return this.client.appointments.length > 0
    }
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'clients' })
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
