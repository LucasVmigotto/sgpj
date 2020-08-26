<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-container>
      <v-row flex>
        <v-col cols="12">
          <v-data-table
            :items="lawyers"
            :headers="headers"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import { userInRoles } from '../utils'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('user', [
      'token'
    ]),
    ...mapGetters('lawyer', [
      'lawyers'
    ]),
    headers: () => ([
      {
        text: 'Nome',
        sortable: false,
        value: 'name'
      },
      {
        text: 'OAB',
        sortable: false,
        value: 'oab'
      }
    ])
  },
  async created () {
    await this.listLawyers(this.token)
  },
  methods: {
    ...mapActions('lawyer', [
      'listLawyers'
    ])
  }
}
</script>
