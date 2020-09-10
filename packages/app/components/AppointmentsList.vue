<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>Título</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(el, index) in appointments"
            :key="index"
          >
            <td>{{ el.title }}</td>
            <td>{{ formatDate(el.eventDate) }}</td>
            <td>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="primary"
                    icon
                    small
                    v-on="on"
                    @click="edit(el.appointmentId)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Atualizar compromisso</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="red"
                    icon
                    small
                    v-on="on"
                    @click="remove(el.appointmentId)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Remover compromisso</span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    appointments: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatDate (date) {
      return moment(date).locale('pt-BR').format('LLL')
    },
    edit (id) {
      this.$emit('edit', id)
    },
    remove (id) {
      this.$emit('remove', id)
    }
  }
}
</script>
