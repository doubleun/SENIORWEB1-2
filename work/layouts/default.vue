<template>
  <v-app dark>
    <GlobalAppbar theme="white" />
    <StudentSidebar :items="items" theme="default" />
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
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
          to: "/Senior1/student/",
          disabled: false
        },
        {
          icon: "people_alt",
          title: "Group",
          to: "/Senior1/student/stuCreateGroup",
          disabled: false
        },
        // {
        //   icon: "topic",
        //   title: "Topic",
        //   to: "/Senior1/student/topic",
        // disabled: true
        // },
        {
          icon: "forum",
          title: "Proposal",
          to: "/Senior1/student/work/proposal",
          disabled: !this.$store.state.group?.currentUserGroup
        },
        {
          icon: "mdi-numeric-1-circle",
          title: "Progress 1",
          to: "/Senior1/student/work/progress-1",
          disabled:
            !this.$store.state.group?.currentUserGroup?.Group_Progression ||
            this.$store.state.group?.currentUserGroup?.Group_Progression === 7
        },
        {
          icon: "mdi-numeric-2-circle",
          title: "Progress 2",
          to: "/Senior1/student/work/progress-2",
          disabled:
            !this.$store.state.group?.currentUserGroup?.Group_Progression ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 1 ||
            this.$store.state.group?.currentUserGroup?.Group_Progression >= 7
        },
        {
          icon: "mdi-numeric-3-circle",
          title: "Progress 3",
          to: "/Senior1/student/work/progress-3",
          disabled:
            !this.$store.state.group?.currentUserGroup?.Group_Progression ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 2 ||
            this.$store.state.group?.currentUserGroup?.Group_Progression >= 7
        },
        {
          icon: "mdi-numeric-4-circle",
          title: "Progress 4",
          to: "/Senior1/student/work/progress-4",
          disabled:
            !this.$store.state.group?.currentUserGroup?.Group_Progression ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 3 ||
            this.$store.state.group?.currentUserGroup?.Group_Progression >= 7
        },
        {
          icon: "co_present",
          title: "Final Presentation",
          to: "/Senior1/student/work/final-presentation",
          disabled:
            !this.$store.state.group?.currentUserGroup?.Group_Progression ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 4 ||
            this.$store.state.group?.currentUserGroup?.Group_Progression >= 7
        },
        {
          icon: "text_snippet",
          title: "Final Documentation",
          to: "/Senior1/student/work/final-documentation",
          disabled:
            !this.$store.state.group?.currentUserGroup?.Group_Progression ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 5 ||
            this.$store.state.group?.currentUserGroup?.Group_Progression >= 7
        },
        {
          icon: "stacked_bar_chart",
          title: "Evaluation Result",
          to: "/Senior1/student/evaluation-results",
          disabled:
            !this.$store.state.group?.currentUserGroup?.Group_Progression ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 6 ||
            this.$store.state.group?.currentUserGroup?.Group_Progression >= 7
        },
        {
          icon: "mdi-restore",
          title: "Re - evaluation",
          to: "/Senior1/student/stuReevaluationForm",
          disabled: !this.$store.state.group?.currentUserGroup
            ?.Group_Progression
        }
      ]
    };
  },
  mounted() {
    console.log(this.$store.state.group);
  }
};
</script>
<style scoped>
.v-main {
  background-color: #edf2f9 !important;
}
</style>
