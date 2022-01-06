<template>
  <div>
    <h2 class="header-title mb-2 mt-5">Home</h2>
    <v-divider></v-divider>
    <v-card class="content mt-5">
      <v-alert color="indigo lighten-5">
        <h3 class="font-weight-bold">Your Progress</h3>
      </v-alert>
      <div class="stepper">
        <v-stepper alt-labels class="elevation-0" v-model="currentProgress">
          <v-stepper-header>
            <template v-for="(steps, index) in availableSteps">
              <v-stepper-step
                :step="index + 1"
                :complete="currentProgress >= steps.progressPass"
                :key="steps.progressPass + 1"
              >
                {{ steps.progressName }}
              </v-stepper-step>
              <v-divider
                :key="steps.progressPass + 2"
                v-if="index !== availableSteps.length - 1"
              ></v-divider>
            </template>

            <!-- <v-stepper-step step="1"> Group </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="2"> Proposal </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3"> Progress 1 </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="4"> Progress 2 </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="5"> Progress 3 </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="6"> Progress 4 </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="7"> Presentation </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="8"> Documentation </v-stepper-step> -->
          </v-stepper-header>
        </v-stepper>
      </div>
      <v-row class="stepperAnnounement text-center mt-5 mb-5">
        <v-col>
          <h2>Please create group</h2>

          <h4>Before August 20, 2021</h4>
        </v-col>
      </v-row>
    </v-card>

    <Announcement :announcements="announcements" />
    <!-- </div> -->
  </div>
</template>
<script>
import Announcement from "@/components/Coordinator/homeAnnouncement";
export default {
  components: { Announcement },
  computed: {
    // Computed current group progress for stepper
    currentProgress() {
      const progress = this.$store.state.group.currentUserGroup
        ?.Group_Progression;
      return progress >= 7 ? progress / 10 : progress;
    },
    // Computed steps that will be available
    availableSteps() {
      const groupProposal = [
        { progressPass: 0.7, progressName: "Group" },
        { progressPass: 0.8, progressName: "Proposal" }
      ];
      // TODO: Right now it's based on senior, discuss this later
      // Grap progress pass from id and progress name, where total is not = 0
      const finalAllProgress = this.allProgress.reduce(
        (arr, obj) =>
          obj.Total !== 0
            ? [
                ...arr,
                {
                  progressPass: obj.Progress_ID,
                  progressName: obj.Progress_Name
                }
              ]
            : arr,
        []
      );

      //! FIXME: This doesn't work anymore since we pulled 'senior' from 'users' table, fix this later
      // // Merge groupProposal, if senior 1 else return all progress, fetched from the database
      // return this.$store.state.auth.currentUser.senior === 1
      //   ? [...groupProposal, ...finalAllProgress]
      //   : finalAllProgress;

      return [...groupProposal, ...finalAllProgress];
    }
  },
  async asyncData({ $axios, store }) {
    let announcements, allProgress;
    try {
      // Fetch announcements in current user's major
      announcements = await $axios.$post("/announc/major", {
        MajorID: store.state.auth.currentUser.major
      });

      // Fetch all available progress(es) in this major
      allProgress = await $axios.$post("/criteria/scoreMajor", {
        Major_ID: store.state.auth.currentUser.major
      });
      // console.log("All progress: ", allProgress);
    } catch (err) {
      console.log(err);
    }
    // Dispatch event to store current user group info
    await store.dispatch("group/storeGroupInfo");
    return { announcements, allProgress };
  },
  mounted() {
    // TODO: Delete these (obviously...)
    //* === How to access current user group info state (object) === *//
    console.log("Current user's info: ", this.$store.state.auth.currentUser);
    console.log(
      "Current user's group: ",
      this.$store.state.group.currentUserGroup
    );
    // console.log("All progress: ", this.allProgress);
  }
};
</script>
<style scoped>
.content {
  padding: 20px;
}
.cardAnnouncement {
  padding: 5px;
}
</style>
