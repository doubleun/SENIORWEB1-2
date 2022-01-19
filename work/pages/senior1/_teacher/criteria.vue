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
              v-show="!noGradeCriterias"
            >
              Edit Grade Criteria</v-btn
            >
          </template>

          <!-- Edit grade criteria pop up card -->
          <v-card class="grade-criteria-dialog-card">
            <v-card-title class="text-h5"> Grade Criteria </v-card-title>

            <section class="d-flex flex-column" style="gap: 0.6rem">
              <v-form ref="form" v-model="valid">
                <div
                  class="grade-criteria-input-flex"
                  v-for="(grade, index) in gradeCriterias"
                  :key="index"
                >
                  <div style="width: 12%">
                    <v-subheader v-if="index === 0">Grade</v-subheader>
                    <p>{{ grade.Grade_Criteria_Name }}</p>
                  </div>
                  <div style="width: 60%">
                    <v-subheader v-if="index === 0">Pass Score</v-subheader>
                    <p v-if="index === gradeCriterias.length - 1"></p>
                    <v-text-field
                      v-model="grade.Grade_Criteria_Pass"
                      :rules="[
                        () =>
                          grade.Grade_Criteria_Pass !== null ||
                          'This field is required',
                        handleCheckValidScore(grade.Grade_Criteria_Pass),
                      ]"
                      v-else
                      outlined
                      dense
                      hide-details
                    ></v-text-field>
                  </div>
                </div>
              </v-form>
            </section>
            <!-- <div
              class="grade-criteria-input-flex"
              v-for="(grade, index) in gradeCriterias"
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
            </div> -->

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
        :noGradeCriteriasProp="noGradeCriterias"
        @add-grade-criterias="refresh"
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
      valid: true,
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

      // Sets no grade criteria to true if grade criteria length is zero
      return {
        scoreCriterias,
        gradeCriterias,
        noGradeCriterias: gradeCriterias.length === 0,
      };
    } catch (err) {
      console.log(err);
      return;
    }
  },
  methods: {
    // Update grade criterias function (score criteria has a function in the compunent for update)
    async handleUpdateGradeCriterias() {
      console.log(this.$refs);
      console.log(this.$refs.form);
      // Validate form
      this.$refs.form.validate();
      if (!this.valid) return;

      try {
        // Show confirm dialog
        this.$swal
          .fire({
            title: "Please, confirm your changes.",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
          })
          .then(async (result) => {
            if (result.isConfirmed) {
              // Post new grade criteria to update in database
              const res = await this.$axios.$post("/criteria/gradeEdit", {
                data: this.gradeCriterias,
              });
              // If update grade criterias successfully, display success dialog
              if (res.status === 200) {
                // Close edit grade criteria modal
                this.$swal.fire({
                  title: "Grade updated",
                  icon: "success",
                });
                this.editGradeDialog = false;
                return;
              } else {
                throw new Error(
                  "Failed to update grade criterias, please try again later"
                );
              }
            } else {
              return;
            }
          });
      } catch (err) {
        console.log(err);
        return;
      }
    },
    refresh() {
      console.log("refresh");
      this.$nuxt.refresh();
    },
    handleCheckValidScore(val) {
      return val <= 0 ? "Invalid score" : true;
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
