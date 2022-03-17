<template>
  <v-container>
    <!-- <main class="admin-student-manage-main"> -->
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Manage Student</h2>
    <SelectSenior></SelectSenior>

    <!-- Action buttons -->
    <!-- <div class="admin-student-manage-actions"> -->
    <div class="my-5 d-flex justify-end">
      <v-btn color="success" @click="handleExports(students)">
        <v-icon>mdi-microsoft-excel</v-icon>Export to Excel
      </v-btn>
    </div>
    <!-- </div> -->

    <!-- Data table here -->
    <AdminDataTable
      :tableTitle="'Student'"
      :headers="headers"
      itemKey="User_Email"
      :items="students"
      :itemPerPage="10"
      :majors="majors"
      :yearNSemsters="yearNSemsters"
      @on-filtering="handelchangeRenderStudents"
    />
    <!-- Student table card -->
    <!-- <LongTableCard tableTitle="Student">
        <template v-slot:data> -->
    <!-- Table attributes -->
    <!-- <template v-for="attr in attrs">
            <h5 :key="attr">{{ attr }}</h5>
          </template> -->

    <!-- Table data -->
    <!-- <template v-for="student in student">
            <p :key="student.id + 1">{{ student.studentId }}</p>
            <p :key="student.id + 2">{{ student.name }}</p>
            <p :key="student.id + 3">{{ student.email }}</p>
            <p :key="student.id + 4">{{ student.semester }}</p>
            <p :key="student.id + 5">{{ student.program }}</p>
          </template>
        </template>
      </LongTableCard> -->
    <!-- </main> -->
  </v-container>
</template>

<script>
// // import LongTableCard from "@/components/admin/longTableCard";
// import AdminDataTable from "@/components/admin/adminDataTable";
import exportXLSX from "@/mixins/exportXLSX";

export default {
  mixins: [exportXLSX],
  layout: "admin",
  data: () => ({
    selectedMajor: {},
    selectedYear: null,
    selectedSemester: null,
    loading: false,
    dialog1: false,
    singleSelect: false,
    selected: [],
    headers: [
      ,
      { text: "ID", align: "center", value: "User_Identity_ID" },
      { text: "NAME", align: "center", value: "User_Name" },
      { text: "EMAIL", align: "center", value: "User_Email" },
      // { text: "SEM", align: "center", value: "Committee" },
      // { text: "STUDY PROGRAM", align: "center", value: "Committee" },
    ],
  }),

  async asyncData({ $axios }) {
    let students, majors, yearNSemsters;
    try {
      // Fetch all majors
      majors = await $axios.$get("/user/getAllMajors");

      // Fetch all years and semesters
      yearNSemsters = await $axios.$get("/date/allYearsSemester");

      // Fetch initial students
      students = await $axios.$post("/user/getAllUserWithMajor", {
        Major_ID: majors[0].Major_ID,
        Academic_Year: yearNSemsters[0].Academic_Year,
        Academic_Term: yearNSemsters[0].Academic_Term,
        User_Role: "1",
      });
    } catch (error) {
      console.log("error", error);
    }
    return { students, majors, yearNSemsters };
  },

  mounted() {
    // Set the default value
    this.selectedMajor = this.majors[0];
    this.selectedYear = this.yearNSemsters[0].Academic_Year;
    this.selectedSemester = this.yearNSemsters[0].Academic_Term;
  },

  methods: {
    async handelchangeRenderStudents(year, semester, majorId, role) {
      console.log("majorId", majorId);
      console.log("year", year);
      console.log("semester", semester);
      console.log("role", role);

      this.loading = true;
      // return;
      try {
        this.students = await this.$axios.$post("/user/getAllUserWithMajor", {
          Major_ID: majorId,
          Academic_Year: year,
          Academic_Term: semester,
          User_Role: "1",
        });
      } catch (error) {
        console.log(error);
      }

      console.log(this.students);
      this.loading = false;
    },
  },
};
</script>

<style>
.admin-student-manage-main {
  margin-block-end: 2rem;
}
.admin-student-manage-main p,
.admin-student-manage-main h5 {
  font-size: 14px;
  margin: 0;
}
.admin-student-manage-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.admin-student-manage-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}

/* Student manage actions */
.admin-student-manage-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.admin-student-manage-actions .v-select {
  margin-block-end: 23px;
}

/* Reduce the second select box's width */
.admin-student-manage-actions > div:nth-child(2n) {
  width: 10%;
}
.admin-student-manage-actions > div:first-child {
  width: 36%;
}
.admin-student-manage-actions > div:last-child {
  display: flex;
  gap: 0.5rem;
}

/* Student manage table card */
.student-manage-checkbox-container .v-input {
  margin: 0;
}

@media only screen and (max-width: 497px) {
  .admin-student-manage-actions > div:first-child {
    width: 50%;
  }
  .admin-student-manage-actions > div:nth-child(2n) {
    width: 22%;
  }
  .admin-student-manage-actions .v-select {
    margin-block-end: 0.2rem;
  }
  .admin-student-manage-actions .v-btn {
    margin-block-end: 0.5rem;
  }
}
</style>
