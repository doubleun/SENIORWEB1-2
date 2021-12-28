<template lang="html">
  <!-- Appbar -->
  <v-app-bar app :elevation="0" :color="theme" absolute>
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
            {{ userName }}
          </h3>
          <v-avatar><img :src="userImage" alt="John"/></v-avatar>
          <v-icon right>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" @click="logout">
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
    items: [{ icon: "mdi-logout", title: "Logout" }],
    userName: "",
    userImage: null
  }),
  async fetch() {
    // console.log("Appbar: ", this.$store.state.auth.currentUser);
    this.userName = this.$store.state.auth.currentUser.name;
    this.userImage = this.$store.state.auth.currentUser.photo;
  },
  props: ["theme"],
  methods: {
    // toggleDrawer() {
    //   this.$store.commit("set_drawer", !this.$store.state.drawer);
    // }
    // test() {
    //   console.log(this.$store.state.auth.currentUser);
    // },
    async logout() {
      await this.$store.dispatch("auth/logout");
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
#no-background-hover::before {
  background-color: transparent !important;
}
</style>
