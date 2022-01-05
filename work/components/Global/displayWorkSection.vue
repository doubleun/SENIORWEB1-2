<template>
  <div class="display-work-container">
    <!-- (Left-side)Preview file -->
    <v-card class="preview-work-card">
      <!-- Switch file preview tabs -->
      <v-tabs show-arrows dark background-color="primary">
        <v-tab
          v-for="(file, index) in files"
          :key="index"
          @click="handleChangeFilePreview(index)"
          >{{ file.file.name }}</v-tab
        >
      </v-tabs>
      <div :style="selectedFile ? 'display: unset' : 'display: none'">
        <embed :src="selectedFile.src" class="preview-work-card-content" />
      </div>
    </v-card>

    <!-- (Right-side) Work score and comment -->
    <v-card class="task-work-card-container">
      <v-card-title style="padding: 1rem 1rem 0">TASK WORK</v-card-title>
      <div class="task-work-card-content">
        <h5>File option</h5>
        <v-btn
          color="primary"
          style="margin: 0.2rem 0 1rem 0"
          @click="handleDownloadFile"
          >Download</v-btn
        >

        <div v-show="links.length !== 0">
          <h5>Links</h5>
          <a
            :href="link.File_Name"
            target="_blank"
            v-for="(link, index) in links"
            :key="index"
            >{{ "Link " + (index + 1) }}</a
          >
        </div>

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
  props: {
    progressId: {
      type: Number,
      default: 1
    },
    submittedFiles: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      selectScores: [1, 2, 3, 4, 5],
      uploadFile: { type: "" },
      uploadSrcs: [],
      files: [],
      links: [],
      selectedFile: { src: "" }
    };
  },
  async mounted() {
    // If there are submitted files get them from static folder
    if (this.submittedFiles.length !== 0) {
      console.log(this.submittedFiles);
      // Get all submitted files as file object
      let files = this.submittedFiles
        // Filter all submitted files and only get type of "File"
        .filter(file => file.Type === "File")
        // Then, map each file and send axios get request to fetch the file from static folder in server
        .map(async file => {
          // Request response type to be 'blob'
          const blob = await this.$axios.$get(
            "/uploads/assignments/" + encodeURIComponent(file.File_Name),
            {
              "Content-Type": "application/json;charset=utf-8",
              responseType: "blob"
            }
          );
          return {
            // Convert blob to File object
            file: new File([blob], file.File_Name, { type: blob.type }),
            date: new Date(file.Submit_Date).toLocaleString()
          };
        });
      // Since, each loop is a promise, promise.all is needed
      this.files = await Promise.all(files);
    }

    // Create object string on all files
    this.files.forEach(file => {
      this.uploadSrcs.push(URL.createObjectURL(file.file));
    });
    // Sets initial selected src
    this.selectedFile = { src: this.uploadSrcs[0], index: 0 };

    // Set links array
    this.links = this.submittedFiles.filter(file => file.Type === "Link");
  },
  beforeDestroy() {
    // Clean up
    this.uploadSrcs.forEach(src => URL.revokeObjectURL(src));
  },
  methods: {
    handleChangeFilePreview(fileIndex) {
      this.selectedFile = { src: this.uploadSrcs[fileIndex], index: fileIndex };
    },
    handleDownloadFile() {
      // If no files, return
      if (this.submittedFiles.length < 1) return;

      // Attach new 'a' tag element to DOM
      const link = document.createElement("a");
      // Create link from selected object string
      link.href = this.selectedFile.src;
      // Download with the file name
      link.download = this.files[this.selectedFile.index].file.name;
      link.click();
      // Revoke element from DOM
      URL.revokeObjectURL(link.href);
    }
  }
};
</script>

<style>
/* Display work */
.display-work-container {
  margin-block-start: 4rem;
  padding-block-end: 2rem;
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
