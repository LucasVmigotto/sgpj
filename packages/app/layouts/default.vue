<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      expand-on-hover
      :clipped="true"
      fixed
      app
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-avatar
              color="primary"
              :size="miniVariant ? 36 : 48"
            >
              <span>{{ avatarInitials() }}</span>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ userLoggedIn.name }}</v-list-item-title>
            <v-list-item-subtitle>OAB: {{ userLoggedIn.oab }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="true"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-alert
          v-model="alertVisible"
          :type="messageType"
          transition="slide-x-transition"
          elevation="9"
          border="right"
          class="front"
          colored-border
          absolute
        >
          {{ messageText }}
        </v-alert>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      title: 'Sistema Gerenciador de Processos Juridícos',
      drawer: true,
      miniVariant: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/dashboard'
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Advogados',
          to: '/lawyers'
        },
        {
          icon: 'mdi-account-cog',
          title: 'Configuração de perfil',
          to: '/editProfile'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'alertVisible',
      'messageText',
      'messageType'
    ]),
    ...mapGetters('user', [
      'userLoggedIn'
    ])
  },
  methods: {
    avatarInitials () {
      const words = this.userLoggedIn.name.split(' ')
      const firstLetter = words[0].charAt(0)
      const lastLetter = words[words.length - 1].charAt(0)
      return `${firstLetter}${lastLetter}`
    }
  }
}
</script>
