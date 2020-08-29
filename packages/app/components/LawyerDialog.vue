<template>
  <v-dialog
    v-model="dialog"
    width="500px"
    persistent
  >
    <v-card>
      <v-card-title>
        Adicionar Advogado
        <v-spacer />
        <v-icon @click="close">
          mdi-close
        </v-icon>
      </v-card-title>
      <v-card-text>
        <v-form>
          <span>Informações Pessoais:</span>
          <v-text-field
            v-model="lawyer.name"
            :rules="[ rules.required ]"
            prepend-inner-icon="mdi-account"
            label="Nome"
            hint="John Doe"
          />
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="lawyer.oab"
                :rules="[ rules.required, rules.oab ]"
                prepend-inner-icon="mdi-card-account-details"
                type="number"
                label="OAB"
                hint="1234567"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="lawyer.roles"
                prepend-inner-icon="mdi-account-lock"
                label="Permissões"
                :items="roles"
                item-text="text"
                item-value="value"
                required
                multiple
              />
            </v-col>
          </v-row>
          Criação de usuário
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="lawyer.user.email"
                prepend-inner-icon="mdi-email"
                :rules="[ rules.required, rules.email ]"
                label="E-Mail"
                hint="username@email.com"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="confirmEmail"
                :rules="[ rules.required, rules.email, sameEmail ]"
                label="Confirme o E-Mail"
                hint="username@email.com"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="lawyer.user.password"
                :rules="[ rules.required, rules.password ]"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-form-textbox-password"
                label="Senha"
                hint="*********"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="confirmPassword"
                :rules="[ rules.required, rules.password, samePassword ]"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                label="Confirme a senha"
                hint="*********"
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
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      showPassword: false,
      lawyer: {
        name: '',
        oab: '',
        roles: [],
        user: {
          email: '',
          password: ''
        }
      },
      confirmEmail: '',
      confirmPassword: ''
    }
  },
  computed: {
    roles: () => ([
      {
        text: 'Administrador',
        value: 'ADMIN'
      },
      {
        text: 'Advogado',
        value: 'LAWYER'
      }
    ]),
    rules: () => ({
      required: value => !!value || 'Campo obrigatório',
      oab: value => value.length === 7 || 'OAB deve ter 7 números',
      email: value => !!value.match(/^[\w\d]+@[\w\d]+(\.\w+)+$/) || 'E-mail deve ser válido',
      password: value => value.length > 6 || 'Senha deve ter no mínimo 6 caracteres'
    })
  },
  created () {
    this.resetLawyer()
  },
  methods: {
    sameEmail (val) {
      return val === this.lawyer.user.email ||
      'Email deve ser igual ao informado'
    },
    samePassword (val) {
      return val === this.lawyer.user.password ||
      'Senha deve ser igual a informada'
    },
    resetLawyer () {
      this.lawyer = {
        name: '',
        oab: '',
        roles: [],
        user: {
          email: '',
          password: ''
        }
      }
      this.showPassword = false
      this.confirmEmail = ''
      this.confirmPassword = ''
    },
    save () {
      const add = {
        ...this.lawyer,
        user: { ...this.lawyer.user }
      }
      this.resetLawyer()
      this.$emit('save', { ...add })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
