<template>
  <div>
    <v-container>
      <h2 class="header-title mb-2 mt-5 mb-10 white--text">Score</h2>
      <v-row class="btsem">
        <v-col cols="3" sm="3" md="3" lg="3">
          <div class="login" align="center" justify="center">
            <v-row><h4 class="white--text">Year</h4></v-row>
            <v-row>
              <v-select
                v-model="selectedYear"
                :items="yearNSemsters.map((itm) => itm.Academic_Year)"
                @change="handelFilterWithAcademic"
                dense
                solo
                hide-details
                class="teb mb-1 mt-1 ma-2 mb-1"
              ></v-select>
            </v-row>
          </div>
        </v-col>
        <v-col cols="3" sm="3" md="3" lg="3">
          <div class="login" align="center" justify="center">
            <v-row><h4 class="white--text">Semester</h4></v-row>
            <v-row>
              <v-select
                v-model="selectedSemester"
                :items="yearNSemsters.map((itm) => itm.Academic_Term)"
                @change="handelFilterWithAcademic"
                dense
                solo
                hide-details
                class="teb mb-1 mt-1 ma-2 mb-1"
              ></v-select>
            </v-row>
          </div>
        </v-col>
        <v-col cols="3" sm="3" md="3" lg="3">
          <div class="login" align="center" justify="center">
            <v-row><h4 class="white--text">Grade</h4></v-row>
            <v-row>
              <v-select
                v-model="selectedGrade"
                :items="gradeCriteria"
                @change="handelFilterWithGrade"
                item-text="Grade_Criteria_Name"
                item-value="Grade_Criteria_Name"
                return-object
                label="Grade"
                dense
                solo
                class="teb mb-1 mt-1 mb-1"
              ></v-select>
            </v-row>
          </div>
        </v-col>
        <v-col cols="3" sm="3" md="3" lg="3">
          <div class="login" align="center" justify="center">
            <v-row>
              <v-btn
                :loading="loading3"
                :disabled="loading3"
                @click="handleExports(items)"
                class="mb-1 mt-7 mb-1 ma-2 dark-blue--text"
              >
                Export to Excel
              </v-btn>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <CoordinatorScoreDataTable :items="filterGrade" />
    </v-container>
  </div>
</template>
<script>
// import scoreDataTable from "@/components/coordinator/scoreDataTable";
import exportXLSX from "@/mixins/exportXLSX";
export default {
  data: () => ({
    loading3: false,
    sem: ["1/2564", "2/2564"],
    filterGrade: [],
    selectedYear: null,
    selectedSemester: null,
    selectedGrade: {},
  }),
  mixins: [exportXLSX],
  layout: "coordinatorsidebar",
  async asyncData({ $axios, store }) {
    try {
      // Fetch all years and semesters
      const yearNSemsters = await $axios.$get("/date/allYearsSemester");

      // Fetch student score
      let score = await $axios.$post("/group/getScoreCoor", {
        Major: store.state.auth.currentUser.major,
        Academic_Year: yearNSemsters[0].Academic_Year,
        Academic_Term: yearNSemsters[0].Academic_Term,
      });

      // handel final grade
      var newGrade = [];
      score.forEach((el) => {
        el.newGrade =
          el.finalgrade != "" && el.finalgrade != null
            ? el.finalgrade
            : el.grade;
        newGrade.push(el);
      });

      // Fetch grade criteria score
      var gradeCriteria = await $axios.$post("/criteria/gradeMajor", {
        Major_ID: store.state.auth.currentUser.major,
      });

      // sorting grade criteria
      gradeCriteria.sort((a, b) =>
        a.Grade_Criteria_Pass < b.Grade_Criteria_Pass ? 1 : -1
      );

      // add filtter grade (All)
      gradeCriteria.unshift({ Grade_Criteria_Name: "All" });

      return { yearNSemsters, grade: [...newGrade], gradeCriteria };
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    this.selectedYear = this.yearNSemsters[0].Academic_Year;
    this.selectedSemester = this.yearNSemsters[0].Academic_Term;
    this.selectedGrade = this.gradeCriteria[0];
    this.filterGrade = this.grade.filter((el) => el.newGrade != "All");
  },
  methods: {
    async handelFilterWithAcademic() {
      console.log("major", this.$store.state.auth.currentUser.major);
      console.log("year", this.selectedYear);
      console.log("sem", this.selectedSemester);

      this.loading3 = true;
      try {
        // Fetch student score
        let score = await this.$axios.$post("/group/getScoreCoor", {
          Major: this.$store.state.auth.currentUser.major,
          Academic_Year: this.selectedYear,
          Academic_Term: this.selectedSemester,
        });

        // handel final grade
        let newGrade = [];
        score.forEach((el) => {
          el.newGrade =
            el.finalgrade != "" && el.finalgrade != null
              ? el.finalgrade
              : el.grade;
          newGrade.push(el);
        });
        this.grade = newGrade;
        this.filterGrade = this.grade.filter((el) =>
          this.selectedGrade.Grade_Criteria_Name == "All"
            ? el.newGrade != "All"
            : el.newGrade == this.selectedGrade.Grade_Criteria_Name
        );
        console.log("score", score);
        // console.log("filter grade", this.finalgrade);
      } catch (error) {
        console.log(error);
      }
      this.loading3 = false;
    },
    async handelFilterWithGrade() {
      // console.log("filter", this.selectedGrade.Grade_Criteria_Name == "All");
      console.log(" grade", this.grade);
      // let grade = this.selectedGrade.Grade_Criteria_Name;
      this.loading3 = true;
      try {
        this.filterGrade = this.grade.filter((el) =>
          this.selectedGrade.Grade_Criteria_Name == "All"
            ? el.newGrade != "All"
            : el.newGrade == this.selectedGrade.Grade_Criteria_Name
        );
        console.log("filter grade", this.filterGrade);
      } catch (error) {
        console.log(error);
      }
      this.loading3 = false;
    },
    // filterGrade(item) {},
    // total(score) {
    //   score.forEach((obj, index) => {
    //     console.log(Object.value(obj));
    //     console.log(typeof Object.value(obj) === "number");
    //     typeof Object.value(obj) === "number" ? obj : 0;
    //   });
    // },
  },
};
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
