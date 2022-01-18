<template>
  <v-app dark>
    <StudentSidebar :items="items" theme="white" />
    <div class="it-background">
      <MainAppbar theme="transparent" />
      <v-main>
        <v-container>
          <Nuxt />
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script>
// import Appbar from "@/components/Global/mainAppbar";
// import Sidebar from "@/components/Student/stuSidebar";

export default {
  data() {
    return {
      isCo: false,
      items: [
        {
          icon: "mdi-home",
          title: "Home",
          to: `/Senior1/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/`,
          role: 2,
        },
        {
          icon: "mdi-account-cog",
          title: "User Manage",
          to: "/Senior1/coordinator/userManage",
          role: 0,
        },
        {
          icon: "mdi-calendar-month",
          title: "Due Date",
          to: "/Senior1/coordinator/dueDate",
          role: 0,
        },
        {
          icon: "mdi-file-document",
          title: "Criteria",
          to: "/Senior1/coordinator/criteria",
          role: 0,
        },
        {
          icon: "mdi-alpha-p-circle",
          title: "Score",
          to: "/Senior1/coordinator/score",
          role: 0,
        },
        {
          icon: "mdi-account-multiple-plus",
          title: "Group Request",
          to: `/Senior1/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/groupRequest`,
          role: 2,
        },
        {
          icon: "mdi-account-group",
          title: "My Advisee",
          to: `/Senior1/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/myAdvisee`,
          role: 2,
        },
        {
          icon: "mdi-account-multiple",
          title: "Committee",
          to: `/Senior1/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/committee`,
          role: 2,
        },
        {
          icon: "mdi-clipboard-text",
          title: "Doucment",
          to: "/Senior1/coordinator/viewAssignment",
          role: 0,
        },
      ],
    };
  },
  beforeMount() {
    // User role of 2 is coordinator and 0 is teacher
    if (this.$store.state.auth.currentUser.role === 0) {
      // console.log("teacher");
      // If current user is teacher, the sidebar will only shows teacher's menus
      this.isCo = false;
      // Filter sidebar menu
      this.items = this.items.filter((item) => item.role === 2);
    } else {
      this.isCo = true;
    }
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
