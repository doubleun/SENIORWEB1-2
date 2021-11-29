<template>
  <div class="display-work-container">
    <!-- (Right-side)Preview file -->

    <v-card class="preview-work-card ">
      <v-toolbar>
        <template v-slot:extension>
          <v-tabs v-model="tabs" right>
            <v-tab v-for="n in 1" :key="n">PDF</v-tab>
            <v-tab v-for="n in 1" :key="n">DOCUMENT</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <div :style="uploadSrc ? 'display: unset' : 'display: none'">
                <embed :src="uploadSrc" class="preview-work-card-content" />
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <!-- Submitted file dispaly -->
              <div
                class="progress-file-display-container"
                v-show="files.length !== 0"
              >
                <div class="progress-file-display attributes">
                  <!-- Table attributes -->
                  <p>Name</p>
                  <p>Date</p>
                  <p>Status</p>
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
                  <p v-show="!finalDocument">Turn in</p>
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
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <!-- (Left-side) Work score and comment -->

    <v-card class="task-work-card-container">
      <v-card-title style="padding: 1rem 5rem 0rem  ">TASK WORK</v-card-title>
      <div class="task-work-card-content">
        <h3>Score</h3>
        <br />
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
        <!--Tab PDF-->
        <h5>PDF</h5>
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
        <br />

        <!--Tab Document-->
        <h5>Document</h5>
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
            <label for="fileBrowse">Choose File</label>
            <input
              type="file"
              id="fileBrowse"
              accept="*"
              style="display: none"
              @change="handleUpload"
            />
          </p>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      selectScores: [1, 2, 3, 4, 5],
      uploadSrc: null,
      dropActive: false,
      tabs: null,
      uploadFile: { type: "" },
      uploadSrc: null
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
    handleUploadFilePreview() {
      // If no file, return
      if (!this.uploadFile) return;

      // Clean up old preview
      if (this.uploadSrc) URL.revokeObjectURL(this.uploadSrc);

      this.uploadSrc = URL.createObjectURL(this.uploadFile);
    },
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
  width: 40%;
}
.task-work-card-content {
  padding: 1rem 1rem;
}
.v-select {
  height: auto;
}
.progress-drop-zone {
  width: 10%;
  height: 15%;
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
