<template>
  <v-container>
    <!-- <main class="admin-group-manage-main"> -->
    <!-- <v-row class="col-6 pb-12" style="color: #fff"
      ><p style="font-size: 28px; font-weight: bold">Group</p></v-row
    > -->
    <h2
      class="header-title mb-2 mt-5"
      :class="role === 1 ? 'black--text' : 'white--text mb-10'"
    >
      Document
    </h2>
    <v-divider v-if="role === 1" class="mb-5"></v-divider>

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
import dialog from '@/mixins/dialog'

export default {
  mixins: [dialog],

  data() {
    return {
      loading: false,
      manageTeacher: false,
      allGroups: []
    }
  },

  async asyncData({ $axios, store }) {
    let yearNSemsters, allGroups, documents, majors

    const senior = store.getters['auth/currentUser'].senior
    const role = store.getters['auth/currentUser'].role

    try {
      if (!senior) throw new Error('Cannot find senior')

      // Fetch all majors
      majors = await $axios.$get('/major/getAllActiveMajors')
      majors.unshift({ Major_ID: 0, Major_Name: 'All' })

      // Fetch all years and semesters
      yearNSemsters = await $axios.$get('/date/allYearsSemester')

      // Fetch initial group
      // allGroups = await $axios.$post('/group/getGroupsFinalDoc', {
      //   Academic_Year: store.getters['auth/currentUser'].academicYear,
      //   Academic_Term: store.getters['auth/currentUser'].semester,
      //   Senior: store.getters['auth/currentUser'].senior
      // })

      // Fetch all finaldoc
      documents = await $axios.$get('/group/getAllFinalDoc')
    } catch (err) {
      console.log(err)
      return { yearNSemsters: [] }
    }

    return { yearNSemsters, role, documents, majors }
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
      this.$store.state.auth.currentUser.major,
      this.$store.getters['auth/currentUser'].senior
    )
    // this.mainMajor = majors[0]
  },

  methods: {
    async handleChangeRenderGroups(year, semester, major, senior) {
      this.loading = true
      try {
        // TODO: if do not need to fetch data from data every time while filter can you allGroups variable that fetch data in asyncData()

        let data = await this.$axios.$post('group/getGroupsFinalDoc', {
          Academic_Year: year,
          Academic_Term: semester,
          Senior: senior
        })

        if (major === 0) {
          this.allGroups = data
        } else {
          this.allGroups = data.filter((el) => el.Major_ID == major)
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>
