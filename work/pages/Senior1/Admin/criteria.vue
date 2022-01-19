<template>
  <section>
    <main class="admin-criteria-main">
      <h1>Criteria</h1>

      <!-- Select score study program -->
      <div class="admin-criteria-score-actions">
        <div>
          <p class="white--text">Study Program</p>
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
      <CoordinatorScoreCriteriaCard :scoreCriterias="scoreCriterias" admin />

      <!-- Select grade study program -->
      <!-- <div class="admin-criteria-score-actions">
        <div>
          <h4>Study Program</h4>
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
      <!-- Edit criteria button -->
      <div class="admin-edit-grade-criteria">
        <v-dialog v-model="editGradeDialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="blue darken-4"
              class="white--text"
              v-on="on"
              v-bind="attrs"
              disabled
            >
              Edit Grade Criteria</v-btn
            >
          </template>

          <!-- Edit grade criteria pop up card -->
          <v-card class="grade-criteria-dialog-card">
            <v-card-title class="text-h5"> Grade Criteria </v-card-title>

            <div
              class="grade-criteria-input-flex"
              v-for="(grade, index) in gradeCriterias.slice(0, 2)"
              :key="index"
            >
              <div>
                <v-subheader>Grade</v-subheader>
                <p>{{ grade.Grade_Criteria_Name }}</p>
              </div>
              <div>
                <v-subheader>Pass Score</v-subheader>
                <v-text-field
                  v-model="grade.Grade_Criteria_Pass"
                  outlined
                  dense
                  hide-details
                ></v-text-field>
              </div>
              <!-- <div>
                <v-subheader>High Score</v-subheader>
                <v-text-field
                  v-model="high"
                  outlined
                  dense
                  hide-details
                ></v-text-field>
              </div> -->
            </div>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" text @click="editGradeDialog = false">
                Cancel
              </v-btn>
              <v-btn color="primary" @click="handleUpdateGradeCriterias">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <CoordinatorGradeCriteriaCard
        class="admin-criteria-grade-card"
        :gradeCriterias="gradeCriterias"
      />
    </main>
  </section>
</template>

<script>
// import ScoreCriteriaCard from "@/components/coordinator/scoreCriteriaCard";
// import GradeCriteriaCard from "@/components/coordinator/gradeCriteriaCard";

export default {
  layout: "admin",
  data() {
    return {
      selectedMajor: null,
      editGradeDialog: false,
      low: 0,
    };
  },
  async asyncData({ $axios }) {
    /// Initial fetch
    let majors, scoreCriterias, gradeCriterias;
    try {
      // Fetch all majors
      majors = await $axios.$get("/user/getAllMajors");
      // Fetch score criterias
      scoreCriterias = await $axios.$post("/criteria/scoreMajor", {
        Major_ID: majors[0].Major_ID,
      });
      // Fetch grade criterias
      gradeCriterias = await $axios.$post("/criteria/gradeMajor", {
        Major_ID: majors[0].Major_ID,
      });
      // Pass in latest project on term which will be in the scoreCriterias
      gradeCriterias = gradeCriterias.map((itm) => ({
        ...itm,
        Project_on_term_ID: scoreCriterias[0].Project_on_term_ID,
      }));
    } catch (err) {
      console.log(err);
    }

    return { majors, scoreCriterias, gradeCriterias };
  },
  methods: {
    // Update grade criterias function (score criteria has a function in the compunent for update)
    async handleUpdateGradeCriterias() {
      const res = await this.$axios.$post("/criteria/gradeEdit", {
        data: this.gradeCriterias.slice(0, 2),
      });
      if (res.status === 200) this.editGradeDialog = false;
    },
    // Re-Fetch score and grade criterias function
    async handleFetchCriterias() {
      // Fetch score criterias
      this.scoreCriterias = await this.$axios.$post("/criteria/scoreMajor", {
        Major_ID: this.selectedMajor.Major_ID,
      });
      // Fetch grade criterias
      this.gradeCriterias = await this.$axios.$post("/criteria/gradeMajor", {
        Major_ID: this.selectedMajor.Major_ID,
      });
      // Pass in latest project_on_term from scorecriterias for when grade criterias get update
      this.gradeCriterias = this.gradeCriterias.map((itm) => ({
        ...itm,
        Project_on_term_ID: this.scoreCriterias[0].Project_on_term_ID,
      }));
    },
  },
  mounted() {
    console.log("Scores: ", this.scoreCriterias);
    console.log("Grades: ", this.gradeCriterias);
    this.selectedMajor = this.majors[0];
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

/* Score select study program */
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
