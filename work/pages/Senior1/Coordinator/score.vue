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
                :items="fillterGrade"
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
      <CoordinatorScoreDataTable :items="grade" />
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
    fillterGrade: [],
    selectedYear: null,
    selectedSemester: null,
    selectedGrade: null,
  }),
  mixins: [exportXLSX],
  layout: "coordinatorsidebar",
  async asyncData({ $axios, store }) {
    try {
      // Fetch all years and semesters
      const yearNSemsters = await $axios.$get("/date/allYearsSemester");

      // Fetch student score
      var score = await $axios.$post("/group/getScoreCoor", {
        Major: store.state.auth.currentUser.major,
        Academic_Year: yearNSemsters[0].Academic_Year,
        Academic_Term: yearNSemsters[0].Academic_Term,
      });
      // console.log("score", score);
      var newGrade = [];
      score.forEach((el) => {
        el.newGrade =
          el.finalgrade != "" && el.finalgrade != null
            ? el.finalgrade
            : el.grade;
        newGrade.push(el);
      });
      // console.log("new score", newGrade);
      // score.forEach((obj, index) => {
      //   // console.log(obj);
      //   console.log(Object.values(obj));
      //   console.log(typeof Object.values(obj[index]) === "number");
      //   // typeof Object.value(obj) === "number" ? obj : 0;
      // });
      return { yearNSemsters, grade: newGrade };
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    this.selectedYear = this.yearNSemsters[0].Academic_Year;
    this.selectedSemester = this.yearNSemsters[0].Academic_Term;
  },
  methods: {
    async handelFilterWithAcademic() {
      // console.log("fillter");
      this.loading3 = true;
      try {
        // Fetch student score
        this.score = await this.$axios.$post("/group/getScoreCoor", {
          Major: this.$store.state.auth.currentUser.major,
          Academic_Year: this.selectedYear,
          Academic_Term: this.selectedSemester,
        });
      } catch (error) {
        console.log(error);
      }
      this.loading3 = false;
    },
    async handelFilterWithAcademic() {
      // console.log("fillter");
      this.loading3 = true;
      try {
      } catch (error) {
        console.log(error);
      }
      this.loading3 = false;
    },
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
