<template lang="html">
  <!-- Appbar -->
  <v-app-bar fixed app :elevation="0" :color="theme">
    <!-- Hamberbur -->
    <!-- <v-app-bar-nav-icon @click.stop="toggleDrawer" /> -->
    <v-spacer></v-spacer>
    <!-- Menu -->
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <!-- Display name button -->
        <v-btn
          text
          :ripple="false"
          v-on="on"
          id="no-background-hover"
          :style="theme === 'transparent' ? 'color: white' : 'color: inherit'"
        >
          <h3 style="margin-inline-end: 1rem">
            ANUTHEP TAYNGAM
          </h3>
          <v-avatar
            ><img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John"
          /></v-avatar>
          <v-icon right>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          router
          :to="item.route"
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
    items: [{ icon: "mdi-logout", title: "Logout", route: "/" }]
  }),
  props: ["theme"],
  methods: {
    toggleDrawer() {
      this.$store.commit("set_drawer", !this.$store.state.drawer);
    }
  }
};
</script>

<style scoped>
#no-background-hover::before {
  background-color: transparent !important;
}
</style>
