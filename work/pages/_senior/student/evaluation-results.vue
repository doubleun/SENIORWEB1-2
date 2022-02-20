<template>
  <div>
    <v-card class="co-evaluation-result-card my-12">
      <v-card-title>EVALUATION RESULT</v-card-title>
      <EvaluationResultGrid
        :Group_ID="Group_ID"
        :evalScores="fetchScoresRes"
        hideGrade
      />
    </v-card>
    <StudentEvaluationResultTable
      :totalScore="fetchScoresRes.total"
      :evalComments="evalComments"
    />
  </div>
</template>

<script>
// import EvaluationResultTable from "@/components/student/stuEvaluationResultTable";
export default {
  async asyncData({ store, $axios }) {
    // If currentUserGroup is missing, fetch it first
    if (store.state.group.currentUserGroup === null)
      // Dispatch event to store current user group info
      await store.dispatch("group/storeGroupInfo");

    // Get group id from state
    const groupId = store.state.group.currentUserGroup.Group_ID;

    // Fetch evaluation scores
    const fetchScoresRes = await $axios.$post(
      "/assignment/getEvaluationScores",
      {
        Group_ID: groupId,
      }
    );
    console.log("Fetched eval scores: ", fetchScoresRes);
    // Calculate total score
    fetchScoresRes.total = Object.values(fetchScoresRes).reduce(
      (prev, current) =>
        parseFloat(prev) + (!current ? 0 : parseFloat(current)),
      0
    );

    // Fetch given evaluation comments
    const evalComments = await $axios.$post("/group/getTeachersEval", {
      Email: store.state.auth.currentUser.email,
      Group_ID: groupId,
      Single: false,
      Group_Info: false,
      reEvalComment: false,
      filterTeachersRole: false,
    });
    console.log("Student eval comments: ", evalComments);
    return {
      fetchScoresRes,
      Group_ID: groupId,
      evalComments: evalComments.eval,
    };
  },
};
</script>
