<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(el, index) in lawSuits"
            :key="index"
          >
            <td>{{ el.title }}</td>
            <td>
              <span
                class="d-inline-block text-truncate"
                style="max-width: 150px;"
              >
                {{ el.description }}
              </span>
            </td>
            <td>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="primary"
                    icon
                    small
                    v-on="on"
                    @click="edit(el.lawSuitId)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Atualizar processo</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="red"
                    icon
                    small
                    v-on="on"
                    @click="remove(el.lawSuitId)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Remover processo</span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  props: {
    lawSuits: {
      type: Array,
      required: true
    }
  },
  methods: {
    edit (id) {
      this.$emit('edit', id)
    },
    remove (id) {
      this.$emit('remove', id)
    }
  }
}
</script>
