<template>
  <div>
    <h2 class="header-title mb-2 mt-5">Home</h2>
    <v-divider></v-divider>
    <v-card class="content mt-5">
      <v-alert color="indigo lighten-5">
        <h3 class="font-weight-bold">Your Progress</h3>
      </v-alert>
      <div class="stepper">
        <v-stepper alt-labels class="elevation-0">
          <v-stepper-header>
            <v-stepper-step step="1"> Group </v-stepper-step>

            <v-divider></v-divider>

            <!-- <v-stepper-step step="2"> Topic </v-stepper-step>
            <v-divider></v-divider> -->

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

            <v-stepper-step step="8"> Documentation </v-stepper-step>
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
  data() {
    return {
      page: 1,
      info: [
        {
          title:
            "Announcement Progress 2 of Computer Science and Innovation has been postponed until October 31, 2021.",

          date: "13-9-2021"
        },
        {
          title:
            "Announcement from the School of Information Technology Regarding the delivery schedule for every project By all disciplines affiliated with the office, all legs postpone the promotion until October 11, 2021.",

          date: "16-9-102021"
        },
        {
          title:
            "Announcement from the School of Information Technology Regarding server shutdown for system maintenance on October 1, 2021",

          date: "18-9-2021"
        }
      ]
    };
  },
  async asyncData({ $axios, store }) {
    let announcements;
    try {
      // Fetch announcements in current user's major
      announcements = await $axios.$post("/announc/major", {
        MajorID: store.state.auth.currentUser.major
      });
    } catch (err) {
      console.log(err);
    }
    // Dispatch event to store current user group info
    await store.dispatch("group/storeGroupInfo");
    return { announcements };
  },
  mounted() {
    //* === How to access current user group info state (object) === *//
    console.log("Current user's info: ", this.$store.state.auth.currentUser);
    console.log(
      "Current user's group: ",
      this.$store.state.group.currentUserGroup
    );
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
