<template>
  <v-navigation-drawer fixed app color="#253B6E" dark width="310">
    <v-col class="mt-3">
      <v-row class="justify-center">
        <!-- Logo and website name -->
        <router-link to="/">
          <v-img src="/it_logo.png" max-width="80" class="mb-3"></v-img>
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
          to: "/"
        },
        {
          icon: "people_alt",
          title: "Group",
          to: "/Senior1/Student/stuCreateGroup"
        },
        {
          icon: "topic",
          title: "Topic",
          to: "/Senior1/Student/topic"
        },
        {
          icon: "forum",
          title: "Proposal",
          to: "/Senior1/Student/proposal"
        },
        {
          icon: "mdi-numeric-1-circle",
          title: "Progress 1",
          to: "/Senior1/Student/progress1"
        },
        {
          icon: "mdi-numeric-2-circle",
          title: "Progress 2",
          to: "/Senior1/Student/progress2"
        },
        {
          icon: "mdi-numeric-3-circle",
          title: "Progress 3",
          to: "/Senior1/Student/progress3"
        },
        {
          icon: "mdi-numeric-4-circle",
          title: "Progress 4",
          to: "/Senior1/Student/progress4"
        },
        {
          icon: "co_present",
          title: "Final Presentation",
          to: "/Senior1/Student/final-presentation"
        },
        {
          icon: "text_snippet",
          title: "Final Documentation",
          to: "/Senior1/Student/final-document"
        },
        {
          icon: "stacked_bar_chart",
          title: "Evaluation Result",
          to: "/Senior1/Student/evaluation-results"
        },
        {
          icon: "mdi-restore",
          title: "Re - evaluation",
          to: "/Senior1/Student/stuReEvaluation"
        }
      ]
    };
  }
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
.v-item--active {
  padding: 0 16px 0 12px !important;
  border-left: 1px solid #72cef7;
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
