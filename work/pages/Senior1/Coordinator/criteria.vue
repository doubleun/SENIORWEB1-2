<template>
  <section>
    <main class="coordinator-criteria-main">
      <h1>Criteria</h1>

      <!-- Score criteria card -->
      <ScoreCriteriaCard :scoreCriterias="scoreCriterias" :admin="false" />

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
            <v-card-title class="text-h5">
              Grade Criteria
            </v-card-title>

            <div
              class="grade-criteria-input-flex"
              v-for="grade in gradeCriteriaArr"
              :key="grade"
            >
              <div>
                <v-subheader>Grade</v-subheader>
                <p>{{ grade }}</p>
              </div>
              <div>
                <v-subheader>Low Score</v-subheader>
                <v-text-field
                  v-model="low"
                  outlined
                  dense
                  hide-details
                ></v-text-field>
              </div>
              <div>
                <v-subheader>High Score</v-subheader>
                <v-text-field
                  v-model="high"
                  outlined
                  dense
                  hide-details
                ></v-text-field>
              </div>
            </div>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" text @click="editGradeDialog = false">
                Cancel
              </v-btn>
              <v-btn color="primary" @click="editGradeDialog = false">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <GradeCriteriaCard
        :gradeCriterias="gradeCriterias"
        class="coordinator-criteria-grade-card"
      />
    </main>
  </section>
</template>

<script>
import ScoreCriteriaCard from "@/components/Coordinator/scoreCriteriaCard";
import GradeCriteriaCard from "@/components/Coordinator/gradeCriteriaCard";

export default {
  layout: "coordinatorsidebar",
  components: {
    ScoreCriteriaCard,
    GradeCriteriaCard
  },
  data() {
    return {
      editGradeDialog: false,
      low: 0,
      gradeCriteriaArr: ["S", "U"]
    };
  },
  async asyncData({ $axios }) {
    try {
      /// Initial fetch
      let scoreCriterias, gradeCriterias;
      try {
        // Fetch score criterias
        scoreCriterias = await $axios.$post("/criteria/scoreMajor", {
          Major_ID: 1 //FIXME: use real major
        });
        // Fetch grade criterias
        gradeCriterias = await $axios.$post("/criteria/gradeMajor", {
          Major_ID: 1 //FIXME: use real major
        });
        // Pass in latest project on term which will be in the scoreCriterias
        gradeCriterias = gradeCriterias.map(itm => ({
          ...itm,
          Project_on_term_ID: scoreCriterias[0].Project_on_term_ID
        }));
      } catch (err) {
        console.log(err);
      }

      return { scoreCriterias, gradeCriterias };
    } catch (error) {}
  },
  methods: {},
  mounted() {
    console.log("Scores: ", this.scoreCriterias);
    console.log("Grades: ", this.gradeCriterias);
  }
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
