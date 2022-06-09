<template>
  <v-container>
    <!-- <main class="admin-teacher-manage-main"> -->
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Manage Teacher</h2>
    <SelectSenior />

    <div class="my-5 d-flex justify-end">
      <v-btn
        class="mr-2 dark-blue--text"
        align="right"
        justify="right"
        dark
        color="blue darken-4"
        :loading="isSelectingFile"
        @click="handleBrowseFile"
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
        dark
        color="blue darken-4"
        @click="downloadtemplete"
      >
        <v-icon dark> mdi-application-import </v-icon>
        dowload templete
      </v-btn>
    </div>

    <AdminDataTable
      :tableTitle="'Teacher'"
      :headers="headers"
      itemKey="User_Email"
      :items="teachers"
      :itemPerPage="10"
      :teacherEditAttrs="attrs"
      manageTeacher
      :majors="majors"
      :yearNSemsters="yearNSemsters"
      :roles="roles"
      :filterFromState="true"
      @on-filtering="handelchangeRenderTeachers"
    />
    <!-- </main> -->
  </v-container>
</template>

<script>
// import LongTableCard from "@/components/admin/longTableCard";
// import AdminDataTable from "@/components/admin/adminDataTable";

export default {
  layout: 'admin',
  data: () => ({
    selectedMajor: {},
    selectedYear: null,
    selectedSemester: null,
    selectedFile: null,
    selectedRole: null,
    isSelectingFile: false,
    loading: false,
    dialog1: false,
    singleSelect: false,
    selected: [],
    teachers: [],
    // Attributes that will show in the 'Edit dialog'
    attrs: [
      { lable: 'NAME', value: 'User_Name' },
      { lable: 'EMAIL', value: 'User_Email' }
    ],
    headers: [
      { text: 'NAME', align: 'center', value: 'User_Name' },
      { text: 'EMAIL', align: 'center', value: 'User_Email' },
      { text: 'STUDY PROGRAM', align: 'center', value: 'Major_Name' },
      { text: 'ADVISOR', align: 'center', value: 'Advisor' },
      { text: 'COMMITTEE', align: 'center', value: 'Committee' },
      { text: 'ROLE', align: 'center', value: 'User_Role_Name', width: '25%' }
      // { text: "ACTION", align: "center", value: "actions", sortable: false },
      // { text: "SEM", align: "center", value: "Committee" },
    ]
  }),

  async asyncData({ $axios, store }) {
    let majors, yearNSemsters, roles
    try {
      // Fetch all majors
      majors = await $axios.$get('/major/getAllActiveMajors')

      // Fetch all years and semesters
      yearNSemsters = await $axios.$get('/date/allYearsSemester')

      // Fetch teacher's roles
      roles = await $axios.$get('/user/getTeacherRole')
    } catch (error) {
      console.log(error)
    }

    return { majors, yearNSemsters, roles }
  },

  async fetch() {
    /**
     * Set inital value from state
     * @todo Refactor use a more universal way of fetching initial data
     */
    this.handelchangeRenderTeachers(
      this.$store.getters['auth/currentUser'].academicYear,
      this.$store.getters['auth/currentUser'].semester,
      this.$store.getters['auth/currentUser'].senior,
      this.majors[0].Major_ID,
      this.roles[0].Role_ID
    )
  },

  methods: {
    async handelchangeRenderTeachers(year, semester, senior, majorId, role) {
      this.loading = true
      try {
        this.teachers = await this.$axios.$post('/user/getAllUserWithMajor', {
          Major_ID: majorId,
          Academic_Year: year,
          Academic_Term: semester,
          Senior: senior,
          User_Role: role
        })
        // Add user_role_name based on user_role (Should fetch role name from the database ?)
        this.teachers = this.teachers.map((teacher) => ({
          ...teacher,
          User_Role_Name: teacher.User_Role === 0 ? 'Teacher' : 'Coordinator'
        }))
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },

    downloadtemplete() {
      window.location.href = '/api/public_senior/templete/teacherTemplete.xlsx'
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
        if (!!e.target.files[0]) {
          this.selectedFile = e.target.files[0]
          // console.log('e.target', e.target)
          // console.log('e.target.val', e.target?.value)
          // console.log('e.target.files', e.target?.files)
        } else {
          // console.log('no file selected')
          return
        }
        // Get date
        // TODO: Date should be create in server-side not on client-side
        // const d = new Date().toLocaleString()

        const formData = new FormData()

        // Get senior from state
        const selectedSenior = this.$store.getters['auth/currentUser'].senior
        const year = this.$store.getters['auth/currentUser'].academicYear
        const semester = this.$store.getters['auth/currentUser'].semester

        if (!selectedSenior) return

        formData.append('file', this.selectedFile)

        // Add senior to formData
        formData.append('senior', selectedSenior)
        formData.append('year', year)
        formData.append('semester', semester)

        // console.log('FormData', [...formData])

        // Fetch API for import teacher
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
                'user/importteacher',
                formData
              )
              // console.log('res', res)
              if (res.status == 200) {
                this.$swal.fire('Saved!', res.msg, 'success')
                // Update UI
                await this.$nuxt.refresh()
              }

              // if (!res) {
              //   this.$swal.fire('Error! some thing went wrong', '', 'warning')
              // } else {
              //   this.$swal
              //     .fire('Saved!', res.msg, 'success')
              //     .then(async (result) => {
              //       await this.$nuxt.refresh()
              //     })

              //   // if (res === 'success') {
              //   //   this.$swal.fire('Saved!', '', 'success')
              //   //   // Update UI
              //   //   await this.$nuxt.refresh()
              //   // } else if (res === 'someproblem') {
              //   //   this.$swal.fire(
              //   //     'Success',
              //   //     'Success with condition some field are not inserted',
              //   //     'warning'
              //   //   )
              //   //   // Update UI
              //   //   await this.$nuxt.refresh()
              //   // } else {
              //   //   this.$swal.fire(
              //   //     'Error! some thing went wrong',
              //   //     'User will not inserted',
              //   //     'warning'
              //   //   )
              //   // }
              // }
            }
          })
        // Reset target input value to null to allow @change to trigger more than once
        e.target.value = null
        return
      } catch (err) {
        console.log(err)
        this.$swal.fire('Error! some thing went wrong1212', err, 'warning')
        e.target.value = null
        return
      }
    }
  }
}
</script>

<style>
.admin-teacher-manage-main {
  margin-block-end: 2rem;
}
.admin-teacher-manage-main p,
.admin-teacher-manage-main h5 {
  font-size: 14px;
  margin: 0;
}
.admin-teacher-manage-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.admin-teacher-manage-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}

/* Teacher manage actions */
.admin-teacher-manage-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.admin-teacher-manage-actions .v-select {
  margin-block-end: 23px;
}

/* Reduce the second select box's width */
.admin-teacher-manage-actions > div:nth-child(2n) {
  width: 14%;
}
.admin-teacher-manage-actions > div:first-child {
  width: 25%;
}
.admin-teacher-manage-actions > div:last-child {
  display: flex;
  gap: 0.5rem;
}

/* Teacher manage table card */
.teacher-manage-checkbox-container .v-input {
  margin: 0;
}

@media only screen and (max-width: 497px) {
  .admin-teacher-manage-actions > div:first-child {
    width: 50%;
  }
  .admin-teacher-manage-actions > div:nth-child(2n) {
    width: 22%;
  }
  .admin-teacher-manage-actions .v-select {
    margin-block-end: 0.2rem;
  }
  .admin-teacher-manage-actions .v-btn {
    margin-block-end: 0.5rem;
  }
  .admin-teacher-manage-main .admin-teacher-manage-edit-btn {
    font-size: 12px;
  }
  .admin-teacher-manage-main .admin-teacher-manage-edit-btn i {
    font-size: 18px;
  }
}

/* Edit teacher dialog */
.edit-teacher-dialog-card {
  padding: 1rem;
}
.edit-teacher-input-flex {
  display: flex;
  flex-wrap: wrap;
  margin-inline: auto;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  gap: 1.4rem;
}
.edit-teacher-input-flex .v-subheader {
  padding: 0 !important;
}
.edit-teacher-input-flex p {
  font-size: 20px;
  height: 40px;
  margin: 0;
}
.edit-teacher-input-flex > div {
  width: 46%;
}
.edit-teacher-dialog-card hr {
  margin-block: 1rem;
}
</style>
