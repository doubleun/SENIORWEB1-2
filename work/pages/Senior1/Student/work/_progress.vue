<template>
  <WorkSubmission
    :title="title"
    :finalDocument="title === 'final documentation'"
    :progressId="progressId"
    :submittedFiles="submittedFiles"
  />
</template>

<script>
import WorkSubmission from "@/components/Student/workSubmission";

export default {
  components: {
    WorkSubmission
  },
  async asyncData({ $axios, params, redirect, store }) {
    // If currentUserGroup is missing, fetch it first
    if (store.state.group.currentUserGroup === null)
      // Dispatch event to store current user group info
      await store.dispatch("group/storeGroupInfo");

    // If params is not available, redirect back to the home page
    // TODO: these should be from the available progress, cuz each major has differnt number of progresses
    const allProgresses = [
      "proposal",
      "progress-1",
      "progress-2",
      "progress-3",
      "progress-4",
      "final-presentation",
      "final-documentation"
    ];
    !allProgresses.includes(params.progress) && redirect("/Senior1/student/");

    // Find progress id using index
    const progressId = allProgresses.findIndex(itm => itm === params.progress);

    // This regex will find the first non-word (ie. in this case a dash "-")
    const dashRegex = /[^\w]/g;

    // Fetch submitted file(s)
    const submittedFiles = await $axios.$post(
      "/assignment/getAssignmentFiles",
      {
        Group_ID: store.state.group.currentUserGroup.Group_ID,
        Progress_ID: progressId === 0 ? 8 : progressId
      }
    );
    return {
      // Replace the dash with space and use it as title
      title: params.progress.replace(dashRegex, " "),
      // If the allProgresses index is 0 then it needs to be 8 becuase proposal is progress id 8 in database
      progressId: progressId === 0 ? 8 : progressId,
      submittedFiles
    };
  }
};
</script>

<style></style>
