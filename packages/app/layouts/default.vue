<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
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
              size="36"
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
      <v-spacer />
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn
            color="red"
            icon
            v-on="on"
            @click="logoutUser"
          >
            <v-icon>mdi-logout-variant</v-icon>
          </v-btn>
        </template>
        <span>Log out</span>
      </v-tooltip>
      <v-progress-linear
        v-show="loading"
        :loading="loading"
        absolute
        bottom
      />
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
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      title: 'Sistema Gerenciador de Processos Juridícos',
      drawer: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/dashboard'
        },
        {
          icon: 'mdi-calendar-today',
          title: 'Agenda',
          to: '/schedule'
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Advogados',
          to: '/lawyers'
        },
        {
          icon: 'mdi-clipboard-account',
          title: 'Clientes',
          to: '/clients'
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
      'messageType',
      'loading'
    ]),
    ...mapGetters('user', [
      'userLoggedIn'
    ])
  },
  methods: {
    ...mapActions('user', [
      'logout'
    ]),
    avatarInitials () {
      const words = this.userLoggedIn.name.split(' ')
      const firstLetter = words[0].charAt(0)
      const lastLetter = words[words.length - 1].charAt(0)
      return `${firstLetter}${lastLetter}`
    },
    logoutUser () {
      this.logout()
      this.$router.push({ name: 'index' })
    }
  }
}
</script>
