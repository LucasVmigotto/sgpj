<template>
  <v-card>
    <v-card-title>
      <v-col cols="11">
        <v-text-field
          v-model="noteText"
          :rules="[rules.required, rules.min]"
          label="Adicionar Nota"
          placeholder="Vara judicial, Número de processo..."
        />
      </v-col>
      <v-col cols="1">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn
              :disabled="invalid"
              color="primary"
              block
              v-on="on"
              @click="newNote"
            >
              <v-icon>mdi-file-plus</v-icon>
            </v-btn>
          </template>
          <span>Adicionar nota</span>
        </v-tooltip>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          label="Valor de consulta"
          prepend-inner-icon="mdi-magnify"
          @input="filter"
        />
      </v-col>
    </v-card-title>
    <v-card-text>
      <v-col cols="12">
        <v-simple-table class="table-layout">
          <template v-slot:default>
            <thead>
              <th width="80%">
                Nota
              </th>
              <th width="15%">
                Data de Criação
              </th>
              <th width="5%">
                Ações
              </th>
            </thead>
            <tbody>
              <tr
                v-for="(el, index) in values"
                :key="index"
              >
                <td>{{ el.text }}</td>
                <td>{{ format(el.createAt) }}</td>
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="red"
                        icon
                        small
                        v-on="on"
                        @click="remove(el.noteId)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Remover</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-card-text>
  </v-card>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    notes: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    search: null,
    filtered: [],
    noteText: '',
    rules: {
      required: value => !!value || 'Campo obrigatório deve ser preenchido',
      min: value => value.length >= 10 || 'Uma nota deve ter mínimo de 10 caractéres'
    }
  }),
  computed: {
    invalid () {
      return !this.noteText || this.noteText.length < 10
    },
    values () {
      return this.search && this.search !== ''
        ? this.filtered
        : this.notes
    }
  },
  methods: {
    filter (text) {
      this.filtered = text && text !== ''
        ? this.notes.filter(el => el.text.includes(text))
        : this.notes
    },
    newNote () {
      if (!this.invalid) {
        this.$emit('save', this.noteText)
        this.noteText = ''
      }
    },
    remove (noteId) {
      this.search = null
      this.$emit('remove', noteId)
    },
    format: pattern => moment(pattern)
      .locale('pt-BR')
      .format('ddd DD/MM/YY hh:mma')
  }
}
</script>
