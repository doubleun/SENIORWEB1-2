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
          id: 0,
          icon: "mdi-arrow-left",
          title: "Back",
          to: `/senior${this.$store.state.auth.currentUser.senior}/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/`,
        },
        {
          id: 0,
          icon: "people_alt",
          title: "Group Info",
          to: `/senior${this.$store.state.auth.currentUser.senior}/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/${this.$route.params.groupId}`,
        },
        {
          id: 2,
          icon: "mdi-file-send",
          title: "Proposal",
          to: `/senior${this.$store.state.auth.currentUser.senior}/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/${this.$route.params.groupId}/proposal`,
        },
        {
          id: 3,
          icon: "mdi-numeric-1-circle",
          title: "Progress 1",
          to: `/senior${this.$store.state.auth.currentUser.senior}/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/${this.$route.params.groupId}/progress-1`,
        },
        {
          id: 4,
          icon: "mdi-numeric-2-circle",
          title: "Progress 2",
          to: `/senior${this.$store.state.auth.currentUser.senior}/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/${this.$route.params.groupId}/progress-2`,
        },
        {
          id: 5,
          icon: "mdi-numeric-3-circle",
          title: "Progress 3",
          to: `/senior${this.$store.state.auth.currentUser.senior}/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/${this.$route.params.groupId}/progress-3`,
        },
        {
          id: 6,
          icon: "mdi-numeric-4-circle",
          title: "Progress 4",
          to: `/senior${this.$store.state.auth.currentUser.senior}/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/${this.$route.params.groupId}/progress-4`,
        },
        {
          id: 7,
          icon: "co_present",
          title: "Final Presentation",
          to: `/senior${this.$store.state.auth.currentUser.senior}/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/${this.$route.params.groupId}/final-presentation`,
        },
        {
          id: 8,
          icon: "text_snippet",
          title: "Final Documentation",
          to: `/senior${this.$store.state.auth.currentUser.senior}/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/${this.$route.params.groupId}/final-documentation`,
        },
        {
          id: 0,
          icon: "stacked_bar_chart",
          title: "Evaluation Result",
          to: `/senior${this.$store.state.auth.currentUser.senior}/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/${this.$route.params.groupId}/evaluationResult`,
        },
        {
          id: 9,
          icon: "mdi-restore",
          title: "Re - evaluation",
          to: `/senior${this.$store.state.auth.currentUser.senior}/${
            this.$store.state.auth.currentUser.role === 2
              ? "coordinator"
              : "teacher"
          }/${this.$route.params.groupId}/re-evaluation`,
        },
      ],
    };
  },
  mounted() {
    // console.log(this.$store.state.group);
    console.log(
      "All progresses (logged from coordinator side bar): ",
      this.$store.state.group.availableProgress
    );
    console.log(
      "Current group info (logged from coordinator side bar):",
      this.$store.getters["group/currentUserGroup"]
    );
    // // If no group redirect to index to fetch group
    // if (!this.$store.state.group.currentUserGroup)
    //   return this.$router.push(
    //     `/senior${this.$store.state.auth.currentUser.senior}/${
    //       this.$store.state.auth.currentUser.role === 2
    //         ? "coordinator"
    //         : "teacher"
    //     }/${this.$route.params.groupId}`
    //   );
    const availableIds = this.$store.state.group.availableProgress.map(
      (progress) => progress.Progress_ID
    );

    const userGroup = this.$store.getters["group/currentUserGroup"];

    this.items = this.items.filter(
      (item) =>
        item.id === 0 ||
        availableIds.includes(item.id) ||
        // If Is_Re_Eval flag of the group is 1 it'll push item No.9 which is Re-eval menu into the array
        (item.id === 9 && userGroup
          ? this.$store.getters["group/currentUserGroup"].Is_Re_Eval
          : 0)
    );
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
