<template>
  <div class="display-work-container">
    <!-- (Right-side)Preview file -->
    
      <v-card class="preview-work-card ">
        <v-toolbar-title left style="padding: 1rem 1rem 0"
          >{{uploadFile}}</v-toolbar-title
        >
        
        <v-tabs right>
          <v-tab>PDF</v-tab>
          <v-tab>Document</v-tab>
        </v-tabs>
        <br />
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
      <v-card-title>TASK WORK</v-card-title>
      <div class="task-work-card-content">
        <h4>Score</h4>
        <div>
          <h5>
            1.There is an evident advancement from Senior Project 1<v-select
              :items="selectScores"
              dense
              outlined
            ></v-select>
          </h5>
        </div>
        <div>
          <h5>
            2.The students present and answer questions properly<v-select
              :items="selectScores"
              dense
              outlined
            ></v-select>
          </h5>
        </div>
        <div>
          <h5>
            3.There are good teamwork and job division (for group project) or a
            students plans his/her work properly (for individual
            project)<v-select :items="selectScores" dense outlined></v-select>
          </h5>
        </div>
        <div>
          <h5>
            4.The students can research how to solve the problems and are able
            technologies and tools by themselves<v-select
              :items="selectScores"
              dense
              outlined
            ></v-select>
          </h5>
        </div>
        <div>
          <h5>
            5.The current progress reaches 40%<v-select
              :items="selectScores"
              dense
              outlined
            ></v-select>
          </h5>
        </div>
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
          v-model="uploadFile"
          @change="handleUploadFilePreview"
        ></v-file-input>
      </div>
    </v-card>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectScores: [1, 2, 3, 4, 5],
      uploadFile:  "namefile",
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
  width: 60%;
}
.preview-work-card-content {
  width: 80%;
  height: 80%;
}
.preview-work-card-content img {
  width: 100%;
  height: auto;
}

/* Task work card */
.task-work-card-container {
  width:40%;
}
.task-work-card-content {
  padding: 1rem 1rem;
}
.v-select {
  width: 40px;
  height: auto;
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
