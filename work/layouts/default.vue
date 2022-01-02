<template>
  <v-app dark>
    <Appbar theme="white" />
    <Sidebar :items="items" theme="default" />
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Appbar from "@/components/Global/mainAppbar";
import Sidebar from "@/components/Student/stuSidebar";

export default {
  components: {
    Appbar,
    Sidebar
  },
  data() {
    return {
      items: [
        {
          icon: "mdi-home",
          title: "Home",
          to: "/Senior1/student/"
        },
        {
          icon: "people_alt",
          title: "Group",
          to: "/Senior1/student/stuCreateGroup"
        },
        // {
        //   icon: "topic",
        //   title: "Topic",
        //   to: "/Senior1/student/topic"
        // },
        {
          icon: "forum",
          title: "Proposal",
          to: "/Senior1/student/proposal"
        },
        {
          icon: "mdi-numeric-1-circle",
          title: "Progress 1",
          to: "/Senior1/student/progress1"
        },
        {
          icon: "mdi-numeric-2-circle",
          title: "Progress 2",
          to: "/Senior1/student/progress2"
        },
        {
          icon: "mdi-numeric-3-circle",
          title: "Progress 3",
          to: "/Senior1/student/progress3"
        },
        {
          icon: "mdi-numeric-4-circle",
          title: "Progress 4",
          to: "/Senior1/student/progress4"
        },
        {
          icon: "co_present",
          title: "Final Presentation",
          to: "/Senior1/student/final-presentation"
        },
        {
          icon: "text_snippet",
          title: "Final Documentation",
          to: "/Senior1/student/final-document"
        },
        {
          icon: "stacked_bar_chart",
          title: "Evaluation Result",
          to: "/Senior1/student/evaluation-results"
        },
        {
          icon: "mdi-restore",
          title: "Re - evaluation",
          to: "/Senior1/student/stuReEvaluation"
        }
      ]
    };
  }
};
</script>
<style scoped>
.v-main {
  background-color: #edf2f9 !important;
}
</style>
