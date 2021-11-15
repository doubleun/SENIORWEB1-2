<template>
  <section>
    <main class="admin-criteria-main">
      <h1>Criteria</h1>

      <!-- Select score study program -->
      <div class="admin-criteria-score-actions">
        <div>
          <p class="white--text">Study Program</p>
          <v-select :items="programsArr" dense solo hide-details off />
        </div>
      </div>

      <!-- Score criteria card -->
      <ScoreCriteriaCard />

      <!-- Select grade study program -->
      <div class="admin-criteria-score-actions">
        <div>
          <h4>Study Program</h4>
          <v-select :items="programsArr" dense solo hide-details off />
        </div>
      </div>

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

      <GradeCriteriaCard class="admin-criteria-grade-card" />
    </main>
  </section>
</template>

<script>
import ScoreCriteriaCard from "@/components/Coordinator/scoreCriteriaCard";
import GradeCriteriaCard from "@/components/Coordinator/gradeCriteriaCard";

export default {
  layout: "admin",
  components: {
    ScoreCriteriaCard,
    GradeCriteriaCard
  },
  data() {
    return {
      programsArr: ["Information and Communication Engineering"],
      editGradeDialog: false,
      gradeCriteriaArr: ["S", "U"]
    };
  }
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
  margin-block: 1rem;
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
