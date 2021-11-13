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
          icon: "mdi-account-multiple-plus",
          title: "Group Request",
          to: "/Senior1/Coordinator/groupRequest"
        },
        {
          icon: "mdi-account-multiple",
          title: "Committee",
          to: "/Senior1/coordinator/committee"
        },
        {
          icon: "mdi-account-group",
          title: "My Advisee",
          to: "/Senior1/coordinator/myAdvisee"
        },
        {
          icon: "mdi-account-cog",
          title: "Use Manage",
          to: "/Senior1/Coordinator/"
        },
        {
          icon: "mdi-alpha-p-circle",
          title: "Score",
          to: "/Senior1/Coordinator/"
        },
        {
          icon: "mdi-calendar-month",
          title: "Due Date",
          to: "/Senior1/Coordinator/"
        },
        {
          icon: "mdi-file-document",
          title: "Criteria",
          to: "/Senior1/Coordinator/"
        },
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
