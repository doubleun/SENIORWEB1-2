<template>
  <v-card class="score-criteria-card">
    <v-card-title>
      <h4>Score Criteria</h4>
      <h4>TOTAL: 100/100</h4>
    </v-card-title>

    <!-- Score criteria table -->
    <div class="score-criteria-content">
      <!-- Table attr -->
      <h4>CRITERIA</h4>
      <h4>ADVISOR</h4>
      <h4>CO-ADVISOR</h4>
      <h4>COMMITTEE 1</h4>
      <h4>COMMITTEE 2</h4>
      <h4>TOTAL</h4>
      <h4>ACTIONS</h4>

      <!-- Table records -->
      <template v-for="criteria in scoreCriteriaArr">
        <p :key="criteria.criteria + 1">{{ criteria.criteria }}</p>
        <p :key="criteria.criteria + 2">{{ criteria.advisor }}</p>
        <p :key="criteria.criteria + 3">{{ criteria.coAdvisor }}</p>
        <p :key="criteria.criteria + 4">{{ criteria.committee1 }}</p>
        <p :key="criteria.criteria + 5">{{ criteria.committee2 }}</p>
        <p :key="criteria.criteria + 6">{{ criteria.total }}</p>

        <!-- Edit score criteria button -->
        <v-dialog
          v-model="criteria.editDialog"
          width="500"
          :key="criteria.criteria + 7"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="blue darken-4"
              class="white--text"
              v-on="on"
              v-bind="attrs"
              ><v-icon>mdi-pen</v-icon> Edit</v-btn
            >
          </template>

          <!-- Edit score criteria pop up card -->
          <v-card class="score-criteria-dialog-card">
            <v-card-title class="text-h5">
              Score Criteria
            </v-card-title>

            <div class="score-criteria-input-flex">
              <div v-for="role in editScoreRoles" :key="role.id">
                <v-subheader>{{ role.name }}</v-subheader>
                <v-text-field outlined dense hide-details></v-text-field>
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
              <v-btn color="primary" @click="criteria.editDialog = false">
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
  data() {
    return {
      scoreCriteriaArr: [
        {
          criteria: "Progress 1",
          advisor: 20,
          coAdvisor: 0,
          committee1: 0,
          committee2: 0,
          total: 20,
          editDialog: false
        },
        {
          criteria: "Progress 2",
          advisor: 20,
          coAdvisor: 0,
          committee1: 0,
          committee2: 0,
          total: 20,
          editDialog: false
        },
        {
          criteria: "Progress 3",
          advisor: 20,
          coAdvisor: 0,
          committee1: 0,
          committee2: 0,
          total: 20,
          editDialog: false
        },
        {
          criteria: "Progress 4",
          advisor: 0,
          coAdvisor: 0,
          committee1: 0,
          committee2: 0,
          total: 0,
          editDialog: false
        },
        {
          criteria: "Final Presentation",
          advisor: 10,
          coAdvisor: 0,
          committee1: 5,
          committee2: 5,
          total: 20,
          editDialog: false
        },
        {
          criteria: "Final Documentation",
          advisor: 10,
          coAdvisor: 0,
          committee1: 5,
          committee2: 5,
          total: 20,
          editDialog: false
        }
      ],
      editScoreDialog: false,
      editScoreRoles: [
        { id: 1, name: "Advisor" },
        { id: 2, name: "Co-Advisor" },
        { id: 3, name: "Committee 1" },
        { id: 4, name: "Committee 2" }
      ]
    };
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
