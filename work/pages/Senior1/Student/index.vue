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
            <template v-for="(step, index) in availableSteps">
              <v-stepper-step
                :step="step.Progress_ID"
                :complete="currentProgress > step.Progress_ID"
                :key="step.Score_criteria_ID"
              >
                {{ step.Progress_Name }}
              </v-stepper-step>
              <v-divider
                :key="step.Score_criteria_ID"
                v-if="index !== availableSteps.length - 1"
              ></v-divider>
            </template>
          </v-stepper-header>
        </v-stepper>
      </div>
      <v-row class="stepperAnnounement text-center mt-5 mb-5">
        <v-col>
          <h2>{{ dueProgressStrings[0] }}</h2>

          <h4>{{ dueProgressStrings[1] }}</h4>
        </v-col>
      </v-row>
    </v-card>

    <CoordinatorHomeAnnouncement :announcements="announcements" />
    <!-- </div> -->
  </div>
</template>
<script>
// import Announcement from "@/components/coordinator/homeAnnouncement";
export default {
  computed: {
    // Computed current group progress for stepper
    currentProgress() {
      return this.$store.state.group.currentUserGroup?.Group_Progression;
    },
    dueProgressStrings() {
      console.log("this.dueProgress: ", this.dueProgress);
      let str = [];
      if (!!this.dueProgress) {
        // Construct end date as string
        const endDateString = new Date(
          this.dueProgress.DueDate_End
        ).toLocaleString("en-US", {
          dateStyle: "full",
        });
        console.log("endDateString: ", endDateString);

        // Construct the rest of the string
        switch (this.dueProgress.Progress_ID) {
          case 1:
            str.push("Please, create a group");
            str.push(`Before: ${endDateString}`);
            break;
          case 2:
            str.push("Please, submit proposal");
            str.push(`Before: ${endDateString}`);
            break;
          case 3:
          case 4:
          case 5:
          case 6:
            str.push(
              `Please, submit progress ${this.dueProgress.Progress_ID - 2}`
            );
            str.push(`Before: ${endDateString}`);
            break;
          case 7:
            str.push(`Please, submit final presentation`);
            str.push(`Before: ${endDateString}`);
            break;
          case 8:
            str.push(`Please, submit final documentation`);
            str.push(`Before: ${endDateString}`);
            break;
        }
      }
      return str;
    },
  },

  async asyncData({ $axios, store }) {
    let announcements;
    try {
      // Fetch announcements in current user's major
      announcements = await $axios.$post("/announc/major", {
        MajorID: store.state.auth.currentUser.major,
      });
    } catch (err) {
      console.log(err);
    }

    // Dispatch event to store current user group info
    await store.dispatch("group/storeGroupInfo");

    // Add group and proposal to the availableSteps if senior is 1
    // TODO: This should be check from a flag in 'users' table (like showGroupProposal: true/false)
    const availableSteps = [
      { Progress_ID: 1, Progress_Name: "Group" },
      { Progress_ID: 2, Progress_Name: "Proposal" },
      ...store.state.group.availableProgress,
    ];
    console.log("availableSteps", availableSteps);

    // Fetch due dates
    const dueDates = await $axios.$post("/date/progression", {
      Major_ID: store.state.auth.currentUser.major,
      Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
    });
    // console.log("dueDates", dueDates.progressionDuedate);

    // Get the progress due date of the current group progress from dueDates.progressionDuedate
    const dueProgress = dueDates.progressionDuedate.find(
      (progress) =>
        progress.Progress_ID ===
        store.state.group.currentUserGroup.Group_Progression
    );

    console.log(dueProgress);

    return {
      announcements,
      availableSteps,
      dueProgress,
    };
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
  },
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
