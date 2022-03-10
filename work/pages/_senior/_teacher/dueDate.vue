<template>
  <v-container>
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Due Date</h2>
    <!-- Assignment date card -->
    <CoordinatorDueAssignmentCard />
  </v-container>
</template>

<script>
// import DueAssignmentCard from "@/components/coordinator/dueAssignmentCard";

export default {
  layout: "coordinatorsidebar",
  // async asyncData({ $axios, store }) {
  //   const duedate = await $axios.$post("/date/progression", {
  //     Senior: store.state.auth.currentUser.senior,
  //     Major_ID: store.state.auth.currentUser.major,
  //     Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
  //   });
  //   console.log(duedate);
  //   return { duedate };
  // },
};
</script>

<style>
.coordinator-due-date-main {
  margin-block-end: 2rem;
}
.coordinator-due-date-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.coordinator-due-date-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}
</style>
