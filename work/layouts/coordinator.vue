<template>
  <v-app dark>
    <Sidebar :items="items" theme="white" />
    <div class="it-background">
      <v-main>
        <Appbar theme="transparent" />
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
          icon: "mdi-home",
          title: "Home",
          to: "/Senior1/coordinator/home"
        },
        {
          icon: "people_alt",
          title: "Group Info",
          to: "/Senior1/Coordinator/groupInfo"
        },
        {
          icon: "mdi-numeric-1-circle",
          title: "Progress 1",
          to: "/Senior1/Coordinator/progress"
        },
        {
          icon: "mdi-numeric-2-circle",
          title: "Progress 2",
          to: "/Senior1/Coordinator/progress"
        },
        {
          icon: "mdi-numeric-3-circle",
          title: "Progress 3",
          to: "/Senior1/Coordinator/progress"
        },
        {
          icon: "mdi-numeric-4-circle",
          title: "Progress 4",
          to: "/Senior1/Coordinator/progress"
        },
        {
          icon: "co_present",
          title: "Final Presentation",
          to: "/Senior1/Coordinator/progress"
        },
        {
          icon: "text_snippet",
          title: "Final Documentation",
          to: "/Senior1/Coordinator/progress"
        },
        {
          icon: "stacked_bar_chart",
          title: "Evaluation Result",
          to: "/Senior1/Coordinator/evaluationResult"
        },
        {
          icon: "mdi-restore",
          title: "Re - evaluation",
          to: "/Senior1/Coordinator/progress"
        }
      ]
    };
  }
};
</script>
<style scoped>
.it-background {
  /* background-color: #1b5cb6 !important; */
  background-image: url("@/static/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 30rem;
}
</style>
