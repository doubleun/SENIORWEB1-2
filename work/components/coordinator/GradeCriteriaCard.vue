<template>
  <v-card class="grade-criteria-card">
    <v-card-title>
      <h4>Grade Criteria</h4>
      <!-- <v-text-field
        label="Search"
        outlined
        dense
        hide-details
        class="grade-criteria-search"
      ></v-text-field> -->
    </v-card-title>

    <!-- Grade criteria table -->
    <div class="grade-criteria-content">
      <!-- Table attr -->
      <h4>GRADE</h4>
      <h4>PASS</h4>
      <!-- <h4>HIGH</h4> -->
      <!-- <h4>TOTAL</h4> -->

      <!-- Table records -->
      <template v-for="grade in gradeCriterias">
        <p :key="grade.Grade_Criteria_ID || grade.Grade_Criteria_Name + 1">
          {{ grade.Grade_Criteria_Name }}
        </p>
        <p :key="grade.Grade_Criteria_ID || grade.Grade_Criteria_Name + 2">
          {{ grade.Grade_Criteria_Pass }}
        </p>
        <!-- <p :key="grade.grade + 3">{{ grade.high }}</p> -->
        <!-- <p :key="grade.grade + 3">{{ grade.total }}</p> -->
      </template>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    gradeCriterias: Array
  }
};
</script>

<style>
.grade-criteria-card {
  padding: 0.4rem 1.4rem 1rem;
}
.grade-criteria-card .v-card__title {
  display: flex;
  padding: 1rem;
}
.grade-criteria-card .v-card__title h4:first-child {
  flex: 1;
}

/* Grade criteria content (table) */
.grade-criteria-content p {
  margin: 0;
}
.grade-criteria-content {
  display: grid;
  grid-template-columns: repeat(2, auto);
  overflow-x: auto;
  text-align: center;
  align-items: center;
  padding: 1rem 1rem 2rem;
  gap: 2rem 1rem;
}
.grade-criteria-search {
  max-width: 300px;
}

@media only screen and (max-width: 600px) {
  .grade-criteria-card .v-card__title {
    display: flex;
    padding: 0;
  }
  .grade-criteria-card .v-card__title h4 {
    font-size: 18px;
  }
  .grade-criteria-content {
    display: grid;
    grid-template-columns: repeat(2, auto);
    overflow-x: auto;
    margin-block-start: 1rem;
    text-align: center;
    align-items: center;
    gap: 0.8rem 0.5rem;
    font-size: 14px;
  }
  .grade-criteria-content .v-btn__content {
    font-size: 12px;
  }
  .grade-criteria-search {
    max-width: 120px;
  }
}
</style>
