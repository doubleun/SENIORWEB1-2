<template>
  <section>
    <main class="coordinator-group-main">
      <h1>Group Info (My Advisee)</h1>

      <!-- First card (Evaluation result) -->
      <v-card class="co-group-eval-card">
        <v-card-title>EVALUATION RESULT</v-card-title>
        <!-- Score table -->
        <EvaluationResultGrid :Group_ID="Group_ID" />
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
import EvaluationResultGrid from "@/components/Global/evaluationResultGrid";
import GroupDetailCard from "@/components/Global/groupDetailCard";

export default {
  layout: "coordinator",
  components: {
    EvaluationResultGrid,
    GroupDetailCard
  },
  async asyncData({ params, store, redirect, $axios }) {
    // Use regex to match only 'Number' in params (ie. ignore 'group' that comes before the actual group io)
    const groupId = params.groupId.match(/(\d)/g).join("");
    const res = await $axios.$post("/group/getGroupWithID", {
      Group_ID: groupId,
      Email: store.state.auth.currentUser.email
    });
    if (res.status !== 200) {
      redirect("/Senior1/coordinator/");
    }
    // console.log({
    //   GroupInfo: res.groupInfo[0],
    //   GroupMembers: res.groupMembers
    // });

    // Set group state, this is added in later for the layout to know current progress of each group
    store.commit("group/SET_GROUP", res.groupInfo[0]);
    return {
      Group_ID: groupId,
      GroupDetail: {
        GroupInfo: res.groupInfo[0],
        GroupMembers: res.groupMembers
      }
    };
  }
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
