<template>
  <section>
    <main class="coordinator-progress-main">
      <h1>Progress (My Advisee)</h1>

      <!-- Card (Evaluation result) -->
      <ProjectDetailCard />

      <!-- Display work -->
      <DisplayWorkSection />
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
}
.coordinator-progress-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}
</style>
