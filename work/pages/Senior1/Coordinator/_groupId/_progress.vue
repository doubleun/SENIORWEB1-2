<template>
  <section>
    <main class="coordinator-progress-main">
      <h1>{{ title }} (My Advisee)</h1>

      <!-- Card (Evaluation result) -->
      <ProjectDetailCard :GroupDetail="GroupDetail" />

      <!-- Display work -->
      <DisplayWorkSection
        :progressId="progressId"
        :submittedFiles="submittedFiles"
      />
    </main>
  </section>
</template>

<script>
import ProjectDetailCard from "@/components/Global/projectDetailCard";
import DisplayWorkSection from "@/components/Global/displayWorkSection";

export default {
  layout: "coordinator",
  components: {
    ProjectDetailCard,
    DisplayWorkSection
  },
  async asyncData({ $axios, params, redirect, store }) {
    // If params is not available, redirect back to the group info page
    // TODO: these should be from the available progress, cuz each major has differnt number of progresses
    const allProgresses = [
      "progress-1",
      "progress-2",
      "progress-3",
      "progress-4",
      "final-presentation",
      "final-documentation"
    ];
    !allProgresses.includes(params.progress) &&
      redirect(`/Senior1/coordinator/${params.groupId}`);

    // Find progress id using index
    const progressId = allProgresses.findIndex(itm => itm === params.progress);

    // This regex will find the first non-word (ie. in this case a dash "-")
    const dashRegex = /[^\w]/g;

    // Fetch submitted file(s)
    // Use regex to match only 'Number' in params (ie. ignore 'group' that comes before the actual group io)
    const groupId = params.groupId.match(/(\d)/g).join("");
    const submittedFiles = await $axios.$post(
      "/assignment/getAssignmentFiles",
      {
        Group_ID: groupId,
        Progress_ID: progressId + 1
      }
    );

    // Fetch group info
    const groupRes = await $axios.$post("/group/getGroupWithID", {
      Group_ID: groupId,
      Email: store.state.auth.currentUser.email
    });
    if (groupRes.status !== 200) {
      redirect("/Senior1/coordinator/");
    }

    return {
      // Replace the dash with space and use it as title
      title: params.progress.replace(dashRegex, " "),
      // If the allProgresses index is 0 then it needs to be 8 becuase proposal is progress id 8 in database
      progressId: progressId + 1,
      submittedFiles,
      GroupDetail: {
        GroupInfo: groupRes.groupInfo[0],
        GroupMembers: groupRes.groupMembers
      }
    };
  }
};
</script>

<style>
.coordinator-progress-main {
  margin-block-end: 2rem;
}
.coordinator-progress-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
  text-transform: capitalize;
}
.coordinator-progress-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}
</style>
