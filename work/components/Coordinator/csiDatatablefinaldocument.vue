<template>
  <v-card class="progress-criteria-card">
    <v-card-title>
      <h4>Final Documentation</h4>
    </v-card-title>

    <!-- Grade criteria table -->
    <div class="progress-criteria-content">
      <!-- Table attr -->
      <h4>TOPIC</h4>
      <h4>ADVISOR</h4>
      <h4>COMMITTEE1</h4>
      <h4>COMMITTEE2</h4>

      <!-- Table records -->
      <template v-for="progress in progressCriteriaArr">
        <p :key="progress.progress + 1" align="left">{{ progress.progress }}</p>
        <p :key="progress.progress + 2" align="left">{{ progress.advisor }}</p>
        <p :key="progress.progress + 3" align="left">{{ progress.committee1 }}</p>
        <p :key="progress.progress + 4" align="left">{{ progress.committee2 }}</p>
      </template>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      progressCriteriaArr: [
        {
          progress: "There is an evident advancement from Senior Project 1",
          advisor: 5,
          committee1: 5,
          committee2: 5
        },
        {
          progress: "The student present and answer questions properly",
          advisor: 5,
          committee1: 5,
          committee2: 5
        },
        {
          progress: "There are good teamwork and job division(for group project) or a student  plans his/her work properly (for individual project)",
          advisor: 5,
          committee1: 5,
          committee2: 5
        },
        {
          progress: "The student can research how to solve the problems and are able to student new or required technnologies and tools by themselves",
          advisor: 5,
          committee1: 5,
          committee2: 5
        },
        {
          progress: "The current progress reaches 40%",
          advisor: 5,
          committee1: 5,
          committee2: 5
        },
      ]
    };
  }
};
</script>

<style>
.progress-criteria-card {
  padding: 0.4rem 1.4rem 1rem;
}
.progress-criteria-card .v-card__title {
  display: flex;
  padding: 1rem;
}
.progress-criteria-card .v-card__title h4:first-child {
  flex: 1;
}

/* progress criteria content (table) */
.progress-criteria-content p {
  margin: 0;
}
.progress-criteria-content {
  display: grid;
  grid-template-columns: repeat(4, auto);
  overflow-x: auto;
  text-align: center;
  align-items: center;
  padding: 1rem 1rem 2rem;
  gap: 2rem 1rem;
}
.progress-criteria-search {
  max-width: 300px;
}

@media only screen and (max-width: 600px) {
  .progress-criteria-card .v-card__title {
    display: flex;
    padding: 0;
  }
  .progress-criteria-card .v-card__title h4 {
    font-size: 18px;
  }
  .progress-criteria-content {
    display: grid;
    grid-template-columns: repeat(4, auto);
    overflow-x: auto;
    margin-block-start: 1rem;
    text-align: center;
    align-items: center;
    gap: 0.8rem 0.5rem;
    font-size: 14px;
  }
  .progress-criteria-content .v-btn__content {
    font-size: 12px;
  }
  .progress-criteria-search {
    max-width: 120px;
  }
}
</style>
