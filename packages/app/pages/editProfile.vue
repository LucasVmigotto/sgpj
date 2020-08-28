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
              Informações pessoais
              <v-form>
                <v-row>
                  <v-text-field
                    v-model="lawyer.name"
                    :rules="[ rules.required ]"
                    prepend-inner-icon="mdi-account"
                    label="Nome"
                  />
                </v-row>
                <v-row align="center" justify="center">
                  <v-col cols="6">
                    <v-text-field
                      v-model="lawyer.oab"
                      :rules="[ rules.required, rules.oab ]"
                      prepend-inner-icon="mdi-card-account-details"
                      type="number"
                      label="OAB"
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
                  <v-row>
                    <v-spacer />
                    <v-col cols="4">
                      <v-btn
                        :disabled="editMode"
                        color="primary"
                        block
                        @click="updateProfile"
                      >
                        Atualizar Perfil
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-row>
              </v-form>
              <v-divider class="my-4" />
              <span class="subtitle">Informações de Acesso</span>
              <v-form>
                <v-row>
                  <v-text-field
                    v-model="user.email"
                    prepend-inner-icon="mdi-email"
                    :rules="[ rules.required, rules.email ]"
                    label="E-Mail"
                    hint="username@email.com"
                  />
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="user.password"
                      :rules="[ rules.required, rules.password ]"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      prepend-inner-icon="mdi-form-textbox-password"
                      label="Senha"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="confirmPassword"
                      :rules="[ rules.required, rules.password ]"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      prepend-inner-icon="mdi-form-textbox-password"
                      label="Senha"
                    />
                  </v-col>
                  <v-row>
                    <v-spacer />
                    <v-col cols="4">
                      <v-btn
                        :disabled="editMode"
                        color="primary"
                        block
                        @click="updateUsuário"
                      >
                        Atualizar Usuário
                      </v-btn>
                    </v-col>
                  </v-row>
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
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'

export default {
  data () {
    return {
      editMode: false,
      showPassword: false,
      confirmPassword: '',
      lawyer: {
        name: '',
        oab: '',
        roles: []
      },
      user: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters('user', [
      'userLoggedIn'
    ]),
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
    cloneObject () {
      const crrLawyer = cloneDeep(this.userLoggedIn)
      delete crrLawyer.user
      const crrUser = cloneDeep(this.userLoggedIn.user)
      this.lawyer = { ...this.lawyer, ...crrLawyer }
      this.user = { ...this.user, ...crrUser }
    },
    updateProfile () {},
    updateUser () {}
  }
}
</script>
