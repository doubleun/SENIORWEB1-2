<template>
  <div>
    <StudentEvaluationResultTable showTable />
  </div>
</template>

<script>
// import EvaluationResultTable from "@/components/student/stuEvaluationResultTable";
export default {
  async asyncData({ store }) {
    // If currentUserGroup is missing, fetch it first
    if (store.state.group.currentUserGroup === null)
      // Dispatch event to store current user group info
      await store.dispatch("group/storeGroupInfo");
  }
};
</script>
