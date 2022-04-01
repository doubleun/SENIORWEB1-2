<template>
  <v-container>
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">User Manage</h2>

    <div class="my-5 d-flex justify-end">
      <v-btn
        class="mr-2 dark-blue--text"
        align="right"
        justify="right"
        color="primary"
        @click="handleFileImport"
      >
        <v-icon dark-blue> mdi-application-import </v-icon>
        Import
      </v-btn>
      <input
        ref="uploader"
        class="d-none"
        id="fileBrowse"
        type="file"
        accept=".xlsx"
        @change="handleBrowseFile"
      />
      <v-btn
        class="dark-blue--text"
        align="right"
        justify="right"
        color="primary"
        @click="downloadtemplete"
      >
        <v-icon dark-blue> mdi-application-import </v-icon>
        dowload templete
      </v-btn>
    </div>

    <!-- Data table here -->
    <AdminDataTable
      :tableTitle="'Student'"
      :headers="headers"
      itemKey="User_Email"
      :items="students"
      :itemPerPage="10"
      :yearNSemsters="yearNSemsters"
      :filterFromState="false"
      @on-filtering="handelchangeRenderStudents"
    />
  </v-container>
</template>
<script>
// import AdminDataTable from "@/components/admin/adminDataTable";

// import UserDataTable from "@/components/coordinator/userDataTable";
export default {
  data: () => ({
    sem: ["1/2564", "2/2564"],
    files: [],
    selectedMajor: {},
    selectedYear: null,
    selectedSemester: null,
    loading: false,
    dialog1: false,
    singleSelect: false,
    selected: [],
    headers: [
      { text: "ID", align: "center", value: "User_Identity_ID" },
      { text: "NAME", align: "center", value: "User_Name" },
      { text: "EMAIL", align: "center", value: "User_Email" },
    ],
  }),
  async asyncData({ app, $axios, store }) {
    let students, yearNSemsters;

    console.log(store.getters["group/availableProgress"]);
    try {
      // First check if atleast criteria is set
      if (
        !store.getters["group/availableProgress"] ||
        store.getters["group/availableProgress"]?.length === 0
      ) {
        app.$swal.fire(
          "No score criterias available",
          "You need to enable atleast one score criteria",
          "warning"
        );
        // if no score criteria yet, take user back to prev page
        return app.router.push(-1);
      }

      // Fetch all years and semesters
      yearNSemsters = await $axios.$get("/date/allYearsSemester");

      // Fetch initial students
      students = await $axios.$post("/user/getAllUserWithMajor", {
        Major_ID: store.state.auth.currentUser.major,
        Academic_Year: yearNSemsters[0].Academic_Year,
        Academic_Term: yearNSemsters[0].Academic_Term,
        User_Role: "1",
      });
    } catch (error) {
      console.log("error", error);
    }

    return { students, yearNSemsters };
  },
  mounted() {
    // Set the default value
    this.selectedYear = this.yearNSemsters[0].Academic_Year;
    this.selectedSemester = this.yearNSemsters[0].Academic_Term;
  },
  methods: {
    handleFileImport() {
      window.addEventListener("focus", () => {}, { once: true });
      // Trigger click on the FileInput
      this.$refs.uploader.click();
    },
    downloadtemplete() {
      window.location.href =
        "/api/public_senior/templete/studentsTemplete.xlsx";
    },
    handleBrowseFile(e) {
      if (e?.target.files[0]) {
        // Get date
        const d = new Date().toLocaleString();
        const formData = new FormData();

        // Update the files array
        this.files = [...this.files, { file: e.target.files[0], date: d }];
        this.files.map((file) => formData.append("files", file.file));
        formData.append("Major", this.$store.state.auth.currentUser.major);
        console.log(formData);
        this.$swal
          .fire({
            title: "Are you sure to import this file ? ",
            text: "Please make sure file is correct you can import once per semister!!!",
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: "OK",
            denyButtonText: `Cancel`,
          })
          .then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              const res = await this.$axios.$post(
                "user/importstudent",
                formData
              );
              console.log(res);
              if (!res) {
                this.$swal.fire("Error! some thing went wrong", "", "warning");
              } else {
                if (res === "success") {
                  this.$swal.fire("Saved!", "", "success");
                } else if (res === "someproblem") {
                  this.$swal.fire(
                    "Success",
                    "Success with condition some field are not inserted",
                    "warning"
                  );
                } else {
                  this.$swal.fire(
                    "Error! some thing went wrong",
                    "User will not inserted",
                    "warning"
                  );
                }
              }
            }
          });
      }
    },
    async handelchangeRenderStudents(year, semester) {
      this.loading = true;
      try {
        this.students = await this.$axios.$post("/user/getAllUserWithMajor", {
          Major_ID: this.$store.state.auth.currentUser.major,
          Academic_Year: year,
          Academic_Term: semester,
          Senior: this.$store.state.auth.currentUser.senior,
          User_Role: "1",
        });
      } catch (error) {
        console.log(error);
      }

      console.log("this.students", this.students);
      this.loading = false;
    },
  },
  layout: "coordinatorsidebar",
};
</script>

<style scoped>
.v-btn:hover {
  background-color: #1a237e; /* blue */
  color: white;
}
.btsem {
  padding-left: 70%;
}
</style>
