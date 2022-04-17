<template>
  <v-container>
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Semester Date</h2>

    <!-- Semester date card -->
    <AdminSemesterDateCard />
  </v-container>
</template>

<script>
// import SemesterDateCard from "@/components/admin/semesterDateCard";

export default {
  layout: "admin",
  methods: {},
};
</script>

<style>
.admin-semester-date-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
