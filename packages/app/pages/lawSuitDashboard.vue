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
      <v-col
        class="greet"
        cols="6"
      >
        <span>Processo:</span> {{ lawSuit.title }}
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data: () => ({

  }),
  computed: {
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
    goBack () {
      this.getClient(this.client.clientId)
        .then((res) => {
          if (res && res.clientId) {
            this.$router.push({ name: 'clientDashboard' })
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
