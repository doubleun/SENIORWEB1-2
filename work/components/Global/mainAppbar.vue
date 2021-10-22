<template lang="html">
 <!-- Appbar -->
  <v-app-bar fixed app color="white">
      <v-app-bar-nav-icon @click.stop="toggleDrawer" />
    <v-spacer></v-spacer>
    <!-- Menu -->
    <v-menu offset-y
      
    >
    <template v-slot:activator="{ on}">
      <!-- Display name button -->
        <v-btn
        text
          color="indigo"
          
          v-on="on"
        >
        
          <span>User</span>
          <v-icon right>mdi-chevron-down</v-icon>
        </v-btn>
        
      </template>
      <v-list>
        <v-list-item
        
          v-for="(item) in items"
          :key="item.title"
          router :to="item.route"
        >
        <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
      </v-menu>
  </v-app-bar>
</template>
<script>
export default {
  data: () => ({
    items: [{ icon: "mdi-logout", title: "Logout", route: "/" }],
  }),
  methods: {
    toggleDrawer() {
      this.$store.commit("set_drawer", !this.$store.state.drawer);
    },
  },
};
</script>