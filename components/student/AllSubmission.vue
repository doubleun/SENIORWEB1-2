<template>
  <main class="all-progress-main">
    <h1>{{ title }}</h1>

    <!-- Progress card -->
    <v-card class="all-progress-container">
      <v-card-title>ALL SUBMISSIONS</v-card-title>
    </v-card>

    <v-card style="margin-block-start: 2rem">
      <!-- Card content (flex container) -->
      <div class="all-progress-flex">
        <!-- Submitted file dispaly -->
        <div class="all-progress-file-display-container">
          <div class="all-progress-file-display attributes">
            <!-- Table attributes -->
            <p>Name</p>
            <p>Date</p>
            <p>Status</p>
          </div>

          <!-- Table instance(s) -->
          <nuxt-link
            to="/Senior1/Student/progress1-submission"
            tag="div"
            class="all-progress-file-display"
            id="grid-instance"
            v-for="(file, index) in files"
            :key="index"
          >
            <v-file-input
              :clearable="false"
              disabled
              outlined
              hide-details
              dense
              show-size
              prepend-icon=""
              class="all-progress-file-input"
              @click.prevent
            ></v-file-input>
            <p>{{ file.date }}</p>
            <p>Not submitted</p>
          </nuxt-link>

          <!--//! For testing final doc (REMOVE THIS) !//-->
          <!-- Table instance(s) -->
          <nuxt-link
            to="/Senior1/Student/final-document-submission"
            tag="div"
            class="all-progress-file-display"
            id="grid-instance"
          >
            <v-file-input
              :clearable="false"
              disabled
              outlined
              hide-details
              dense
              show-size
              prepend-icon=""
              class="all-progress-file-input"
              @click.prevent
            ></v-file-input>
            <p>FINAL DOC TEST</p>
            <p>Not submitted</p>
          </nuxt-link>
        </div>

        <!-- Preview file -->
        <!-- <div
          class="progress-preview-container"
          :style="uploadSrc ? 'display: unset' : 'display: none'"
        >
          <v-card-title>Preview</v-card-title>
          <embed :src="uploadSrc" class="progress-file-preview" />
        </div> -->
      </div>
    </v-card>
  </main>
</template>

<script>
export default {
  data() {
    return {
      files: [{ date: "test" }, { date: "test2" }]
    };
  },
  props: ["title"]
};
</script>

<style>
/* Theme */
.btn-theme-blue {
  background-color: #253b6e !important;
  color: white !important;
}

/* Layout */
.all-progress-main {
  margin-block-start: 1rem;
}
.all-progress-container {
  margin-block-start: 1rem;
  padding: 1rem;
}
.all-progress-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Files grid display */
.all-progress-file-display-container {
  width: 90%;
  padding-block-start: 1rem;
}

.all-progress-file-display.attributes {
  font-size: clamp(14px, 2vw, 16px);
}
.all-progress-file-display {
  display: grid;
  grid-template-columns: 50% 25% 25%;
  align-items: center;
  text-align: center;
  font-size: clamp(12px, 2vw, 14px);
}
.all-progress-file-display#grid-instance {
  cursor: pointer;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  margin-block-end: 1rem;
  padding-block: 0.5rem;
}
.all-progress-file-display#grid-instance * {
  margin: 0;
}
.all-progress-file-display .v-file-input__text {
  font-size: clamp(12px, 2vw, 16px);
  border: none !important;
}
/* Remove border from file-input field */
.all-progress-file-input * {
  border: none !important;
}
</style>
