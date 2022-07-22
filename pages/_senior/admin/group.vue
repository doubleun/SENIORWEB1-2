<template>
  <v-container>
    <!-- <main class="admin-group-manage-main"> -->
    <!-- <v-row class="col-6 pb-12" style="color: #fff"
      ><p style="font-size: 28px; font-weight: bold">Group</p></v-row
    > -->
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Group</h2>
    <!-- <button @click="test">test</button> -->
    <SelectSenior />

    <!-- Action buttons -->
    <div class="my-5 d-flex justify-end" style="gap: 0.5rem; flex-wrap: wrap">
      <div>
        <v-btn color="success" @click="handleExports(selected, allGroups)"
          ><v-icon>mdi-microsoft-excel</v-icon>Export to Excel</v-btn
        >
      </div>
      <div v-if="$store.getters['auth/currentUser'].senior === 2">
        <v-btn
          color="indigo darken-2"
          dark
          @click="handleMoveGroups"
          :disabled="isValidArray(allGroups)"
          ><v-icon>mdi-microsoft-excel</v-icon>Move group to senior 2</v-btn
        >
      </div>
    </div>

    <ViewGroupDetail
      :majors="majors"
      :yearNSemsters="yearNSemsters"
      :allGroups="allGroups"
      :title="'Group'"
      isAdmin
      @on-filtering="handleChangeRenderGroups"
    />
      <!-- :mainMajor="mainMajor" -->
    <!-- </main> -->
  </v-container>
</template>

<script>
// import LongTableCard from "@/components/admin/longTableCard";
import exportXLSX from '@/mixins/exportXLSX'
import dialog from '@/mixins/dialog'
import utils from '@/mixins/utils'

export default {
  layout: 'admin',
  mixins: [exportXLSX, dialog, utils],
  data() {
    return {
      searchGroup: '',
      allGroups: [],
      selectedMajor: {},
      // selectedYear: null,
      // selectedSemester: null,
      loading: false,
      dialog1: false,
      // singleSelect: false,
      selected: []
      // selectedgroupid: [],
      // manageTeacher: false
    }
  },
  mounted() {
    // Set the default value
    // this.selectedMajor = this.majors[0];
    // this.selectedYear = this.yearNSemsters[0].Academic_Year;
    // this.selectedSemester = this.yearNSemsters[0].Academic_Term;
  },
  async asyncData({ $axios, store }) {
    let majors, yearNSemsters

    const senior = store.getters['auth/currentUser'].senior
    try {
      if (!senior) throw new Error('Cannot find senior')
      // Fetch all majors
      majors = await $axios.$get('/major/getAllActiveMajors')
      majors.unshift({ Major_ID: 0, Major_Name: 'All' })

      // Fetch all years and semesters
      yearNSemsters = await $axios.$get('/date/allYearsSemester')

      // console.log('yearNSemsters', yearNSemsters)

      // Fetch initial group
      // allGroups = await $axios.$post('/group/getAllAdmin', {
      //   Year: store.getters['auth/currentUser'].academicYear,
      //   Semester: store.getters['auth/currentUser'].semester,
      //   Senior: senior
      // })
    } catch (err) {
      console.log(err)
      return { majors: [], yearNSemsters: [] }
    }

    return { majors, yearNSemsters }
  },

  async fetch() {
    console.log('call fetch')
    /**
     * Set inital value from state
     * @todo Refactor use a more universal way of fetching initial data
     */
    this.handleChangeRenderGroups(
      this.$store.getters['auth/currentUser'].academicYear,
      this.$store.getters['auth/currentUser'].semester,
      this.majors[0].Major_ID,
      this.$store.getters['auth/currentUser'].senior
    )
    // this.mainMajor = majors[0]
  },

  methods: {
    checkdia() {
      if (this.selected.length == 0) {
        this.$swal.fire({
          // title: "Error!",
          text: 'Please select at least one group',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } else {
        this.dialog1 = true
      }
    },
    async handleMoveGroups() {
      const currentYear = this.$store.getters['auth/currentUser']?.academicYear
      const currentSemester = this.$store.getters['auth/currentUser']?.semester
      if (!currentYear) {
        throw new Error('Cannot get the currently selected year')
      }

      const moveGroup = () =>
        this.$axios.post('group/moveGroup', {
          Academic_Year: currentYear,
          Semester: currentSemester
        })

      await this.showLoading(moveGroup)
      await this.$nuxt.refresh()
    },
    async handleChangeRenderGroups(year, semester, major, senior) {
      console.log(year, semester, major, senior)
      this.loading = true
      this.allGroups = await this.$axios.$post('group/getAllAdmin', {
        Year: year,
        Semester: semester,
        Senior: senior
      })
      this.allGroups = this.allGroups.filter(
        (group) => major === 0 || group.Major_ID == major
      )
      // console.log(this.allGroups)
      this.loading = false
    }
  }
}
</script>

<style>
.admin-group-manage-main {
  margin-block-end: 2rem;
}
.admin-group-manage-main p,
.admin-group-manage-main h5 {
  font-size: 14px;
  margin: 0;
}
.admin-group-manage-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.admin-group-manage-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}

/* Group manage actions */
.admin-group-manage-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.admin-group-manage-actions .v-select {
  margin-block-end: 23px;
}
/* Reduce the second and third select box's width */
.admin-group-manage-actions > div:nth-child(n + 2):nth-child(-n + 3) {
  width: 10%;
}
.admin-group-manage-actions > div:first-child {
  width: 36%;
}
.admin-group-manage-actions > div:last-child {
  display: flex;
  gap: 0.5rem;
}

/* Group manage table card */
.group-manage-checkbox-container .v-input {
  margin: 0;
}

@media only screen and (max-width: 795px) {
  .admin-group-manage-actions > div:first-child {
    width: 50%;
  }
  .admin-group-manage-actions > div:nth-child(n + 2):nth-child(-n + 3) {
    width: 22%;
  }
  .admin-group-manage-actions .v-select {
    margin-block-end: 0.2rem;
  }
  .admin-group-manage-actions .v-btn {
    margin-block-end: 0.5rem;
  }
}
</style>
