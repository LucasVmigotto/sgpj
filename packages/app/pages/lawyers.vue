<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-container>
      <span class="title">Advogados</span>
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
                    <v-btn
                      small
                      icon
                    >
                      <v-icon>
                        mdi-information
                      </v-icon>
                    </v-btn>
                    <v-btn
                      v-if="userInRoles(userLoggedIn, ['ADMIN'])"
                      small
                      icon
                      @click="openDel(el.lawyerId)"
                    >
                      <v-icon color="red">
                        mdi-delete
                      </v-icon>
                    </v-btn>
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
    <confirm-action
      :visible="confirmDialogVisible"
      :loading="loading"
      @confirm="confirmDel"
      @cancel="cancelDel"
    />
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { userInRoles } from '../utils'
import LawyerDialog from '../components/LawyerDialog'
import ConfirmAction from '../components/ConfirmAction'

export default {
  components: {
    LawyerDialog,
    ConfirmAction
  },
  data () {
    return {
      dialog: false,
      currentPage: 1,
      lawyerSelect: null,
      confirmDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'loading',
      'messageTimeout'
    ]),
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
    await this.listLawyers()
  },
  methods: {
    ...mapActions([
      'pushMessage'
    ]),
    ...mapActions('lawyer', [
      'listLawyers',
      'createLawyer',
      'deleteLawyer',
      'jumpPage',
      'changePage'
    ]),
    userInRoles,
    addLawyer () {
      this.dialog = true
    },
    save (input) {
      this.dialog = false
      this.createLawyer({
        input
      })
        .then((res) => {
          if (res) {
            this.pushMessage({
              text: 'Advogado adicionado com sucesso',
              type: 'success'
            })
          }
        })
    },
    openDel (lawyerId) {
      this.lawyerSelect = lawyerId
      this.confirmDialogVisible = true
    },
    confirmDel () {
      this.deleteLawyer(this.lawyerSelect)
        .then((res) => {
          this.lawyerSelect = null
          this.confirmDialogVisible = false
          if (res) {
            this.pushMessage({
              text: 'Advogado removido com sucesso',
              type: 'success'
            })
          }
        })
    },
    cancelDel () {
      this.lawyerSelect = null
      this.confirmDialogVisible = false
    }
  }
}
</script>
<style lang="stylus" scoped>
.title
  font-size 1.5rem
  font-weigth 700
.table-headers
  td:nth-of-type(1)
    width 70%
  td:nth-of-type(2)
    width 10%
  td:nth-of-type(3)
    width 20%

</style>
