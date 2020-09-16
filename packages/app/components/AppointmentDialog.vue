<template>
  <v-dialog
    v-model="dialog"
    width="500"
    persistent
  >
    <v-card>
      <v-card-title>
        Adicionar Compromissos
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
            <v-col cols="12">
              <v-text-field
                v-model="item.title"
                :rules="[rules.required, rules.min]"
                label="Título"
                placeholder="Reunião Extraordinária"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="item.description"
                :rules="[rules.required, rules.min]"
                label="Descrição"
                placeholder="O empenho em analisar o comprometimento entre as equipes estimula a padronização dos índices pretendidos."
                auto-grow
              />
            </v-col>
            <v-select
              v-model="item.lawSuitId"
              :items="client.lawSuits"
              item-text="title"
              item-value="lawSuitId"
              label="Processo relacionado"
              prepend-inner-icon="mdi-book-account"
              required
            />
            <v-row>
              <v-col cols="12">
                <v-menu
                  v-model="menuDate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Data"
                      prepend-icon="mdi-calendar-blank-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="date"
                    @input="menuDate = false"
                  />
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-menu
                  v-model="menuTimeStart"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  min-width="290px"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="timeStart"
                      label="Início"
                      prepend-icon="mdi-clock"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-time-picker
                    v-model="timeStart"
                    @input="menuTimeStart = false"
                  />
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-menu
                  v-model="menuTimeEnd"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  min-width="290px"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="timeEnd"
                      label="Fim"
                      prepend-icon="mdi-clock"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-time-picker
                    v-model="timeEnd"
                    @input="menuTimeEnd = false"
                  />
                </v-menu>
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
import moment from 'moment'

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    rules: {
      required: value => !!value || 'Campo obrigatório',
      min: value => value.length > 4 || 'Minímo de 4 caracteres'
    },
    item: {
      title: '',
      description: '',
      lawSuitId: null
    },
    menuDate: false,
    date: null,
    menuTimeStart: false,
    timeStart: null,
    menuTimeEnd: false,
    timeEnd: null
  }),
  computed: {
    ...mapGetters('client', [
      'client'
    ]),
    ...mapGetters('user', [
      'userLoggedIn'
    ]),
    ...mapGetters('appointment', [
      'appointment'
    ])
  },
  watch: {
    appointment (newVal) {
      if (newVal) {
        this.item = {
          title: newVal.title,
          description: newVal.description,
          lawSuitId: newVal.lawSuitId
        }
        const timeStart = moment(newVal.eventStart)
        this.date = timeStart.format('YYYY-MM-DD')
        this.timeStart = timeStart.format('HH:mm')
        const timeEnd = moment(newVal.eventEnd)
        this.timeEnd = timeEnd.format('HH:mm')
      }
    }
  },
  methods: {
    resetForm () {
      this.item = {
        title: '',
        description: '',
        clientId: null
      }
      this.menuDate = false
      this.date = null
      this.menuTimeStart = false
      this.timeStart = null
      this.menuTimeEnd = false
      this.timeEnd = null
    },
    close () {
      this.resetForm()
      this.$emit('close')
    },
    invalid () {
      return (
        !this.item.title || this.item.title < 4 ||
        !this.item.title || this.item.title < 4 ||
        !this.date || !this.timeStart || !this.timeEnd ||
        !this.item.lawSuitId
      )
    },
    save () {
      const input = {
        ...this.item,
        eventStart: moment(`${this.date} ${this.timeStart}`).toISOString(),
        eventEnd: moment(`${this.date} ${this.timeEnd}`).toISOString(),
        clientId: this.client.clientId,
        lawyerId: this.userLoggedIn.lawyerId
      }
      this.resetForm()
      this.$emit('save', input)
    }
  }
}
</script>
