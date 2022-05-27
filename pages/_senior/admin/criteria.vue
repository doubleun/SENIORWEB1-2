<template>
  <v-container>
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Criteria</h2>
    <SelectSenior />

    <!-- Select score Major-->
    <div class="admin-criteria-score-actions">
      <div>
        <p class="white--text">Major</p>
        <v-select
          v-model="selectedMajor"
          :items="majors"
          item-text="Major_Name"
          item-value="Major_ID"
          @change="handleFetchCriterias"
          return-object
          dense
          solo
          hide-details
          off
        />
      </div>
    </div>

    <!-- Score criteria card -->
    <CoordinatorScoreCriteriaCard :scoreCriterias="scoreCriterias" isAdmin />

    <div class="grade-criteria-dialog-card"></div>

    <!-- Select grade Major -->
    <!-- <div class="admin-criteria-score-actions">
        <div>
          <h4>Major</h4>
          <v-select
            v-model="selectedMajor"
            :items="majors"
            item-text="Major_Name"
            item-value="Major_ID"
            return-object
            dense
            solo
            hide-details
            off
          />
        </div>
      </div> -->

    <!-- Grade criteria card -->

    <CoordinatorGradeCriteriaCard
      class="admin-criteria-grade-card"
      :gradeCriterias="gradeCriterias"
      :noGradeCriteriasProp="false"
      :dataUI="dataUI"
    />
  </v-container>
</template>

<script>
// import ScoreCriteriaCard from "@/components/coordinator/scoreCriteriaCard";
// import GradeCriteriaCard from "@/components/coordinator/gradeCriteriaCard";

export default {
  layout: "admin",
  data() {
    return {
      // selectedMajor: null,
      editGradeDialog: false,
      low: 0,
    };
  },
  async asyncData({ $axios, store }) {
    /// Initial fetch
    let majors, scoreCriterias, gradeCriterias, projectOnTerm, selectedMajor;
    try {
      // Fetch latest project on term
      projectOnTerm = await $axios.$get("/date/getLatestProjectOnTerm");

      // Fetch all majors
      majors = await $axios.$get("/major/getAllActiveMajors");
      selectedMajor = majors[0];

      // Fetch score criterias
      scoreCriterias = await $axios.$post("/criteria/scoreMajor", {
        Academic_Year: store.getters["auth/currentUser"].academicYear,
        Academic_Term: store.getters["auth/currentUser"].semester,
        Senior: store.getters["auth/currentUser"].senior,
        Major_ID: majors[0].Major_ID,
        // Project_on_term_ID: projectOnTerm.Project_on_term_ID,
      });

      // Fetch grade criterias
      gradeCriterias = await $axios.$post("/criteria/gradeMajor", {
        Academic_Year: store.getters["auth/currentUser"].academicYear,
        Academic_Term: store.getters["auth/currentUser"].semester,
        Senior: store.getters["auth/currentUser"].senior,
        Major_ID: majors[0].Major_ID,
      });

      // // Pass in latest project on term which will be in the scoreCriterias
      // gradeCriterias = gradeCriterias.map((itm) => ({
      //   ...itm,
      //   Project_on_term_ID: scoreCriterias[0].Project_on_term_ID,
      // }));
    } catch (err) {
      console.log(err);
    }

    // Set data UI
    const dataUI = { scoreCriterias, gradeCriterias };
    console.log(dataUI);

    return {
      majors,
      dataUI,
      scoreCriterias,
      gradeCriterias,
      projectOnTerm,
      selectedMajor,
    };
  },

  methods: {
    // Re-Fetch score and grade criterias function
    async handleFetchCriterias() {
      // Fetch score criterias
      this.scoreCriterias = await this.$axios.$post("/criteria/scoreMajor", {
        Academic_Year: this.$store.getters["auth/currentUser"].academicYear,
        Academic_Term: this.$store.getters["auth/currentUser"].semester,
        Senior: this.$store.getters["auth/currentUser"].senior,
        Major_ID: this.selectedMajor.Major_ID,
        // Project_on_term_ID: this.projectOnTerm.Project_on_term_ID,
      });
      // Fetch grade criterias
      this.gradeCriterias = await this.$axios.$post("/criteria/gradeMajor", {
        Academic_Year: this.$store.getters["auth/currentUser"].academicYear,
        Academic_Term: this.$store.getters["auth/currentUser"].semester,
        Senior: this.$store.getters["auth/currentUser"].senior,
        Major_ID: this.selectedMajor.Major_ID,
      });

      // Update dataUI state, this way it'll trigger computed() property to re-compute the total score
      this.$set(this.dataUI, "scoreCriterias", this.scoreCriterias);
      this.$set(this.dataUI, "gradeCriterias", this.gradeCriterias);
    },
  },
  mounted() {
    // console.log("Scores: ", this.scoreCriterias);
    // console.log("Grades: ", this.gradeCriterias);
    // this.selectedMajor = this.majors[0];
  },
};
</script>

<style>
.admin-criteria-main {
  margin-block-end: 2rem;
}
.admin-criteria-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.admin-criteria-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}

.admin-edit-grade-criteria {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: 3rem 0 1rem 0;
}
.admin-edit-grade-criteria > button {
  /* width: 9rem; */
}

/* Score select Major */
.admin-criteria-score-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-block-end: 1rem;
}
.admin-criteria-score-actions p {
  margin: 0;
}
.admin-criteria-score-actions > div {
  width: 35%;
}

.admin-criteria-score-actions ~ .admin-criteria-score-actions {
  margin-block-start: 1rem;
}

@media only screen and (max-width: 795px) {
  .admin-criteria-score-actions > div {
    width: 50%;
  }
  .admin-criteria-score-actions .v-select {
    margin-block-end: 0.2rem;
  }
}

/* Edit grade card */
.grade-criteria-dialog-card {
  padding: 1rem;
}
.grade-criteria-input-flex {
  display: flex;
  width: 80%;
  margin-inline: auto;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1.4rem;
}
.grade-criteria-input-flex .v-subheader {
  padding: 0 !important;
}
.grade-criteria-input-flex p {
  font-size: 20px;
  height: 40px;
  margin: 0;
}
.grade-criteria-dialog-card hr {
  margin-block: 1rem;
}
</style>
