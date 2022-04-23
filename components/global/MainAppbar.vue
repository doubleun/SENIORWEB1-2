<template lang="html">
  <!-- Appbar -->
  <v-app-bar app :elevation="0" :color="theme" absolute>
    <!-- Hamberbur -->
    <!-- <v-app-bar-nav-icon @click.stop="toggleDrawer" /> -->
    <v-spacer></v-spacer>
    <!-- Menu -->
    <v-menu offset-y offset-x :nudge-bottom="10" :max-width="200">
      <template v-slot:activator="{ on }">
        <!-- Display name button -->
        <v-btn
          text
          :ripple="false"
          v-on="on"
          id="no-background-hover"
          :style="theme === 'transparent' ? 'color: white' : 'color: inherit'"
          @click="test"
        >
          <h3 style="margin-inline-end: 1rem">
            {{ userName }}
          </h3>
          <v-avatar color="brown">
            <!-- Display user image if possible -->
            <img
              :src="userImage"
              :alt="userInitial"
              referrerpolicy="no-referrer"
              v-if="!!userImage"
            />
            <!-- Else, display user's inital -->
            <span v-else class="white--text text-h5">
              {{ userInitial }}
            </span>
          </v-avatar>
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
    items: [{ icon: 'mdi-logout', title: 'Logout' }],
    userName: '',
    userInitial: '',
    userImage: null
  }),
  mounted() {
    this.userName = this.$store.getters['auth/currentUser'].name
    this.userImage = this.$store.getters['auth/currentUser'].photo

    // Get user's initial
    const userNameArr = this.userName.split(' ')

    // If cannot get an array, then use the first two letters
    this.userInitial =
      userNameArr.length > 0
        ? `${userNameArr[0][0]}${userNameArr[1][0]}`
        : `${fullName[0]}${fullName[1]}`
  },
  // computed: {
  // userInitial() {
  //   // Get user name
  //   const fullName = this.$store.getters['auth/currentUser'].name
  //   // Get user's initial
  //   const userNameArr = fullName.split(' ')

  //   // If cannot get an array, then use the first two letters
  //   return userNameArr.length > 0
  //     ? `${userNameArr[0][0]}${userNameArr[1][0]}`
  //     : `${fullName[0]}${fullName[1]}`
  // }
  // userImage() {
  //   return this.$store.getters['auth/currentUser'].photo
  // }
  // },
  props: ['theme'],
  methods: {
    // toggleDrawer() {
    //   this.$store.commit("set_drawer", !this.$store.state.drawer);
    // }
    test() {
      console.log(this.$store.state.auth.currentUser)
    },
    async logout() {
      await this.$store.dispatch('auth/logout')
      console.log('re routing back')
      window.location.reload()
    }
  }
}
</script>

<style scoped>
#no-background-hover::before {
  background-color: transparent !important;
}
</style>
