<template>
  <main class="progress-main">
    <h1>Progress 2</h1>

    <!-- Progress card -->
    <v-card class="progress-container">
      <v-card-title>YOUR WORK</v-card-title>

      <!-- Card content (flex container) -->
      <div class="progress-flex">
        <!-- Drop file zone -->
        <div
          @dragenter.prevent="toggleDropActive"
          @dragleave.prevent="toggleDropActive"
          @drop.prevent="handleDropFile"
          @dragover.prevent
          :class="{ 'active-progress-dropzone': dropActive }"
          class="progress-drop-zone"
        >
          <v-icon class="material-icons" style="color: #253b6e"
            >cloud_upload</v-icon
          >
          <p>
            Drop files to upload or
            <label for="fileBrowse">browse</label>
            <input
              type="file"
              id="fileBrowse"
              accept="*"
              style="display: none"
              @change="handleUpload"
            />
          </p>
          <p>ONLY PDF,DOC,PPT, FILEMAX UPLOAD FILE SIZE 2 MB</p>
        </div>

        <!-- Turn in button -->
        <v-btn class="btn-theme-blue" width="max(18rem, 65%)">{{
          submitBtn
        }}</v-btn>

        <!-- Submitted file dispaly -->
        <div class="progress-file-display">
          <!-- First row -->
          <p>Name</p>
          <p>Date</p>
          <p>Status</p>

          <!-- Second row -->
          <v-file-input
            label="File input"
            outlined
            dense
            show-size
            chips
            prepend-icon="upload_file"
            class="progress-file-input"
            @change="handleUpload"
            v-model="file"
          ></v-file-input>
          <p>16/10/2021 11:52</p>
          <p>No attempt</p>
        </div>

        <!-- Preview file -->
        <div
          class="progress-preview-container"
          :style="uploadSrc ? 'display: unset' : 'display: none'"
        >
          <v-card-title>Preview</v-card-title>
          <embed :src="uploadSrc" class="progress-file-preview" />
        </div>
      </div>
    </v-card>
  </main>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      uploadSrc: null,
      dropActive: false,
      submitBtn: "Mark as done"
    };
  },
  methods: {
    toggleDropActive() {
      this.dropActive = !this.dropActive;
    },
    handleUpload(e) {
      if (this.file) {
        // Upload using "v-file-input"
        const src = URL.createObjectURL(this.file);
        this.uploadSrc = src;
        this.submitBtn = "Turn In";
      } else if (e?.target.files[0]) {
        // Upload usgin "browse"
        this.file = e.target.files[0];
        console.log(this.file);
        const src = URL.createObjectURL(this.file);
        this.uploadSrc = src;
        this.submitBtn = "Turn In";
      } else {
        // When remove upload file
        this.uploadSrc = null;
        this.submitBtn = "Mark as done";
      }
    },
    handleDropFile(e) {
      this.toggleDropActive();
      if (e.dataTransfer.files[0]) {
        this.file = e.dataTransfer.files[0];
        const src = URL.createObjectURL(this.file);
        this.uploadSrc = src;
        this.submitBtn = "Turn In";
      } else {
        this.uploadSrc = null;
        this.submitBtn = "Mark as done";
      }
    }
  }
};
</script>

<style>
/* Theme */
.btn-theme-blue {
  background-color: #253b6e !important;
  color: white !important;
}

/* Layout */
.progress-main {
  margin-block-start: 1rem;
}
.progress-container {
  margin-block-start: 1rem;
  margin-block-end: 2rem;
  padding: 1rem;
}
.progress-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Dropzone */
.progress-drop-zone {
  background-color: #e4e4e4;
  text-align: center;
  width: max(18rem, 65%);
  padding-inline: min(8rem, 10%);
  padding-block: 2rem;
  border: 1px dashed rgb(75, 75, 114);
  margin-block-end: 2rem;
}
.progress-drop-zone > i {
  font-size: 3rem !important;
}
.progress-drop-zone > p {
  font-size: 14px;
  color: gray;
  margin: 0;
}
.progress-drop-zone label {
  color: blue;
  cursor: pointer;
}

/* Dropzone active */
.active-progress-dropzone {
  color: #fff;
  border-color: #fff;
  background-color: #253b6e;
}
.active-progress-dropzone > i {
  color: white !important;
}
.active-progress-dropzone > p {
  color: rgb(180, 180, 180);
}
.active-progress-dropzone label {
  color: white;
}

.progress-file-display {
  width: max(18rem, 65%);
  margin-block-start: 2rem;
  display: grid;
  grid-template-columns: 65% 20% 20%;
  align-items: center;
  text-align: center;
  font-size: clamp(12px, 2vw, 18px);
}
.progress-file-input {
  padding-right: 1rem !important;
}
.progress-preview-container {
  width: 100%;
  text-align: center;
}
.progress-file-preview {
  width: 80%;
  height: 30rem;
  max-height: 40rem;
}
</style>
