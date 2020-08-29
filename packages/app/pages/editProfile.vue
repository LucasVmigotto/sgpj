<template>
  <v-layout>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Editar Perfil
            <v-spacer />
            <v-switch
              v-model="editMode"
              label="Editar"
            />
          </v-card-title>
          <v-card-text>
            <v-container>
              <span class="subtitle">Informações Pessoais</span>
              <v-form>
                <v-row
                  align="center"
                  justify="space-around"
                >
                  <v-col cols="4">
                    <v-text-field
                      v-model="lawyer.name"
                      :disabled="!editMode"
                      :rules="[ rules.required, rules.requiredMin ]"
                      prepend-inner-icon="mdi-account"
                      label="Nome"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model="lawyer.oab"
                      :disabled="!editMode"
                      :rules="[ rules.required, rules.oab ]"
                      prepend-inner-icon="mdi-card-account-details"
                      type="number"
                      label="OAB"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      :disabled="!editMode"
                      color="primary"
                      outlined
                      block
                      @click="updateProfile"
                    >
                      Atualizar Perfil
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
              <v-divider class="my-4" />
              <span class="subtitle">Informações de Acesso</span>
              <v-form>
                <v-row
                  align="center"
                  justify="space-around"
                >
                  <v-col cols="4">
                    <v-text-field
                      v-model="email"
                      :disabled="!editMode"
                      :rules="[ rules.required, rules.email ]"
                      prepend-inner-icon="mdi-email"
                      label="E-mail"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model="confirmEmail"
                      :disabled="!editMode"
                      :rules="[ rules.required, rules.email, sameEmail ]"
                      prepend-inner-icon="mdi-email"
                      label="Confirmar E-mail"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      :disabled="!editMode"
                      color="primary"
                      outlined
                      block
                      @click="updateUserEmail"
                    >
                      Atualizar Email
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
              <v-form>
                <v-row
                  align="center"
                  justify="space-around"
                >
                  <v-col cols="4">
                    <v-text-field
                      v-model="password"
                      :disabled="!editMode"
                      :rules="[ rules.required, rules.password ]"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      prepend-inner-icon="mdi-form-textbox-password"
                      label="Senha"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model="confirmPassword"
                      :disabled="!editMode"
                      :rules="[ rules.required, rules.password, samePassword ]"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      prepend-inner-icon="mdi-form-textbox-password"
                      label="Confirmar Senha"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      :disabled="!editMode"
                      color="primary"
                      outlined
                      block
                      @click="updateUserPassword"
                    >
                      Atualizar Senha
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { cloneDeep } from 'lodash'

export default {
  data () {
    return {
      editMode: false,
      showPassword: false,
      confirmPassword: '',
      confirmEmail: '',
      lawyer: {
        name: '',
        oab: '',
        roles: []
      },
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters('user', [
      'userLoggedIn'
    ]),
    rules: () => ({
      required: value => !!value || 'Campo obrigatório',
      requiredMin: value => value.trim().length > 3 || 'Insira um nome válido',
      oab: value => value.length === 7 || 'OAB deve ter mínimo de 7 números',
      email: value => !!value.match(/^[\w\d]+@[\w\d]+(\.\w+)+$/) || 'E-mail deve ser válido',
      password: value => value.length > 6 || 'Senha deve ter no mínimo 6 caracteres'
    })
  },
  watch: {
    userLoggedIn () {
      this.cloneObject()
    }
  },
  created () {
    this.cloneObject()
  },
  methods: {
    ...mapActions([
      'pushMessage'
    ]),
    ...mapActions('user', [
      'updateEmail',
      'updatePassword'
    ]),
    ...mapActions('lawyer', [
      'createLawyer'
    ]),
    cloneObject () {
      const crrLawyer = cloneDeep(this.userLoggedIn)
      delete crrLawyer.user
      delete crrLawyer.clients
      delete crrLawyer.appointments
      const crrUser = cloneDeep(this.userLoggedIn.user)
      this.lawyer = { ...this.lawyer, ...crrLawyer }
      this.email = crrUser.email
    },
    invalidProfile () {
      if (!this.lawyer.name || this.lawyer.name.trim().length < 4) {
        return 'nome'
      }
      if (!this.lawyer.oab || !this.lawyer.oab.trim().length === 7) {
        return 'oab'
      }
      return false
    },
    updateProfile () {
      const invalid = this.invalidProfile()
      if (invalid) {
        this.pushMessage({
          type: 'error',
          text: `O campo "${invalid}" não foi preenchido corretamente`
        })
        return
      }
      this.createLawyer({
        lawyerId: this.lawyer.lawyerId,
        input: {
          name: this.lawyer.name,
          oab: this.lawyer.oab,
          roles: this.lawyer.roles
        }
      })
        .then((res) => {
          this.pushMessage({
            text: 'Perfil atualizado com sucesso',
            type: 'success'
          })
          this.editMode = false
        })
    },
    sameEmail (val) {
      return val === this.confirmEmail ||
        'Os E-mails não são iguais'
    },
    samePassword (val) {
      return val === this.confirmPassword ||
        'As senhas não são iguais'
    },
    invalidEmail () {
      if (!this.email || !this.confirmEmail) {
        return 'O campo E-mail não foi preenchido'
      }
      if (!this.email.match(/^[\w\d]+@[\w\d]+(\.\w+)+$/) ||
        !this.confirmEmail.match(/^[\w\d]+@[\w\d]+(\.\w+)+$/)) {
        return 'O E-Mail inserido não é válido'
      }
      if (!this.sameEmail(this.email)) {
        return 'Os E-mails não conferem'
      }
      return false
    },
    updateUserEmail () {
      const invalid = this.invalidEmail()
      if (invalid) {
        this.pushMessage({
          type: 'error',
          text: invalid
        })
        return
      }
      this.updateEmail({
        lawyerId: this.userLoggedIn.lawyerId,
        email: this.email
      })
        .then((res) => {
          this.pushMessage({
            text: 'E-mail atualizado com sucesso',
            type: 'success'
          })
          this.editMode = false
        })
    },
    updateUserPassword () {}
  }
}
</script>
<style lang="stylus" scoped>
.subtitle
  font-size 1.1rem
  font-weight 700
</style>
