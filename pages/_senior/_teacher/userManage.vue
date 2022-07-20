<template>
  <v-container>
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">User Manage</h2>

    <div class="my-5 d-flex justify-end">
      <v-btn
        class="mr-2 dark-blue--text"
        align="right"
        justify="right"
        color="primary"
        @click="handleBrowseFile"
        :loading="isSelectingFile"
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
        @change="handleFileImport"
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

export default {
  data: () => ({
    files: [],
    isSelectingFile: false,
    selectedFile: null,
    loading: false,
    dialog1: false,
    singleSelect: false,
    selected: [],
    headers: [
      { text: 'ID', align: 'center', value: 'User_Identity_ID' },
      { text: 'NAME', align: 'center', value: 'User_Name' },
      { text: 'EMAIL', align: 'center', value: 'User_Email' }
    ]
  }),
  async asyncData({ app, $axios, store }) {
    let students, yearNSemsters

    console.log(store.getters['group/availableProgress'])
    try {
      // First check if atleast criteria is set
      if (
        !store.getters['group/availableProgress'] ||
        store.getters['group/availableProgress']?.length === 0
      ) {
        app.$swal.fire(
          'No score criterias available',
          'You need to enable atleast one score criteria',
          'warning'
        )
        // if no score criteria yet, take user back to prev page
        return app.router.push(-1)
      }

      // Fetch all years and semesters
      yearNSemsters = await $axios.$get('/date/allYearsSemester')
    } catch (error) {
      console.log('error', error)
    }

    return { students, yearNSemsters }
  },
  async fetch() {
    this.handelchangeRenderStudents(
      // 2021,
      // 1
      this.yearNSemsters[0].Academic_Year,
      this.yearNSemsters[0].Academic_Term
    )
  },

  methods: {
    downloadtemplete() {
      window.location.href = '/api/public_senior/templete/studentsTemplete.xlsx'
    },

    handleBrowseFile() {
      // Display loading while selecting a file
      this.isSelectingFile = true

      // After a file is selected the state of the input element will be in 'focus' Then we stop the loading
      window.addEventListener(
        'focus',
        () => {
          this.isSelectingFile = false
        },
        // Make listener invoke only once
        { once: true }
      )
      // Trigger click on the FileInput
      this.$refs.uploader.click()
    },

    handleFileImport(e) {
      try {
        if (!e.target.files[0]) {
          return
        }
        this.selectedFile = e.target.files[0]

        // Get date
        const formData = new FormData()
        formData.append('files', this.selectedFile)
        formData.append('Major', this.$store.state.auth.currentUser.major)

        this.$swal
          .fire({
            title: 'Are you sure to import this file ? ',
            text: 'Please make sure file is correct you can import once per semister!!!',
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'OK',
            denyButtonText: `Cancel`
          })
          .then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              const res = await this.$axios.$post(
                'user/importstudent',
                formData
              )
              if (res && res.status == 200) {
                this.$swal.fire('Saved!', res.msg, 'success')
                // Update UI
                await this.$nuxt.refresh()
              }
            }
          })
        // Reset target input value to null to allow @change to trigger more than once
        e.target.value = null
        return
      } catch (error) {
        console.log(err)
        this.$swal.fire('Error! some thing went wrong', err, 'warning')
        e.target.value = null
        return
      }
    },
    async handelchangeRenderStudents(year, semester, senior) {
      console.log(year, semester, senior)
      this.loading = true
      try {
        this.students = await this.$axios.$post('/user/getAllUserWithMajor', {
          Major_ID: this.$store.state.auth.currentUser.major,
          Academic_Year: year,
          Academic_Term: semester,
          Senior: senior,
          User_Role: '1'
        })

        this.students = this.students.filter(
          (user) =>
            user.User_Role === 1 &&
            user.Major_ID === this.$store.state.auth.currentUser.major
        )
        console.log('this.students', this.students)
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    }
  },
  layout: 'coordinatorsidebar'
}
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
