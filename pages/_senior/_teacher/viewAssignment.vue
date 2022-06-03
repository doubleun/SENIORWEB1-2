<template>
  <v-container>
    <!-- <main class="admin-group-manage-main"> -->
    <!-- <v-row class="col-6 pb-12" style="color: #fff"
      ><p style="font-size: 28px; font-weight: bold">Group</p></v-row
    > -->
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Document</h2>
    <!-- <button @click="test">test</button> -->
    <SelectSenior v-if="role === 99" />

    <!-- Action buttons -->
    <div class="my-5 d-flex justify-end" style="gap: 0.5rem; flex-wrap: wrap">
      <div>
        <v-btn color="success" @click="handleExports(allGroups)"
          ><v-icon>mdi-microsoft-excel</v-icon>Export to Excel</v-btn
        >
      </div>
    </div>

    <ViewGroupDetail
      :yearNSemsters="yearNSemsters"
      :allGroups="allGroups"
      :documents="documents"
      :majors="majors"
      :title="'Document'"
      @on-filtering="handleChangeRenderGroups"
    />
    <!-- </main> -->
  </v-container>
</template>

<script>
import exportXLSX from '@/mixins/exportXLSX'
import dialog from '@/mixins/dialog'

export default {
  mixins: [exportXLSX, dialog],
  layout: 'coordinatorsidebar',
  data() {
    return {
      loading: false,
      manageTeacher: false
    }
  },

  async asyncData({ $axios, store }) {
    let yearNSemsters, allGroups, documents, majors

    const senior = store.getters['auth/currentUser'].senior
    const role = store.getters['auth/currentUser'].role

    try {
      if (!senior) throw new Error('Cannot find senior')

      // Fetch all years and semesters
      yearNSemsters = await $axios.$get('/date/allYearsSemester')

      // Fetch all majors
      majors = await $axios.$get('/major/getAllActiveMajors')

      /// Fetch initial group
      // allGroups = await $axios.$post('/group/getGroupsFinalDoc', {
      //   Academic_Year: store.getters['auth/currentUser'].academicYear,
      //   Academic_Term: store.getters['auth/currentUser'].semester,
      //   Senior: store.getters['auth/currentUser'].senior
      // })

      documents = await $axios.$get('/group/getAllFinalDoc')
    } catch (err) {
      console.log(err)
      return { yearNSemsters: [], allGroups: [] }
    }

    return { yearNSemsters, allGroups, role, documents, majors }
  },

  methods: {
    async handleChangeRenderGroups(year, semester, major, senior) {
      this.loading = true
      console.log(year, semester, major, senior)

      try {
        let data = await this.$axios.$post('group/getGroupsFinalDoc', {
          Academic_Year: year,
          Academic_Term: semester,
          Senior: senior
        })

        if (major === 0) {
          // this.allGroups = []
          this.allGroups = data
        } else {
          // this.allGroups = []
          this.allGroups = data.filter((el) => el.Major_ID === major)
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>
