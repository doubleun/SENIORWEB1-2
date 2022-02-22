<template>
  <section>
    <main class="coordinator-group-main">
      <h1>Group Info ({{ groupAdvisor ? "My Advisee" : "Committee" }})</h1>

      <!-- First card (Evaluation result) -->
      <v-card class="co-group-eval-card">
        <v-card-title>EVALUATION RESULT</v-card-title>
        <!-- Score table -->
        <EvaluationResultGrid
          :Group_ID="Group_ID"
          :evalScores="fetchScoresRes"
        />
      </v-card>

      <!-- Second card (Group detail) -->
      <GroupDetailCard
        style="margin-block-start: 4.2rem"
        :GroupDetail="GroupDetail"
      />
    </main>
  </section>
</template>

<script>
// import EvaluationResultGrid from "@/components/global/evaluationResultGrid";
// import GroupDetailCard from "@/components/global/groupDetailCard";

export default {
  layout: "coordinator",
  async asyncData({ params, store, redirect, $axios }) {
    try {
      // Use regex to match only 'Number' in params (ie. ignore 'group' that comes before the actual group id)
      const groupId = params.groupId.match(/(\d)/g).join("");
      const res = await $axios.$post("/group/getGroupWithID", {
        Group_ID: groupId,
        Email: store.state.auth.currentUser.email,
        Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
      });

      console.log("SET GROUP: ", res.groupInfo[0]);

      // Set group state, this is added in later for the layout to know current progress of each group
      // TODO: Not needed anymore ??
      store.commit("group/SET_GROUP", res.groupInfo[0]);

      // Set available group progressions based on group major
      store.dispatch("group/storeAvailableProgressions");

      // Fetch available grade criterias
      // Fetch grade from grade criterias
      const gradeCriterias = await $axios.$post("/criteria/gradeMajor", {
        Major_ID: res.groupInfo[0].Major,
      });
      console.log("Eval grade criterias: ", gradeCriterias);

      // If grade criteria has not been set, redirect user back
      if (gradeCriterias.length === 0) {
        return redirect("/senior1/coordinator/");
      }

      // Fetch evaluation scores
      const fetchScoresRes = await $axios.$post(
        "/assignment/getEvaluationScores",
        {
          Group_ID: groupId,
        }
      );
      console.log("Fetched eval scores: ", fetchScoresRes);
      // If there are score (in any progress from 1 - final) then calculate the total score, and suggested grade
      if (!!fetchScoresRes && fetchScoresRes.length !== 0) {
        // Calculate total score
        fetchScoresRes.total = Object.values(fetchScoresRes).reduce(
          (prev, current) =>
            parseFloat(prev) + (!current ? 0 : parseFloat(current)),
          0
        );

        // Calculate sugesstion grade
        const suggestGrade = gradeCriterias.find(
          (criteria) => fetchScoresRes.total >= criteria.Grade_Criteria_Pass
        );
        console.log("Suggest grade: ", suggestGrade);

        // Add to fetchScoresRes
        fetchScoresRes.suggestGrade = suggestGrade.Grade_Criteria_Name;

        // Add normal grade to fetchScoreRes
        console.log(res.groupInfo[0]);
        fetchScoresRes.normalGrade = res.groupInfo[0].Grade;
      }

      let groupAdvisor =
        res.groupInfo[0].Current_Member_Role === 0 ? true : false;
      console.log("Is group advisor: ", groupAdvisor);

      return {
        Group_ID: groupId,
        GroupDetail: {
          GroupInfo: res.groupInfo[0],
          GroupMembers: res.groupMembers,
        },
        groupAdvisor,
        // If there are no score yet, fetchScoreRes will be undefined, so this'll return an empty object instead
        fetchScoresRes: !!fetchScoresRes ? fetchScoresRes : {},
      };
    } catch (error) {
      console.log(error);
      return redirect("/Senior1/coordinator/");
    }
  },
};
</script>

<style>
.coordinator-group-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.coordinator-group-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}
.co-group-eval-card .v-card__title {
  padding: 1rem 3rem 0;
}
</style>
