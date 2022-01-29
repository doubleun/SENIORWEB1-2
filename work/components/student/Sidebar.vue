<template>
  <v-navigation-drawer
    fixed
    app
    :color="theme === 'default' ? '#253B6E' : 'white'"
    :dark="theme === 'default'"
    width="310"
  >
    <v-col :style="theme === 'default' ? 'color: white' : 'color: black'">
      <v-row class="justify-center">
        <!-- Logo and website name -->
        <router-link to="/">
          <v-img src="/it_logo.png" max-width="80" class="mb-3"></v-img>
        </router-link>
      </v-row>
      <v-row class="justify-center"><h4>SENIOR PROJECT</h4></v-row>
      <v-row class="justify-center"
        ><h6>SCHOOL OF INFORMATION TECHNOLOGY</h6></v-row
      >
      <v-row class="justify-center"><h5 style="margin-left:5px;color:#253B6E;">1/2022</h5></v-row>
    </v-col>
    <!-- Lists routes Home-Final Presentation -->
    <v-list shaped class="mt-3">
      <v-list-item-group
        :color="theme === 'default' ? 'white' : 'indigo'"
        :dark="theme === 'default'"
      >
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          :disabled="item.disabled"
          router
          exact
          :active-class="
            theme === 'default' ? 'v-item--active-dark' : 'v-item--active-light'
          "
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  props: ["items", "theme"]
  // computed: {
  //   drawer: {
  //     get() {
  //       return this.$store.state.drawer;
  //     },
  //     set(newVal) {
  //       this.$store.commit("set_drawer", newVal);
  //     }
  //   }
  // }
};
</script>

<style scoped>
.v-item--active-dark {
  padding: 0 16px 0 12px !important;
  border-left: 1px solid #72cef7;
  border-width: 4px;
}
.v-item--active-light {
  padding: 0 16px 0 12px !important;
  border-left: 1px solid #004fab;
  border-width: 4px;
}
.v-list-item {
  height: 42px !important;
}
.v-list-item__title {
  font-size: 14px;
  text-transform: uppercase;
}
</style>
