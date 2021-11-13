<template>
  <div class="display-work-container">
    <!-- (Right-side)Preview file -->
    <v-card class="preview-work-card">
      <div :style="uploadSrc ? 'display: unset' : 'display: none'">
        <!-- <img
          :src="uploadSrc"
          class="preview-work-card-content"
          v-if="
            uploadFile.type === 'image/jpeg' || uploadFile.type === 'image/png'
          "
        /> -->
        <embed :src="uploadSrc" class="preview-work-card-content" />
      </div>
    </v-card>

    <!-- (Left-side) Work score and comment -->
    <v-card class="task-work-card-container">
      <v-card-title style="padding: 1rem 1rem 0">TASK WORK</v-card-title>
      <div class="task-work-card-content">
        <h5>Document</h5>
        <v-file-input
          :clearable="false"
          outlined
          hide-details
          dense
          show-size
          prepend-icon=""
          v-model="uploadFile"
          @change="handleUploadFilePreview"
        ></v-file-input>

        <h5>Score</h5>
        <v-select :items="selectScores" dense outlined></v-select>

        <h5>Comment</h5>
        <v-textarea auto-grow outlined rows="4" row-height="30"></v-textarea>

        <h5>Upload File</h5>
        <v-file-input
          :clearable="false"
          outlined
          hide-details
          dense
          show-size
          prepend-icon=""
        ></v-file-input>

        <v-btn color="primary">SUBMIT</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectScores: [1, 2, 3, 4, 5],
      uploadFile: { type: "" },
      uploadSrc: null
    };
  },
  methods: {
    handleUploadFilePreview() {
      // If no file, return
      if (!this.uploadFile) return;

      // Clean up old preview
      if (this.uploadSrc) URL.revokeObjectURL(this.uploadSrc);

      this.uploadSrc = URL.createObjectURL(this.uploadFile);
    }
  }
};
</script>

<style>
/* Display work */
.display-work-container {
  margin-block-start: 4rem;
  display: flex;
  flex-wrap: wrap;
}

/* Preview */
.preview-work-card {
  width: 75%;
}
.preview-work-card-content {
  width: 100%;
  height: 100%;
}
.preview-work-card-content img {
  width: 100%;
  height: auto;
}

/* Task work card */
.task-work-card-container {
  width: 25%;
}
.task-work-card-content {
  padding: 1rem 1rem;
}
.task-work-card-content > button {
  margin: 2rem 0 1rem;
  width: 100%;
}

@media only screen and (max-width: 600px) {
  .preview-work-card {
    width: 100%;
    height: 24rem;
  }
  .task-work-card-container {
    margin-block-start: 1rem;
    width: 100%;
  }
}
</style>
