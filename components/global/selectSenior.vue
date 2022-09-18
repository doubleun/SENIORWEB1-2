<template>
  <div style="margin-block-start: -2rem">
    <v-row class="d-flex align-center">
      <v-col sm="4" md="2">
        <v-select
          :items="academicData"
          v-model="selectedAcademicData.year"
          item-value="Academic_Year"
          item-text="Academic_Year"
          label="Year"
          dark
          filled
        ></v-select
      ></v-col>
      <v-col sm="4" md="2">
        <v-select
          :items="academicDataOptions"
          v-model="selectedAcademicData.semester"
          item-value="Academic_Term"
          item-text="Academic_Term"
          @change="handelChangeSenior"
          label="Semester"
          dark
          filled
        ></v-select
      ></v-col>
      <v-col sm="4" md="2">
        <v-select
          :items="academicDataOptions"
          v-model="selectedAcademicData.senior"
          item-value="Senior"
          item-text="Senior"
          @change="handelChangeSenior"
          label="Senior"
          dark
          filled
        ></v-select
      ></v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedAcademicData: { year: 0, semester: 0, senior: 0 },
      academicData: [],
      senior: [1, 2]
      // loading: false,
    }
  },
  mounted() {
    this.academicData = this.$store.getters['auth/semesterData']
    console.log(!this.$store.getters['auth/currentUser']?.year)
    if (
      !!this.academicData &&
      !this.$store.getters['auth/currentUser']?.academicYear
    ) {
      console.log('SET DEFAULT DATA')
      this.selectedAcademicData = {
        year: this.academicData[0].Academic_Year,
        semester: this.academicData[0].Academic_Term,
        senior: this.academicData[0].Senior
      }
      this.handelChangeSenior()
    } else {
      this.selectedAcademicData.year =
        this.$store.getters['auth/currentUser'].academicYear
      this.selectedAcademicData.semester =
        this.$store.getters['auth/currentUser'].semester
      this.selectedAcademicData.senior =
        this.$store.getters['auth/currentUser'].senior
    }
  },
  computed: {
    academicDataOptions() {
      return (
        Array.isArray(this.academicData) &&
        this.academicData?.filter(
          (data) => data.Academic_Year === this.selectedAcademicData.year
        )
      )
    }
  },
  watch: {
    // Sets default filter for year, semester and senior, when year is changed
    async academicDataOptions(newOptions) {
      console.log('Watcher')
      // console.log('newOptions', newOptions)
      // this.selectedAcademicData.semester = newOptions[0].Academic_Term
      // this.selectedAcademicData.senior = newOptions[0].Senior

      // this.$store.commit('auth/SET_USER_SENIOR', {
      //   academicYear: this.selectedAcademicData.year,
      //   semester: this.selectedAcademicData.semester,
      //   senior: this.selectedAcademicData.senior
      // })

      // new test
      this.selectedAcademicData.year =
        this.$store.getters['auth/currentUser'].academicYear
      this.selectedAcademicData.semester =
        this.$store.getters['auth/currentUser'].semester
      this.selectedAcademicData.senior =
        this.$store.getters['auth/currentUser'].senior

      await this.$nuxt.refresh()
    }
  },
  methods: {
    async handelChangeSenior() {
      // Use for setting semester and senior
      if (!this.selectedAcademicData.year) {
        return
      }
      console.log('ON CHANGE')

      this.$store.commit('auth/SET_USER_SENIOR', {
        academicYear: this.selectedAcademicData.year,
        semester: this.selectedAcademicData.semester,
        senior: this.selectedAcademicData.senior
      })

      await this.$nuxt.refresh()
    }
  }
}
</script>
