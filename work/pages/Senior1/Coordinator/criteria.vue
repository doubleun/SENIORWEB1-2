<template>
  <section>
    <main class="coordinator-criteria-main">
      <h1>Criteria</h1>

      <!-- Score criteria card -->
      <CoordinatorScoreCriteriaCard
        :scoreCriterias="scoreCriterias"
        :admin="false"
        @score-updated="refresh"
      />

      <!-- Grade criteria card -->
      <!-- Edit criteria button -->
      <div class="coordinator-edit-grade-criteria">
        <v-dialog v-model="editGradeDialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="blue darken-4"
              class="white--text"
              v-on="on"
              v-bind="attrs"
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
        :gradeCriterias="gradeCriterias"
        class="coordinator-criteria-grade-card"
      />
    </main>
  </section>
</template>

<script>
// import ScoreCriteriaCard from "@/components/coordinator/scoreCriteriaCard";
// import GradeCriteriaCard from "@/components/coordinator/gradeCriteriaCard";

export default {
  layout: "coordinatorsidebar",
  data() {
    return {
      editGradeDialog: false,
      low: 0,
      gradeCriteriaArr: ["S", "U"],
    };
  },
  async asyncData({ $axios, store }) {
    // console.log("Major: ", store.state.auth.currentUser.major);

    /// Initial fetch
    let scoreCriterias, gradeCriterias;
    try {
      // Fetch score criterias
      scoreCriterias = await $axios.$post("/criteria/scoreMajor", {
        Major_ID: store.state.auth.currentUser.major,
        Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
      });
      // Fetch grade criterias
      gradeCriterias = await $axios.$post("/criteria/gradeMajor", {
        Major_ID: store.state.auth.currentUser.major,
      });
      // // Pass in latest project on term which will be the latest available semester
      // gradeCriterias = gradeCriterias.map((itm) => ({
      //   ...itm,
      //   Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
      // }));
      console.log(scoreCriterias, gradeCriterias);

      return { scoreCriterias, gradeCriterias };
    } catch (err) {
      console.log(err);
      return;
    }
  },
  methods: {
    // Update grade criterias function (score criteria has a function in the compunent for update)
    async handleUpdateGradeCriterias() {
      const res = await this.$axios.$post("/criteria/gradeEdit", {
        data: this.gradeCriterias.slice(0, 2),
      });
      if (res.status === 200) this.editGradeDialog = false;
    },
    refresh() {
      this.$nuxt.refresh();
    },
  },
  mounted() {
    console.log("Scores: ", this.scoreCriterias);
    console.log("Grades: ", this.gradeCriterias);
  },
};
</script>

<style>
.coordinator-criteria-main {
  margin-block-end: 2rem;
}
.coordinator-criteria-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.coordinator-criteria-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}

.coordinator-edit-grade-criteria {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-block: 2rem;
}
.coordinator-edit-grade-criteria > button {
  /* width: 9rem; */
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
