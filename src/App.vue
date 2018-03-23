<template>
  <v-app light>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          :to=item.link          
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'bubble_chart',
          title: 'Home',
          link: '/'
        },
        {
          icon: 'home',
          title: 'Hébergeurs',
          link: '/accomodations'
        },
        {
          icon: 'drive_eta',
          title: 'Chauffeurs',
          link: '/rides'
        },
        {
          icon: 'swap_horiz',
          title: 'Relais',
          link: '/relays'
        },
        {
          icon: 'repeat',
          title: 'Prolongations',
          link: '/extensions'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Colibri'
    }
  },
  name: 'App'
}
</script>
