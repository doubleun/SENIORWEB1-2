<template>
  <v-app dark>
    <MainAppbar theme="white" />
    <StudentSidebar :items="items" theme="default" />
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import GlobalAppbar from "@/components/global/Appbar";
// import Sidebar from "@/components/Student/stuSidebar";

export default {
  data() {
    return {
      items: [
        {
          id: 0,
          icon: "mdi-home",
          title: "Home",
          to: `/senior${this.$store.state.auth.currentUser.senior}/student/`,
          disabled: false,
        },
        {
          id: 0,
          icon: "people_alt",
          title: "Group",
          to: `/senior${this.$store.state.auth.currentUser.senior}/student/stuCreateGroup`,
          disabled: false,
        },
        // {
        // id: 3,
        //   icon: "topic",
        //   title: "Topic",
        //   to: "/Senior1/student/topic",
        // disabled: true
        // },
        {
          id: 0,
          icon: "forum",
          title: "Proposal",
          to: `/senior${this.$store.state.auth.currentUser.senior}/student/work/proposal`,
          disabled: !this.$store.state.group?.currentUserGroup,
        },
        {
          id: 3,
          icon: "mdi-numeric-1-circle",
          title: "Progress 1",
          to: `/senior${this.$store.state.auth.currentUser.senior}/student/work/progress-1`,
          disabled:
            !this.$store.state.group?.currentUserGroup ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 3,
        },
        {
          id: 4,
          icon: "mdi-numeric-2-circle",
          title: "Progress 2",
          to: `/senior${this.$store.state.auth.currentUser.senior}/student/work/progress-2`,
          disabled:
            !this.$store.state.group?.currentUserGroup ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 4,
        },
        {
          id: 5,
          icon: "mdi-numeric-3-circle",
          title: "Progress 3",
          to: `/senior${this.$store.state.auth.currentUser.senior}/student/work/progress-3`,
          disabled:
            !this.$store.state.group?.currentUserGroup ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 5,
        },
        {
          id: 6,
          icon: "mdi-numeric-4-circle",
          title: "Progress 4",
          to: `/senior${this.$store.state.auth.currentUser.senior}/student/work/progress-4`,
          disabled:
            !this.$store.state.group?.currentUserGroup ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 6,
        },
        {
          id: 7,
          icon: "co_present",
          title: "Final Presentation",
          to: `/senior${this.$store.state.auth.currentUser.senior}/student/work/final-presentation`,
          disabled:
            !this.$store.state.group?.currentUserGroup ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 7,
        },
        {
          id: 8,
          icon: "text_snippet",
          title: "Final Documentation",
          to: `/senior${this.$store.state.auth.currentUser.senior}/student/work/final-documentation`,
          disabled:
            !this.$store.state.group?.currentUserGroup ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 8,
        },
        {
          id: 0,
          icon: "stacked_bar_chart",
          title: "Evaluation Result",
          to: `/senior${this.$store.state.auth.currentUser.senior}/student/evaluation-results`,
          disabled:
            !this.$store.state.group?.currentUserGroup ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 9,
        },
        {
          id: 9,
          icon: "mdi-restore",
          title: "Re - evaluation",
          to: `/senior${this.$store.state.auth.currentUser.senior}/student/work/re-evaluation`,
          disabled:
            !this.$store.state.group?.currentUserGroup ||
            this.$store.state.group?.currentUserGroup?.Group_Progression < 10,
        },
      ],
    };
  },
  mounted() {
    // console.log(this.$store.state.group);
    console.log(
      "All progresses (logged from side bar): ",
      this.$store.state.group.availableProgress
    );
    console.log(
      "Current group info (logged from side bar):",
      this.$store.state.group.currentUserGroup
    );
    const availableIds = this.$store.state.group.availableProgress.map(
      (progress) => progress.Progress_ID
    );

    // Filter to get only available progresses (which comes from score criterias where 'Total' not equal to 0)
    // Includes the ones with id = 0, which means they're not depending on score criterias
    this.items = this.items.filter(
      (item) =>
        item.id === 0 ||
        availableIds.includes(item.id) ||
        // If Is_Re_Eval flag of the group is 1 it'll push item No.9 which is Re-eval menu into the array
        (item.id === 9 && this.$store.state.group.currentUserGroup.Is_Re_Eval)
    );
  },
};
</script>
<style scoped>
.v-main {
  background-color: #edf2f9 !important;
}
</style>
