<template>
  <section>
    <main class="admin-student-manage-main">
      <h1>Manage Student</h1>

      <!-- Action buttons -->
      <div class="admin-student-manage-actions">
        <div>
          <p class="white--text">Study Program</p>
          <v-select
            v-model="selectedMajor"
            :items="majors"
            @change="handelchangeRenderStudents"
            item-text="Major_Name"
            item-value="Major_ID"
            return-object
            dense
            solo
            hide-details
            off
          />
        </div>
        <div>
          <p class="white--text">Year</p>
          <v-select
            v-model="selectedYear"
            :items="yearNSemsters.map(itm => itm.Academic_Year)"
            @change="handelchangeRenderStudents"
            dense
            solo
            hide-details
          />
        </div>
        <div>
          <p class="white--text">Semester</p>
          <v-select
            v-model="selectedSemester"
            :items="yearNSemsters.map(itm => itm.Academic_Term)"
            @change="handelchangeRenderStudents"
            dense
            solo
            hide-details
          />
        </div>
        <div>
          <v-btn color="light"
            ><v-icon>mdi-database-import</v-icon> Import</v-btn
          >
        </div>
      </div>

      <!-- Data table here -->
      <AdminSemesterDate
        :tableTitle="'Manage Students'"
        :headers="headers"
        itemKey="User_Email"
        :items="students"
        :itemPerPage="10"
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
    </main>
  </section>
</template>

<script>
// import LongTableCard from "@/components/Admin/longTableCard";
import AdminSemesterDate from "@/components/Admin/adminDataTable";

export default {
  layout: "admin",
  components: {
    AdminSemesterDate
  },
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
      { text: "EMAIL", align: "center", value: "User_Email" }
      // { text: "SEM", align: "center", value: "Committee" },
      // { text: "STUDY PROGRAM", align: "center", value: "Committee" },
    ]
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
        User_Role: "1"
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
    async handelchangeRenderStudents() {
      this.loading = true;
      try {
        this.students = await this.$axios.$post("/user/getAllUserWithMajor", {
          Major_ID: this.selectedMajor.Major_ID,
          Academic_Year: this.selectedYear,
          Academic_Term: this.selectedSemester,
          User_Role: "1"
        });
      } catch (error) {
        console.log(error);
      }

      console.log(this.students);
      this.loading = false;
    }
  }
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
