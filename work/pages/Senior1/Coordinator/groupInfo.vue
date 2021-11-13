<template>
  <section>
    <main class="coordinator-group-main">
      <h1>Group Info (My Advisee)</h1>

      <!-- First card (Evaluation result) -->
      <v-card class="co-group-eval-card">
        <v-card-title>EVALUATION RESULT</v-card-title>
        <!-- Score table -->
        <EvaluationResultGrid />
      </v-card>

      <!-- Second card (Group detail) -->
      <GroupDetailCard style="margin-block-start: 4.2rem" />
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
