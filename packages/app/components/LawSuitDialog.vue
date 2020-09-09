<template>
  <v-dialog
    v-model="dialog"
    width="500px"
    persistent
  >
    <v-card>
      <v-card-title>
        Adicionar
        <v-spacer />
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              small
              icon
              v-on="on"
              @click="close"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Fechar formulário</span>
        </v-tooltip>
      </v-card-title>
      <v-form>
        <v-card-text>
          <v-container column>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="item.title"
                  :rules="[rules.required, rules.min]"
                  label="Título"
                  placeholder="Processo Ação Cívil"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="item.description"
                  :rules="[rules.required, rules.min]"
                  label="Descrição"
                  placeholder="A prática cotidiana prova que a contínua expansão de nossa atividade pode nos levar a considerar a reestruturação dos paradigmas corporativos."
                  auto-grow
                />
              </v-col>
            </v-row>
          </v-container>
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
      </v-form>
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
  data: () => ({
    rules: {
      required: value => !!value || 'Campo obrigatório deve ser preenchido',
      min: value => value.length > 4 || 'Campo obrigatório deve ser preenchido'
    },
    item: {
      title: '',
      description: ''
    }
  }),
  computed: {
    ...mapGetters('client', [
      'client'
    ]),
    ...mapGetters('lawsuit', [
      'lawSuit'
    ])
  },
  watch: {
    lawSuit (newVal) {
      if (newVal) {
        this.item = {
          title: newVal.title,
          description: newVal.description
        }
      }
    }
  },
  methods: {
    resetForm () {
      this.item = {
        title: '',
        description: ''
      }
    },
    close () {
      this.resetForm()
      this.$emit('close')
    },
    invalid () {
      return (
        !this.item.title || this.item.title < 4 ||
        !this.item.title || this.item.title < 4
      )
    },
    save () {
      const lawSuit = {
        ...this.item,
        clientId: this.client.clientId
      }
      this.resetForm()
      this.$emit('save', lawSuit)
    }
  }
}
</script>
