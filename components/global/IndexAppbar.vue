<template lang="html">
 <!-- Appbar -->
  <v-app-bar fixed app color="#253b6e" dark>
      <v-app-bar-nav-icon @click.stop="toggleDrawer" />
    <v-spacer></v-spacer>
    <!-- Login button -->
    <v-btn text v-on="on">
          <span>Login</span>
        </v-btn>
  </v-app-bar>
</template>
<script>
export default {
  methods: {
    toggleDrawer() {
      this.$store.commit("set_drawer", !this.$store.state.drawer);
    },
  },
};
</script>
