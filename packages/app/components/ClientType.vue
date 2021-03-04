<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-icon
        v-if="type === 'FISICO'"
        v-on="on"
      >
        mdi-account
      </v-icon>
      <v-icon
        v-else
        v-on="on"
      >
        mdi-domain
      </v-icon>
    </template>
    <span v-if="type === 'FISICO'">
      Pessoa Física
    </span>
    <span v-else>
      Pessoa Jurídica
    </span>
  </v-tooltip>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    }
  }
}
</script>
