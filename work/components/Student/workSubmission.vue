<template>
  <main class="progress-main">
    <h1>Progress 1</h1>

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

        <!-- Link text field -->
        <div class="final-link-container">
          <h4>
            Link
          </h4>
          <v-text-field
            label="Submit link"
            placeholder=""
            dense
            outlined
          ></v-text-field>
        </div>

        <!-- Turn in button -->
        <v-btn class="btn-theme-blue" width="max(18rem, 65%)">{{
          handleChangeSubmitText
        }}</v-btn>

        <!-- Submitted file dispaly -->
        <div
          class="progress-file-display-container"
          v-show="files.length !== 0"
        >
          <div class="progress-file-display attributes">
            <!-- Table attributes -->
            <p>Name</p>
            <p>Date</p>
            <p>Type</p>
          </div>

          <!-- Table instance(s) -->
          <div
            class="progress-file-display"
            v-for="(file, index) in files"
            :key="index"
          >
            <div class="progress-file-input-container">
              <v-icon @click="handleRemoveFile" :data-date="file.date"
                >mdi-close</v-icon
              >
              <v-file-input
                :clearable="false"
                outlined
                dense
                show-size
                prepend-icon=""
                class="progress-file-input"
                @click.prevent
                :value="file.file"
              ></v-file-input>
            </div>
            <p>{{ file.date }}</p>

            <!-- If type is needed it'll be display here, otherwise it's a status -->
            <p v-show="!finalDocument">Not Submitted</p>
            <div class="progress-file-type" v-if="finalDocument">
              <v-combobox
                :items="submitTypes"
                outlined
                dense
                disable-lookup
              ></v-combobox>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </main>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      uploadSrc: null,
      dropActive: false,
      submitBtn: "Mark as done",
      submitTypes: ["Abstract", "Document"]
    };
  },
  props: {
    finalDocument: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // Change submit button text when files array changes
    handleChangeSubmitText() {
      if (this.files.length !== 0) {
        return "Turn In";
      } else {
        return "Mark as done";
      }
    }
  },
  methods: {
    toggleDropActive() {
      this.dropActive = !this.dropActive;
    },
    handleUpload(e) {
      if (e?.target.files[0]) {
        // Upload using "browse"
        // Get date
        const d = new Date().toLocaleString();

        // Update the files array
        this.files = [...this.files, { file: e.target.files[0], date: d }];
      }
    },
    handleDropFile(e) {
      // Toggling the drop effect back to normal
      this.toggleDropActive();

      if (e?.dataTransfer.files[0]) {
        // Upload using drag and drop file
        // Get date
        const d = new Date().toLocaleString();

        // Update the files array
        this.files = [
          ...this.files,
          { file: e.dataTransfer.files[0], date: d }
        ];
      }
    },
    handleRemoveFile(e) {
      this.files = this.files.filter(
        file => file.date !== e.target.dataset.date
      );
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
  padding: 1rem 1rem 2rem;
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

/* Link field  */
.final-link-container {
  width: max(18rem, 65%);
}
.final-link-container > h4:first-child {
  margin-block-end: 0.4rem;
}

/* Files grid display */
.progress-file-display-container {
  width: max(18rem, 65%);
  margin-block-start: 2rem;
}
.progress-file-display.attributes {
  font-size: clamp(14px, 2vw, 16px);
}
.progress-file-display {
  display: grid;
  grid-template-columns: 60% 20% 20%;
  gap: 10px;
  align-items: center;
  text-align: center;
  font-size: clamp(12px, 2vw, 14px);
}
.progress-file-display-container .v-file-input__text,
.progress-file-display-container input {
  cursor: default;
  font-size: clamp(12px, 2vw, 16px);
}
.progress-file-input-container {
  display: flex;
}
.progress-file-input-container > button {
  cursor: pointer;
  font-size: clamp(28px, 2vw, 32px) !important;
  color: red !important;
  display: inline-block !important;
  height: fit-content !important;
}

/* Files grid display small */
@media only screen and (max-width: 768px) {
  .progress-file-display-container {
    width: 100%;
    margin-block-start: 1.4rem;
  }
  .progress-file-display {
    display: grid;
    grid-template-columns: 40% 25% 35%;
    gap: 2px;
    align-items: center;
    text-align: center;
    font-size: clamp(12px, 2vw, 14px);
  }
}

/* Preview */
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
