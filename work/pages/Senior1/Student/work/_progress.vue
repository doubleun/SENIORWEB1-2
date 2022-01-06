<template>
  <WorkSubmission
    :title="title"
    :finalDocument="title === 'final documentation'"
    :progressId="progressId"
    :submittedFiles="submittedFiles"
    :advisor="advisor"
    :committees="committees"
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

    // Fetch teachers
    let teachers = await $axios.$post("/group/getTeachersWithGroupID", {
      Group_ID: store.state.group.currentUserGroup.Group_ID,
      Project_on_term_ID: store.state.auth.currentUser.projectOnTerm
    });

    // Create

    // Add files for teachers
    submittedFiles.forEach(file => {
      switch (file.Group_Member_ID) {
        // If file match advisor id
        case teachers.advisor.Group_Member_ID:
          teachers.advisor = {
            ...teachers.advisor,
            // Using rest syntax for spreading conditionally
            ...(teachers.advisor?.files
              ? { files: [...teachers.advisor.files, file] }
              : { files: [file] })
          };
          break;
        // If file match committee 1 id
        case teachers.committees[0].Group_Member_ID:
          teachers.committees[0] = {
            ...teachers.committees[0],
            // Using rest syntax for spreading conditionally
            ...(teachers.committees[0]?.files
              ? { files: [...teachers.committees[0].files, file] }
              : { files: [file] })
          };
          break;
        // If file match committee 2 id
        case teachers.committees[1].Group_Member_ID:
          teachers.committees[1] = {
            ...teachers.committees[1],
            // Using rest syntax for spreading conditionally
            ...(teachers.committees[1]?.files
              ? { files: [...teachers.committees[1].files, file] }
              : { files: [file] })
          };
          break;
      }
    });

    // console.log(teachers);

    return {
      // Replace the dash with space and use it as title
      title: params.progress.replace(dashRegex, " "),
      // If the allProgresses index is 0 then it needs to be 8 becuase proposal is progress id 8 in database
      progressId: progressId === 0 ? 8 : progressId,
      submittedFiles,
      advisor: teachers.advisor,
      committees: teachers.committees
    };
  }
};
</script>

<style></style>
