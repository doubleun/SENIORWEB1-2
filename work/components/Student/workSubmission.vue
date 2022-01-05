<template>
  <main class="progress-main">
    <h1>{{ title }}</h1>

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
          v-if="showSubmission"
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
              @change="handleBrowseFile"
            />
          </p>
          <p>ONLY PDF,DOC,PPT, FILEMAX UPLOAD FILE SIZE 2 MB</p>
        </div>

        <!-- Link text field -->
        <v-form ref="linksForm" class="final-link-container">
          <div v-for="link in availableLinks" :key="link.number">
            <h5 class="font-weight-bold">Link {{ link.number }}</h5>
            <v-text-field
              v-model="link.text"
              :rules="[() => !!link.text || 'This field is required']"
              required
              placeholder="Submit link"
              outlined
              :disabled="!showSubmission"
              dense
            >
            </v-text-field>
          </div>
        </v-form>
        <!-- Add submission link -->
        <div class="mb-5 d-flex" style="gap: 1.8rem" v-if="showSubmission">
          <a
            class="text-decoration-underline"
            @click="addLinkField"
            v-show="this.availableLinks.length < 4"
            >+ Add Link</a
          >
          <a
            class="text-decoration-underline"
            @click="removeLinkField"
            v-show="this.availableLinks.length > 0"
            >- Remove Link</a
          >
        </div>

        <!-- Turn in button -->
        <v-btn
          class="btn-theme-blue"
          width="max(18rem, 65%)"
          @click="handleUploadAssignment"
          v-if="showSubmission"
          >{{ handleChangeSubmitText }}</v-btn
        >

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
              <v-icon
                @click="handleRemoveFile"
                :data-date="file.Submit_Date"
                v-if="showSubmission"
                >mdi-close</v-icon
              >
              <v-file-input
                :clearable="false"
                outlined
                dense
                prepend-icon=""
                class="progress-file-input"
                @click.prevent="handleDownloadSubmittedFile(index)"
                :value="file.file"
              ></v-file-input>
            </div>
            <p>
              {{ file.date }}
            </p>

            <!-- If type is needed it'll be display here, otherwise it's a status -->
            <div class="progress-file-type" v-if="finalDocument">
              <v-combobox
                :items="submitTypes"
                outlined
                dense
                disable-lookup
              ></v-combobox>
            </div>
            <p v-else>{{ showSubmission ? "Not Submitted" : "Submitted" }}</p>
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
      availableLinks: [],
      files: [],
      showSubmission: true,
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
    },
    title: {
      type: String,
      default: "Work submission"
    },
    progressId: {
      type: Number,
      default: 8
    },
    submittedFiles: {
      type: Array,
      default: []
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
  async mounted() {
    // If there are submitted files, add files into UI
    if (this.submittedFiles.length !== 0) {
      // Hide submission buttons
      this.showSubmission = false;

      let files = this.submittedFiles
        // Filter all submitted files and only get type of "File"
        .filter(file => file.Type === "File")
        // Then, map each file and send axios get request to fetch the file from static folder in server
        .map(async file => {
          // Request response type to be 'blob'
          const blob = await this.$axios.$get(
            "/uploads/assignments/" + file.File_Name,
            {
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
      files = await Promise.all(files);
      // Finally, replace files with the submitted ones
      this.files = files;

      // Now, links also needs to be put in to the UI
      this.submittedFiles
        // Filter to get only file with type 'Link'
        .filter(file => file.Type === "Link")
        // For each link push it into the 'availableLinks' array
        .forEach(file =>
          this.availableLinks.push({
            // Get the last elememt's number in the array, if null fallback to zero
            number: (this.availableLinks.slice(-1)[0]?.number || 0) + 1,
            text: file.File_Name
          })
        );
    }
  },
  methods: {
    toggleDropActive() {
      this.dropActive = !this.dropActive;
    },
    handleBrowseFile(e) {
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
    },
    addLinkField() {
      this.availableLinks = [
        ...this.availableLinks,
        {
          // Number can be null if the last element is poped, so a fallback of zero is needed
          number: (this.availableLinks.slice(-1)[0]?.number || 0) + 1,
          text: ""
        }
      ];
    },
    removeLinkField() {
      this.availableLinks.pop();
    },
    async handleUploadAssignment() {
      //TODO: Validate file input (file type, file size)
      //TODO: Cap file size
      //TODO: Check allowed file types
      // TODO: Show total files size ??
      // Check if user input a link into the form
      const valid = this.$refs.linksForm.validate();
      if (!valid) return;

      // Append form data with files
      const formData = new FormData();
      // formData.append("file", this.files[0].file);
      this.files.map(file => formData.append("files", file.file));

      // Append form data with progress id, group id
      // Progress id is from '_progress.vue' page
      formData.append("Progress_ID", this.progressId);
      formData.append(
        "Group_ID",
        this.$store.state.group.currentUserGroup.Group_ID
      );

      // Append form data with links, if there are any
      this.availableLinks.length !== 0 &&
        this.availableLinks.map(link => formData.append("links", link.text));

      // // console.log(this.availableLinks);
      // // console.log("Progress_ID: ", this.progressId);
      // // console.log(this.files);
      // // console.log(
      // //   "Group_ID: ",
      // //   this.$store.state.group.currentUserGroup.Group_ID
      // // );

      const res = await this.$axios.$post(
        "/assignment/uploadAssignments",
        formData
      );

      if (res.status === 200) {
        // Update the UI
        this.showSubmission = false;
      }
    },
    handleDownloadSubmittedFile(fileIndex) {
      // Show submission is on this function will not run
      if (this.showSubmission) return;

      // Create new blob from file
      const blob = new Blob([this.files[fileIndex].file], {
        type: this.files[fileIndex].file.type
      });
      // Attach new 'a' tag element to DOM
      const link = document.createElement("a");
      // Create object string
      link.href = URL.createObjectURL(blob);
      // Download with the file name
      link.download = this.files[fileIndex].file.name;
      link.click();
      // Revoke element from DOM
      URL.revokeObjectURL(link.href);

      // Down here is use for open up in new page
      // // window.open(
      // //   "/api/uploads/assignments/" + this.files[fileIndex].file.name,
      // //   "_blank"
      // // );
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
.progress-main > h1 {
  text-transform: capitalize;
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
/* .progress-file-display-container.submitted {
  display: flex;
  flex-direction: column;
  gap: 1rem;
} */
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
/* .progress-file-input-container.submitted {
  display: flex;
  border: 1.25px solid rgba(0, 0, 0, 0.38);
  padding: 0, 12px;
  border-radius: 8px;
  cursor: pointer;
}
.progress-file-input-container.submitted > p {
  margin: 0;
  padding: 10px;
  font-size: clamp(12px, 2vw, 16px);
} */

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
