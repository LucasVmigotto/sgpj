<template>
  <v-dialog
    v-model="dialog"
    width="500px"
    persistent
  >
    <v-card>
      <v-card-title>
        Adicionar Cliente
        <v-spacer />
        <v-icon @click="close">
          mdi-close
        </v-icon>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <span class="subtitle">Informações Pessoais:</span>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="clientEdit.name"
                :rules="[ rules.required, rules.name ]"
                prepend-inner-icon="mdi-account"
                label="Nome"
                hint="John Doe"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="clientEdit.cpf"
                :rules="[ rules.required, rules.cpf ]"
                prepend-inner-icon="mdi-card-account-details"
                type="number"
                label="CPF"
                hint="00000000000"
              />
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <span class="subtitle">Informações de Contato:</span>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="clientEdit.email"
                prepend-inner-icon="mdi-email"
                :rules="[ rules.email ]"
                label="E-Mail"
                hint="username@email.com"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="clientEdit.phone"
                prepend-inner-icon="mdi-phone"
                :rules="[ rules.required, rules.phone ]"
                label="Telefone"
                hint="[[55]11]000000000"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-row no-gutters>
          <v-spacer />
          <v-col cols="4">
            <v-btn
              :disabled="invalid()"
              color="primary"
              block
              @click="save"
            >
              Salvar <v-icon>mdi-account-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      clientEdit: {
        name: '',
        cpf: '',
        email: '',
        phone: ''
      }
    }
  },
  computed: {
    ...mapGetters('client', [
      'client'
    ]),
    rules: () => ({
      required: value => !!value || 'Campo obrigatório',
      name: value => value.trim().length > 3 || 'Nome inválido',
      cpf: value => value.length === 11 || 'CPF deve ter 11 números',
      email: value => !!value.match(/^[\w\d]+@[\w\d]+(\.\w+)+$/) || 'E-mail deve ser válido',
      phone: value => !!value.match(/^[0-9]{9,13}$/) || 'Telefone deve ser válido'
    })
  },
  watch: {
    client ({ name, cpf, email, phone }) {
      this.clientEdit = {
        name, cpf, email, phone
      }
    }
  },
  methods: {
    invalid () {
      return (this.clientEdit.name.trim().length < 4 ||
        this.clientEdit.cpf.trim().length !== 11 ||
        (this.clientEdit.email && !this.clientEdit.email.match(/^[\w\d]+@[\w\d]+(\.\w+)+$/)) ||
        (this.clientEdit.phone && !this.clientEdit.phone.match(/^[0-9]{9,13}$/)))
    },
    save () {
      this.$emit('save', { ...this.clientEdit })
    },
    close () {
      this.clientEdit = {
        name: '',
        cpf: '',
        email: '',
        phone: ''
      }
      this.$emit('close')
    }
  }
}
</script>
<style lang="stylus" scoped>
.subtitle
  font-size 1.1rem
  font-weight 700
</style>
