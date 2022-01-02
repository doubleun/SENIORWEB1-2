<template>
  <v-app dark>
    <Sidebar :items="items" theme="white" />
    <div class="it-background">
      <Appbar theme="transparent" />
      <v-main>
        <v-container>
          <Nuxt />
        </v-container>
      </v-main>
    </div>
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
          icon: "mdi-arrow-left",
          title: "Back",
          to: "/Senior1/coordinator/"
        },
        {
          icon: "people_alt",
          title: "Group Info",
          to: `/Senior1/coordinator/groupInfo/${this.$route.params.groupId}`
        },
        {
          icon: "mdi-numeric-1-circle",
          title: "Progress 1",
          to: "/Senior1/coordinator/progress"
        },
        {
          icon: "mdi-numeric-2-circle",
          title: "Progress 2",
          to: "/Senior1/coordinator/progress"
        },
        {
          icon: "mdi-numeric-3-circle",
          title: "Progress 3",
          to: "/Senior1/coordinator/progress"
        },
        {
          icon: "mdi-numeric-4-circle",
          title: "Progress 4",
          to: "/Senior1/coordinator/progress"
        },
        {
          icon: "co_present",
          title: "Final Presentation",
          to: "/Senior1/coordinator/progress"
        },
        {
          icon: "text_snippet",
          title: "Final Documentation",
          to: "/Senior1/coordinator/progress"
        },
        {
          icon: "stacked_bar_chart",
          title: "Evaluation Result",
          to: "/Senior1/coordinator/evaluationResult"
        },
        {
          icon: "mdi-restore",
          title: "Re - evaluation",
          to: "/Senior1/coordinator/progress"
        }
      ]
    };
  }
};
</script>
<style scoped>
.it-background {
  background-color: #edf2f9 !important;
}
.it-background::before {
  position: absolute;
  content: "";
  background-image: url("@/static/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  height: 30rem;
  width: 100%;
}
</style>
