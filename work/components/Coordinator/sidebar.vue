<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    app
    color="#253B6E"
    dark
    width="310"
  >
    <v-col class="mt-3">
      <v-row class="justify-center">
        <!-- Logo and website name -->
        <router-link to="/Coordinator/home">
          <v-img src="/it_logo.png" max-width="85" class="mb-3"></v-img>
        </router-link>
      </v-row>
      <v-row class="justify-center white--text"><h5>SENIOR PROJECT</h5></v-row>
      <v-row class="justify-center white--text"
        ><h6>SCHOOL OF INFORMATION TECHNOLOGY</h6></v-row
      >
    </v-col>
    <!-- Lists routes Home-Final Presentation -->
    <v-list shaped class="mt-3">
      <v-list-item-group color="white">
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
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  data() {
    return {
      items: [
        {
          icon: "mdi-home",
          title: "Home",
          to: "/Senior1/Coordinator/home",
        },
        {
          icon: "mdi-account-multiple-plus",
          title: "Group Request",
          to: "/Senior1/Coordinator/groupRequest",
        },
        {
          icon: "mdi-account-multiple",
          title: "Committee",
          to: "/Senior1/Coordinator/committee",
        },
        {
          icon: "mdi-account-supervisor",
          title: "My Advisee",
          to: "/Senior1/Coordinator/myAdvisee",
        },
        {
          icon: "mdi-account-cog",
          title: "User Manage",
          to: "/Senior1/Coordinator/userManage",
        },
        {
          icon: "mdi-alpha-p-circle",
          title: "Score",
          to: "/Senior1/Coordinator/score",
        },
        {
          icon: "mdi-calendar-range",
          title: "Due Date",
          to: "/Senior1/Coordinator/dueDate",
        },
        {
          icon: "mdi-clipboard-edit-outline",
          title: "Criteria",
          to: "/Senior1/Coordinator/criteria",
        },
        
      ],
    };
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(newVal) {
        this.$store.commit("set_drawer", newVal);
      },
    },
  },
};
</script>
