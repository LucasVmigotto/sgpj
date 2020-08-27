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
            hide-default-footer
          >
            <template v-slot:body="{ items }">
              <tbody class="table-headers">
                <tr
                  v-for="(el, index) in items"
                  :key="index"
                >
                  <td>{{ el.name }}</td>
                  <td>{{ el.oab }}</td>
                  <td align="right">
                    <v-icon>
                      mdi-information
                    </v-icon>
                    <v-icon
                      v-if="userInRoles(userLoggedIn, ['ADMIN'])"
                      color="red"
                    >
                      mdi-delete
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-pagination
            v-model="currentPage"
            :length="pageLength"
            @input="jumpPage"
            @next="changePage(true)"
            @previous="changePage(false)"
          />
        </v-col>
      </v-row>
    </v-container>
    <v-btn
      color="primary"
      fab
      fixed
      bottom
      right
      @click="addLawyer"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <lawyer-dialog
      :dialog="dialog"
      @close="dialog = !dialog"
      @save="save"
    />
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInRoles } from '../utils'
import LawyerDialog from '../components/LawyerDialog'

export default {
  components: { LawyerDialog },
  data () {
    return {
      dialog: false,
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters('user', [
      'userLoggedIn',
      'token'
    ]),
    ...mapGetters('lawyer', [
      'lawyers',
      'pageLength'
    ]),
    headers: () => ([
      {
        text: 'Nome',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      {
        text: 'OAB',
        align: 'center',
        sortable: false,
        value: 'oab'
      },
      {
        text: 'Ações',
        align: 'right',
        sortable: false
      }
    ])
  },
  async created () {
    await this.listLawyers(this.token)
  },
  methods: {
    ...mapActions('lawyer', [
      'listLawyers',
      'createLawyer',
      'jumpPage',
      'changePage'
    ]),
    userInRoles,
    addLawyer () {
      this.dialog = true
    },
    async save (input) {
      this.dialog = false
      await this.createLawyer({
        token: this.token, input
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.table-headers
  td:nth-of-type(1)
    width 70%
  td:nth-of-type(2)
    width 10%
  td:nth-of-type(3)
    width 20%

</style>
