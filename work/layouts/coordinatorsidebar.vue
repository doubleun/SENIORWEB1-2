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
    Sidebar,
  },
  data() {
    return {
      items: [
        {
          icon: "mdi-home",
          title: "Home",
          to: "/Senior1/Coordinator/",
        },
        {
          icon: "mdi-account-cog",
          title: "User Manage",
          to: "/Senior1/Coordinator/userManage",
        },
        {
          icon: "mdi-calendar-month",
          title: "Due Date",
          to: "/Senior1/Coordinator/dueDate",
        },
        {
          icon: "mdi-file-document",
          title: "Criteria",
          to: "/Senior1/Coordinator/criteria",
        },
        {
          icon: "mdi-alpha-p-circle",
          title: "Score",
          to: "/Senior1/Coordinator/score"
        },
        {
          icon: "mdi-account-multiple-plus",
          title: "Group Request",
          to: "/Senior1/Coordinator/groupRequest",
        },
        {
          icon: "mdi-account-group",
          title: "My Advisee",
          to: "/Senior1/coordinator/myAdvisee",
        },
        {
          icon: "mdi-account-multiple",
          title: "Committee",
          to: "/Senior1/coordinator/committee",
        },
        {
          icon: "mdi-clipboard-text",
          title: "Doucment",
          to: "/Senior1/coordinator/viewAssignment",
        },
      ],
    };
  },
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
