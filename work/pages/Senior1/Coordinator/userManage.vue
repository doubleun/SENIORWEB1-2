<template>
  <div>
    <v-container>
      <h2 class="header-title mb-2 mt-5 mb-10 white--text">User Manage</h2>
      <v-row>
        <!-- <v-col > -->
        <div class="login">
          <!-- <v-row> -->
          <v-btn
            class="mb-1 mt-7 mb-1 ma-2 dark-blue--text"
            align="right"
            justify="right"
            @click="handleFileImport"
          >
            <v-icon dark-blue>
              mdi-application-import
            </v-icon>

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
          <!-- </v-row> -->
        </div>
        <!-- </v-col> -->
      </v-row>
      <v-row class="btsem">
        <v-col cols="6" sm="6" md="6" lg="6">
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
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6">
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
        </v-col>
      </v-row>
      <br />
      <!-- Data table here -->
      <AdminDataTable
        :tableTitle="'Manage Students'"
        :headers="headers"
        itemKey="User_Email"
        :items="students"
        :itemPerPage="10"
      />
    </v-container>
  </div>
</template>
<script>
import AdminDataTable from "@/components/Admin/adminDataTable";

import userDataTable from "@/components/Coordinator/userDataTable";
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
      { text: "EMAIL", align: "center", value: "User_Email" }
    ]
  }),
  components: {
    userDataTable,
    AdminDataTable
  },
  async asyncData({ $axios, store }) {
    let students, yearNSemsters;

    try {
      // Fetch all years and semesters
      yearNSemsters = await $axios.$get("/date/allYearsSemester");

      // Fetch initial students
      students = await $axios.$post("/user/getAllUserWithMajor", {
        Major_ID: store.state.auth.currentUser.major,
        Academic_Year: yearNSemsters[0].Academic_Year,
        Academic_Term: yearNSemsters[0].Academic_Term,
        User_Role: "1"
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
    handleBrowseFile(e) {
      if (e?.target.files[0]) {
        // Get date
        const d = new Date().toLocaleString();
        const formData = new FormData();

        // Update the files array
        this.files = [...this.files, { file: e.target.files[0], date: d }];
        this.files.map(file => formData.append("files", file.file));
        formData.append("Major", 1);
        console.log(formData);
        this.$swal
          .fire({
            title: "Are you sure to import this file ? ",
            text:
              "Please make sure file is correct you can import once per semister!!!",
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: "OK",
            denyButtonText: `Cancel`
          })
          .then(async result => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              const res = await this.$axios.$post(
                "user/importstudent",
                formData
              );
              console.log(res);
              if (res === "success") {
                this.$swal.fire("Saved!", "", "success");
              } else {
                this.$swal.fire("Error! some thing went wrong", "", "warning");
              }
            }
          });
      }
    },
    async handelchangeRenderStudents() {
      this.loading = true;
      try {
        this.students = await this.$axios.$post("/user/getAllUserWithMajor", {
          Major_ID: this.$store.state.auth.currentUser.major,
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
  },
  layout: "coordinatorsidebar"
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
