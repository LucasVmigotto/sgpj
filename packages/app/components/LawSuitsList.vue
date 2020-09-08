<template>
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
</template>

<script>
export default {
  props: {
    lawSuits: {
      type: Object,
      required: true
    }
  }
}
</script>
