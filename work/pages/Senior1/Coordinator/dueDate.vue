<template>
  <section>
    <main class="coordinator-due-date-main">
      <h1>Due Date</h1>

      <!-- Assignment date card -->
      <DueAssignmentCard />
    </main>
  </section>
</template>

<script>
import DueAssignmentCard from "@/components/Coordinator/dueAssignmentCard";

export default {
  layout: "coordinatorsidebar",
  components: {
    DueAssignmentCard
  }
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
