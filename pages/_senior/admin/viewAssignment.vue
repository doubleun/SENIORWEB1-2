<template>
  <v-container>
    <!-- <main class="admin-group-manage-main"> -->
    <!-- <v-row class="col-6 pb-12" style="color: #fff"
      ><p style="font-size: 28px; font-weight: bold">Group</p></v-row
    > -->
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Document</h2>
    <!-- <button @click="test">test</button> -->
    <SelectSenior v-if="role === 99" />

    <ViewGroupDetail
      :yearNSemsters="yearNSemsters"
      :allGroups="allGroups"
      :documents="documents"
      :majors="majors"
      isAdmin
      :title="'Document'"
      @on-filtering="handleChangeRenderGroups"
    />
    <!-- </main> -->
  </v-container>
</template>

<script>
import dialog from '@/mixins/dialog'

export default {
  mixins: [dialog],
  layout: 'admin',
  data() {
    return {
      loading: false,
      manageTeacher: false,
      allGroups: []
    }
  },

  async asyncData({ $axios, store }) {
    let yearNSemsters, documents, majors

    const senior = store.getters['auth/currentUser'].senior
    const role = store.getters['auth/currentUser'].role

    try {
      if (!senior) throw new Error('Cannot find senior')

      // Fetch all years and semesters
      yearNSemsters = await $axios.$get('/date/allYearsSemester')

      // Fetch all majors
      majors = await $axios.$get('/major/getAllActiveMajors')
      majors.unshift({ Major_ID: 0, Major_Name: 'All' })

      // Fetch initial group
      // allGroups = await $axios.$post('/group/getGroupsFinalDoc', {
      //   Academic_Year: store.getters['auth/currentUser'].academicYear,
      //   Academic_Term: store.getters['auth/currentUser'].semester,
      //   Senior: store.getters['auth/currentUser'].senior
      // })

      documents = await $axios.$get('/group/getAllFinalDoc')
    } catch (err) {
      console.log(err)
      return { yearNSemsters: [] }
    }

    return { yearNSemsters, role, documents, majors }
  },

  async fetch() {
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
  },

  methods: {
    async handleChangeRenderGroups(year, semester, major, senior) {
      // this.loading = true
      console.log(year, semester, major, senior, 'fucntion')
      try {
        // TODO: if do not need to fetch data from data every time while filter can you allGroups variable that fetch data in asyncData()
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
        // console.log('allGroups', this.allGroups)
      } catch (error) {
        console.log(error)
      }
      // this.loading = false
    }
  }
}
</script>
