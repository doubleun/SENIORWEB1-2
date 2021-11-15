<template>
  <section>
    <main class="admin-semester-date-main">
      <h1>Semester Date</h1>

      <!-- Semester date card -->
      <SemesterDateCard />
    </main>
  </section>
</template>

<script>
import SemesterDateCard from "@/components/Admin/semesterDateCard";

export default {
  layout: "admin",
  components: {
    SemesterDateCard
  }
};
</script>

<style>
.admin-semester-date-main {
  margin-block-end: 2rem;
}
.admin-semester-date-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.admin-semester-date-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}
</style>
