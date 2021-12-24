<template>
  <v-card class="score-criteria-card">
    <v-card-title>
      <h4>Score Criteria</h4>
      <h4>Total: 100/100</h4>
    </v-card-title>

    <!-- Score criteria table -->
    <div class="score-criteria-content">
      <!-- Table attr -->
      <h4>CRITERIA</h4>
      <h4>Advisor_Score</h4>
      <h4>CO-Advisor_Score</h4>
      <h4>COMMITTEE 1</h4>
      <h4>COMMITTEE 2</h4>
      <h4>Total</h4>
      <h4>ACTIONS</h4>

      <!-- Table records -->
      <template v-for="criteria in scoreCriterias">
        <p :key="criteria.Progress_Name + 1">{{ criteria.Progress_Name }}</p>
        <p :key="criteria.Progress_Name + 2">
          {{ criteria.Advisor_Score || 0 }}
        </p>
        <p :key="criteria.Progress_Name + 3">
          {{ criteria.coAdvisor_Score || 0 }}
        </p>
        <p :key="criteria.Progress_Name + 4">
          {{ criteria.Committee1_Score || 0 }}
        </p>
        <p :key="criteria.Progress_Name + 5">
          {{ criteria.Committee2_Score || 0 }}
        </p>
        <p :key="criteria.Progress_Name + 6">{{ criteria.Total || 0 }}</p>

        <!-- Edit score criteria button -->
        <v-dialog
          v-model="criteria.editDialog"
          width="500"
          :key="criteria.Progress_Name + 7"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="blue darken-4"
              class="white--text"
              v-on="on"
              v-bind="attrs"
              :disabled="admin"
              ><v-icon>mdi-pen</v-icon> Edit</v-btn
            >
          </template>

          <!-- Edit score criteria pop up card -->
          <v-card class="score-criteria-dialog-card">
            <v-card-title class="text-h5">
              Score Criteria
            </v-card-title>

            <div class="score-criteria-input-flex">
              <div v-for="(role, index) in editScoreRoles" :key="role.id">
                <v-subheader>{{ role.name }}</v-subheader>
                <v-text-field
                  v-model="criteria[role.value]"
                  :disabled="index === 1"
                  outlined
                  dense
                  hide-details
                ></v-text-field>
              </div>
            </div>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="secondary"
                text
                @click="criteria.editDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn color="primary" @click="updateScoreCriteria(criteria)">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    scoreCriterias: Array,
    admin: Boolean
  },
  data() {
    return {
      editScoreDialog: false,
      editScoreRoles: [
        { id: 1, name: "Advisor_Score", score: 0, value: "Advisor_Score" },
        { id: 2, name: "Co-Advisor_Score", score: 0, value: "" },
        { id: 3, name: "Committee 1", score: 0, value: "Committee1_Score" },
        { id: 4, name: "Committee 2", score: 0, value: "Committee2_Score" }
      ]
    };
  },
  methods: {
    async updateScoreCriteria(criteriaItem) {
      try {
        const res = await this.$axios.$post("/criteria/scoreEdit", {
          ...criteriaItem
        });
        if (res.status === 200) {
          criteriaItem.editDialog = false;
          // Update total
          criteriaItem.Total =
            parseInt(criteriaItem.Advisor_Score) +
            parseInt(criteriaItem.Committee1_Score) +
            parseInt(criteriaItem.Committee2_Score);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style>
.score-criteria-card {
  padding: 0.4rem 1.4rem 1rem;
}
.score-criteria-card .v-card__title {
  display: flex;
  padding: 1rem;
}
.score-criteria-card .v-card__title h4:first-child {
  flex: 1;
}

/* Score criteria content (table) */
.score-criteria-content p {
  margin: 0;
}
.score-criteria-content {
  display: grid;
  grid-template-columns: repeat(7, auto);
  overflow-x: auto;
  text-align: center;
  align-items: center;
  gap: 2rem 1rem;
}
@media only screen and (max-width: 600px) {
  .score-criteria-card .v-card__title {
    display: flex;
    padding: 0;
  }
  .score-criteria-card .v-card__title h4 {
    font-size: 18px;
  }
  .score-criteria-content {
    display: grid;
    grid-template-columns: repeat(7, auto);
    overflow-x: auto;
    margin-block-start: 1rem;
    text-align: center;
    align-items: center;
    gap: 0.8rem 0.5rem;
    font-size: 14px;
  }
  .score-criteria-content .v-btn__content {
    font-size: 12px;
  }
  .score-criteria-content .v-icon {
    font-size: 16px !important;
  }
}
.score-criteria-content > h4 {
  margin-block: 1rem;
}

/* Edit score card */
.score-criteria-dialog-card {
  padding: 1rem;
}
.score-criteria-input-flex {
  display: flex;
  flex-wrap: wrap;
  margin-inline: auto;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1.4rem;
}
.score-criteria-input-flex .v-subheader {
  padding: 0 !important;
}
.score-criteria-input-flex p {
  font-size: 20px;
  height: 40px;
  margin: 0;
}
.score-criteria-input-flex > div {
  width: 46%;
}
.score-criteria-dialog-card hr {
  margin-block: 1rem;
}
</style>
