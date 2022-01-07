<template>
  <section>
    <main>
      <div class="admin-semester-date-main">
        <h1>Semester Date</h1>

        <!-- New academic year -->
        <v-btn color="blue darken-4" dark @click="handleNewAcademicYear">
          New academic year
        </v-btn>
      </div>

      <!-- Semester date card -->
      <AdminSemesterDateCard :academicYear="academicYear" />
    </main>
  </section>
</template>

<script>
// import SemesterDateCard from "@/components/admin/semesterDateCard";

export default {
  layout: "admin",
  methods: {
    async handleNewAcademicYear() {
      if (this.academicYear === null || this.academicYear === undefined) return;
      if (confirm("Add new academic year will stop all on-going progresses")) {
        try {
          const res = await this.$axios.$post("/date/academic/new", {
            year: this.academicYear + 1
          });

          // console.log(res);
          // Update the UI
          this.academicYear = this.academicYear + 1;
        } catch (err) {
          console.log(err);
        }
      }
    }
  },
  async asyncData({ $axios }) {
    let data;
    try {
      data = await $axios.$get("/date/academic/get");
      if (data.length === 0) data = "xxxx";
    } catch (err) {
      console.log(err);
    }
    // console.log(data);
    return {
      academicYear: parseInt(data[0].Academic_Year)
    };
  }
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
