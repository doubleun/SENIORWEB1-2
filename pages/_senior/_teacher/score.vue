<template>
  <v-container>
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Score</h2>

    <div class="my-5 d-flex justify-end">
      <v-btn
        :loading="loading3"
        :disabled="loading3"
        @click="handleExports(filterGrade)"
        color="success"
      >
        <v-icon>mdi-microsoft-excel</v-icon>Export to Excel
      </v-btn>
    </div>

    <CoordinatorScoreDataTable
      :items="filterGrade"
      :headers="header"
      :gradeCriteria="gradeCriteria"
      :yearNSemsters="yearNSemsters"
      @on-filter-score="handelFilterScore"
    />
  </v-container>
</template>
<script>
// import scoreDataTable from "@/components/coordinator/scoreDataTable";
import exportXLSX from '@/mixins/exportXLSX'
export default {
  data: () => ({
    loading3: false,
    // sem: ['1/2564', '2/2564'],
    filterGrade: [],
    selectedYear: null,
    selectedSemester: null,
    selectedGrade: {}
  }),
  mixins: [exportXLSX],
  layout: 'coordinatorsidebar',
  async asyncData({ $axios, store }) {
    try {
      // Fetch all years and semesters
      let yearNSemsters = []
      yearNSemsters = await $axios.$get('/date/allYearsSemester')
      console.log('year and semester', yearNSemsters)

      // Fetch student score
      // let score = await $axios.$post("/group/getScoreCoor", {
      //   Major: store.state.auth.currentUser.major,
      //   Academic_Year: yearNSemsters[0].Academic_Year,
      //   Academic_Term: yearNSemsters[0].Academic_Term,
      // });

      // console.log("score", score);
      const allProgresses = [
        { Progress_Name: 'Proposal' },
        { Progress_Name: 'Progress 1' },
        { Progress_Name: 'Progress 2' },
        { Progress_Name: 'Progress 3' },
        { Progress_Name: 'Progress 4' },
        { Progress_Name: 'Final Presentation' },
        { Progress_Name: 'Final Documentation' }
      ]

      // header
      console.log('progression', allProgresses)
      // mapping progression
      var header = allProgresses.map((el) => ({
        text: el.Progress_Name,
        value: el.Progress_Name.replace(/\s+/g, ''),
        align: 'center'
      }))

      header.unshift(
        {
          text: 'ID',
          align: 'center',
          filterable: false,
          value: 'Id'
        },
        { text: 'NAME', value: 'Name', align: 'center' }
      )

      header.push(
        { text: 'TOTAL', value: 'Total', align: 'center' },
        { text: 'GRADE', value: 'Grade', align: 'center' }
      )

      console.log('header', header)

      // Fetch grade criteria
      var gradeCriteria = await $axios.$post('/criteria/gradeMajor', {
        Major_ID: store.state.auth.currentUser.major
      })

      // sorting grade criteria
      gradeCriteria.sort((a, b) =>
        a.Grade_Criteria_Pass < b.Grade_Criteria_Pass ? 1 : -1
      )

      // add display all grades option to v-select for sorting by grade (All)
      gradeCriteria.unshift({ Grade_Criteria_Name: 'All' })

      if (gradeCriteria.length == 3) {
        gradeCriteria = [
          ...gradeCriteria,
          { Grade_Criteria_Name: 'A' },
          { Grade_Criteria_Name: 'B+' },
          { Grade_Criteria_Name: 'B' },
          { Grade_Criteria_Name: 'C+' },
          { Grade_Criteria_Name: 'C' },
          { Grade_Criteria_Name: 'D+' },
          { Grade_Criteria_Name: 'D' },
          { Grade_Criteria_Name: 'F' }
        ]
      } else {
        gradeCriteria = [
          ...gradeCriteria,
          { Grade_Criteria_Name: 'S' },
          { Grade_Criteria_Name: 'U' }
        ]
      }

      return {
        yearNSemsters,
        gradeCriteria,
        header
      }
    } catch (error) {
      console.log(error)
    }
  },
  async fetch() {
    /**
     * Set inital value from state
     * @todo Refactor use a more universal way of fetching initial data
     */
    this.handelFilterScore(
      this.$store.getters['auth/currentUser'].academicYear,
      this.$store.getters['auth/currentUser'].semester,
      this.$store.getters['auth/currentUser'].senior,
      this.gradeCriteria[0]
    )
  },
  mounted() {},
  methods: {
    async handelFilterScore(year, semester, senior, selectedGrade) {
      // console.log('year', year)
      // console.log('sem', semester)
      // console.log('senior', senior)
      console.log('selectedGrade root page', selectedGrade)

      this.loading3 = true
      try {
        // Fetch student score
        let score = await this.$axios.$post('/group/getScoreCoor', {
          Major: this.$store.state.auth.currentUser.major,
          Academic_Year: year,
          Academic_Term: semester,
          Senior: senior
        })

        // this.grade = score
        selectedGrade == 'All'
          ? (this.filterGrade = score)
          : (this.filterGrade = score.filter((el) => el.Grade == selectedGrade))
        console.log('filtered grade', this.filterGrade)
      } catch (error) {
        console.log(error)
      }
      this.loading3 = false
    }
  }
}
</script>
<style scoped>
.v-btn:hover {
  background-color: #1a237e; /* blue */
  color: white;
}
.btsem {
  padding-left: 60%;
}
.teb {
  width: 100%;
}
.login {
  margin-top: 2px;
  margin-right: 3px;
  width: 100%;
}
.h4 {
  color: white;
}
</style>
