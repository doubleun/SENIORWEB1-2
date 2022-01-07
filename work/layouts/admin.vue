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
      items: [
        {
          icon: "mdi-home",
          title: "Home",
          to: "/senior1/admin/",
        },
        {
          icon: "mdi-account-group",
          title: "Group",
          to: "/senior1/admin/group",
        },
        {
          icon: "mdi-account-cog",
          title: "Manage Student",
          to: "/senior1/admin/student",
        },
        {
          icon: "mdi-office-building-cog",
          title: "Manage Teacher",
          to: "/senior1/admin/teacher",
        },
        {
          icon: "mdi-clipboard-check-multiple",
          title: "Criteria",
          to: "/senior1/admin/criteria",
        },
        {
          icon: "mdi-clipboard-text-clock",
          title: "Semester Date",
          to: "/senior1/admin/semesterDate",
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
