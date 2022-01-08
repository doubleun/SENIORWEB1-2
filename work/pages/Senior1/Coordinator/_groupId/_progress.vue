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
        :maxScore="maxScore"
        :Assignment_ID="Assignment_ID"
        :scoreInfo="scoreInfo"
      />
    </main>
  </section>
</template>

<script>
// import ProjectDetailCard from "@/components/global/projectDetailCard";
// import DisplayWorkSection from "@/components/global/displayWorkSection";

export default {
  layout: "coordinator",
  async asyncData({ $axios, params, redirect, store }) {
    // If params is not available, redirect back to the group info page
    // TODO: these should be from the available progress, cuz each major has differnt number of progresses
    const allProgresses = [
      "proposal",
      "progress-1",
      "progress-2",
      "progress-3",
      "progress-4",
      "final-presentation",
      "final-documentation",
      "re-evaluation",
    ];
    !allProgresses.includes(params.progress) &&
      redirect(`/Senior1/coordinator/${params.groupId}`);

    // Find progress id using index
    const progressId = allProgresses.findIndex(
      (itm) => itm === params.progress
    );

    // This regex will find the first non-word (ie. in this case a dash "-")
    const dashRegex = /[^\w]/g;

    // Fetch submitted file(s)
    // Use regex to match only 'Number' in params (ie. ignore 'group' that comes before the actual group io)
    const groupId = params.groupId.match(/(\d)/g).join("");
    const submittedFiles = await $axios.$post(
      "/assignment/getAssignmentFiles",
      {
        Group_ID: groupId,
        Progress_ID: progressId + 2,
      }
    );

    // Fetch group info
    const groupRes = await $axios.$post("/group/getGroupWithID", {
      Group_ID: groupId,
      Email: store.state.auth.currentUser.email,
    });
    if (groupRes.status !== 200) {
      redirect("/Senior1/coordinator/");
    }

    let maxScore = { score: 0, Assignment_ID: 0 };
    // If progress id is 0 then we can't get max score (since progress id 2 is proposal)
    // Then instead of fetching max score, we fetch only assignment id
    if (progressId === 0) {
      maxScore.Assignment_ID = await $axios.$post("/criteria/getAssignmentId", {
        Progress_ID: progressId + 2,
        Group_ID: groupId,
      });
    } else {
      // Fetch score criteria for setting the max score this user can give
      maxScore = await $axios.$post("/criteria/getProgressMaxScore", {
        Group_Role: groupRes.groupInfo[0].Current_Member_Role,
        Progress_ID: progressId + 2,
        Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
      });
    }

    // Set group state, this is added in later for the layout to know current progress of each group
    // Check if the group state is already set, if not commit again
    if (!store.state.group.currentUserGroup)
      store.commit("group/SET_GROUP", groupRes.groupInfo[0]);

    // Fetch score to check if this user alrady given a score
    const scoreInfo = await $axios.$post(
      "/assignment/getTeacherProgressScore",
      {
        Group_Member_ID: groupRes.groupInfo[0].Current_Member_ID,
        Assignment_ID: maxScore.Assignment_ID,
      }
    );

    // console.log("groupState: ", store.state.group.currentUserGroup);
    // console.log("groupState: ", store.state.auth.currentUser);
    return {
      // Replace the dash with space and use it as title
      title: params.progress.replace(dashRegex, " "),
      // If the allProgresses index is 0 then it needs to be 8 becuase proposal is progress id 8 in database
      progressId: progressId + 2,
      submittedFiles,
      maxScore: maxScore.score,
      Assignment_ID: maxScore.Assignment_ID,
      GroupDetail: {
        GroupInfo: groupRes.groupInfo[0],
        GroupMembers: groupRes.groupMembers,
      },
      scoreInfo,
    };
  },
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
