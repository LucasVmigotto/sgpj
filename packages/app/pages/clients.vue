<template>
  <v-layout>
    <v-container>
      <span class="title">Clientes</span>
      <v-row>
        <v-col cols="12">
          <v-data-table
            :items="clients"
            :headers="headers"
            hide-default-footer
          >
            <template v-slot:body="{ items }">
              <tbody>
                <tr
                  v-for="(el, index) in items"
                  :key="index"
                >
                  <td>
                    <client-type :type="el.clientType" />
                  </td>
                  <td>{{ el.name }}</td>
                  <td>{{ el.cpf }}</td>
                  <td>{{ el.email }}</td>
                  <td>{{ el.phone }}</td>
                  <td align="right">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          small
                          icon
                          v-on="on"
                          @click="setClient(el.clientId)"
                        >
                          <v-icon color="primary">
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Editar cliente</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          small
                          icon
                          v-on="on"
                          @click="openDel(el.clientId)"
                        >
                          <v-icon color="red">
                            mdi-delete
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Excluir cliente</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          small
                          icon
                          v-on="on"
                          @click="goToClient(el.clientId)"
                        >
                          <v-icon>mdi-chevron-right-box</v-icon>
                        </v-btn>
                      </template>
                      <span>
                        Visualizar cliente
                      </span>
                    </v-tooltip>
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
      @click="addClient"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <client-dialog
      v-model="clientEdit"
      :dialog="dialog"
      @save="save"
      @close="cancelAdd"
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
import ConfirmAction from '../components/ConfirmAction'
import ClientDialog from '../components/ClientDialog'
import ClientType from '../components/ClientType'

export default {
  components: {
    ConfirmAction,
    ClientDialog,
    ClientType
  },
  data () {
    return {
      clientEdit: {
        name: '',
        cpf: '',
        email: '',
        phone: ''
      },
      dialog: false,
      currentPage: 1,
      lawyerSelect: null,
      confirmDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'loading'
    ]),
    ...mapGetters('client', [
      'clients',
      'client',
      'pageLength'
    ]),
    headers: () => ([
      {
        title: 'Tipo',
        sortable: false,
        value: 'clientType'
      },
      {
        title: 'Nome',
        sortable: false,
        value: 'name'
      },
      {
        title: 'CPF',
        sortable: false,
        value: 'cpf'
      },
      {
        title: 'E-mail',
        sortable: false,
        value: 'email'
      },
      {
        title: 'Fone',
        sortable: false,
        value: 'phone'
      },
      {
        title: 'Ações',
        sortable: false
      }
    ])
  },
  async created () {
    await this.listClients()
  },
  methods: {
    ...mapActions([
      'pushMessage'
    ]),
    ...mapActions('client', [
      'listClients',
      'getClient',
      'resetClient',
      'createClient',
      'deleteClient',
      'jumpPage',
      'changePage'
    ]),
    setClient (clientId) {
      this.getClient(clientId)
        .then((res) => {
          this.dialog = true
        })
    },
    addClient () {
      this.dialog = true
    },
    save (input) {
      this.dialog = false
      if (this.client && this.client.clientId) {
        this.createClient({
          clientId: this.client.clientId,
          input
        })
          .then((res) => {
            if (res) {
              this.pushMessage({
                text: 'Cliente atualizado com sucesso',
                type: 'success'
              })
            }
          })
      } else {
        this.createClient({
          input
        })
          .then((res) => {
            if (res) {
              this.pushMessage({
                text: 'Cliente adicionado com sucesso',
                type: 'success'
              })
            }
          })
      }
      this.resetClient()
    },
    cancelAdd () {
      this.dialog = false
      this.resetClient()
    },
    openDel (clientId) {
      this.clientSelect = clientId
      this.confirmDialogVisible = true
    },
    confirmDel () {
      this.deleteClient(this.clientSelect)
        .then((res) => {
          this.clientSelect = null
          this.confirmDialogVisible = false
          if (res) {
            this.pushMessage({
              text: 'Cliente removido com sucesso',
              type: 'success'
            })
          }
        })
    },
    cancelDel () {
      this.clientSelect = null
      this.confirmDialogVisible = false
    },
    goToClient (clientId) {
      this.getClient(clientId)
        .then((res) => {
          if (res && res.clientId && res.clientId === clientId) {
            this.$router.push({ name: 'clientDashboard' })
          }
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.title
  font-size 1.5rem
  font-weigth 700
</style>
