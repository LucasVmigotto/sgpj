<template>
  <v-dialog
    v-model="visible"
    width="400px"
    persistent
  >
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-row
          justify="space-around"
          no-gutters
        >
          <v-col cols="5">
            <v-btn
              :disabled="loading"
              :loading="loading"
              color="green"
              block
              outlined
              @click="confirm"
            >
              Sim<v-icon>mdi-check</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="5">
            <v-btn
              :disabled="loading"
              :loading="loading"
              color="red"
              block
              outlined
              @click="cancel"
            >
              Não<v-icon>mdi-close</v-icon>
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
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirmar ação'
    },
    message: {
      type: String,
      default: 'Você confirma esta ação?'
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
