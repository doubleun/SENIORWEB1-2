<template>
  <main class="progress-main">
    <div></div>
    <h1>{{ title }}</h1>

    <!-- Work submission alert -->
    <div
      class="my-2 ml-auto"
      style="width: fit-content"
      v-if="progressId !== 10"
    >
      <v-alert type="warning" v-if="showSubmission"
        >No work submitted, please submit before: {{ submitDate }}
      </v-alert>
      <!-- If there are work submission, display submit 'on time' or 'late' accordingly -->
      <div v-else>
        <v-alert type="success" style="width: fit-content" v-if="submitOnTime"
          >Work submitted on time {{ submitDate }}</v-alert
        >
        <v-alert type="error" style="width: fit-content" v-else
          >Work submitted late ({{ submitDate }})</v-alert
        >
      </div>
    </div>

    <!-- Progress card -->
    <v-card class="progress-container">
      <div class="d-flex flex-wrap justify-center" style="width: 100%">
        <v-card-title class="flex-grow-1"> YOUR WORK </v-card-title>
        <!-- Upload size progress bar -->
        <div class="progress-upload-size-bar" v-show="showSubmission">
          <p>Size:</p>
          <v-progress-linear
            rounded
            :color="totalUploadSize.percentage < 80 ? 'success' : 'red'"
            background-color="indigo lighten-5"
            :value="totalUploadSize.percentage"
            :height="10"
          ></v-progress-linear>
          <p>{{ totalUploadSize.stringSize }} / 10MB</p>
        </div>
      </div>

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
          <p>ONLY PDF,DOC,PPT, FILEMAX UPLOAD FILE SIZE 10 MB</p>
        </div>

        <!-- Link text field -->
        <v-form ref="linksForm" class="final-link-container">
          <div v-for="link in availableLinks" :key="link.number">
            <h5 class="font-weight-bold">Link {{ link.number }}</h5>
            <v-text-field
              v-model="link.text"
              :rules="[
                () => !!link.text || 'This field is required',
                () =>
                  !!link.text.match('http') ||
                  'a link must includes http or https',
                () =>
                  !link.text.includes(' ') || 'a link must not contain spcace'
              ]"
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

        <!-- Submitted file dispaly -->
        <div
          class="progress-file-display-container"
          v-show="files.length !== 0"
        >
          <div class="progress-file-display attributes">
            <!-- Table attributes -->
            <p>Name</p>
            <p>Date</p>
            <p v-if="finalDocument">File type</p>
            <p v-else>Status</p>
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
                :data-date="file.date"
                v-if="showSubmission"
                >mdi-close</v-icon
              >
              <v-file-input
                :clearable="false"
                outlined
                dense
                :show-size="showSubmission"
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
              <!-- <v-radio :value="index" :disabled="!showSubmission"></v-radio> -->
              <v-select
                :items="submitTypes"
                :disabled="!showSubmission"
                v-model="file.selectedType"
                @click="handleSaveCurrentVal(file.selectedType)"
                @input="(v) => handleCheckRepeatFileType(v, file, index)"
                outlined
                hide-selected
                dense
              ></v-select>
            </div>
            <p v-else>{{ showSubmission ? 'Not Submitted' : 'Submitted' }}</p>
          </div>
        </div>

        <!-- Turn in button -->
        <v-btn
          class="btn-theme-blue"
          width="max(18rem, 65%)"
          @click="handleUploadAssignment"
          v-if="showSubmission"
          :disabled="!files || files.length === 0"
          >{{ handleChangeSubmitText }}</v-btn
        >
      </div>
    </v-card>
  </main>
</template>

<script>
import utils from '@/mixins/utils'

export default {
  mixins: [utils],
  data() {
    return {
      availableLinks: [],
      files: [],
      // 10485760 byte => 10 Mb
      maxSize: 10485760,
      showSubmission: true,
      uploadSrc: null,
      dropActive: false,
      submitTypes: ['Abstract', 'Document', 'Other'],
      previousSelectedType: '',
      submitDate: '',
      submitOnTime: false
    }
  },
  props: {
    finalDocument: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Work submission'
    },
    progressId: {
      type: Number,
      default: 2
    },
    submittedFiles: {
      type: Array,
      default: () => []
    },
    advisor: {
      type: Object,
      default: () => ({})
    },
    committees: {
      type: Array,
      default: () => []
    },
    progressionDueDate: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // Change submit button text when files array changes
    handleChangeSubmitText() {
      if (this.files.length !== 0) {
        return 'Turn In'
      } else {
        return 'Please, add file(s) to upload'
      }
    },
    totalUploadSize() {
      // Total size in byte
      const totalSize = this.files.reduce(
        (prev, current) => current.file.size + prev,
        0
      )

      // const i = Math.floor( Math.log(size) / Math.log(1024) );
      // const readableSize = ( totalSize / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
      return {
        percentage: ((totalSize / this.maxSize) * 100).toFixed(2),
        byte: totalSize,
        stringSize: this.bytesToSize(totalSize)
      }
    }
  },
  watch: {
    files(val) {
      const latestFile = val.at(-1)
      console.log('latestFile', latestFile)

      // If the latest file alrady have a selected type (like when render after submit files) do not re-set the default type
      if (!latestFile || latestFile?.selectedType) 
        return

      const latestFileIndex = val.findIndex((file) => file === latestFile)
      const selectedType =
        latestFileIndex === 0
          ? 'Abstract'
          : latestFileIndex === 1
          ? 'Document'
          : 'Other'

      const prevObject = this.files.at(latestFileIndex)
      // Use this.$set to make new property "reactive"
      this.$set(prevObject, 'selectedType', selectedType)
    }
  },
  async mounted() {
    // console.log(this.$store.state);
    // console.log(this.submittedFiles);
    // console.log('Advisor: ', this.advisor)
    // console.log('Coms: ', this.committees)

    // Render submitted files on init
    await this.handleRenderSubmittedFiles()
  },
  methods: {
    async handleRenderSubmittedFiles() {
      // Create new date object from progress due date, set by coordinator
      const assignmentDueDate = new Date(this.progressionDueDate.DueDate_End)

      // If there are submitted files, add files into UI
      if (this.submittedFiles.length !== 0) {
        // Create new date object from student submission time
        const assignmentSubmissionDate = new Date(
          this.submittedFiles[0].Submit_Date
        )

        // First we check if work submission date is more than due date, if it is then student submit work late
        if (assignmentSubmissionDate > assignmentDueDate) {
          this.submitOnTime = false
        } else {
          this.submitOnTime = true
        }

        // Format work submission date (according to `assignments` data table)
        this.submitDate = this.formatLocaleDateString(
          assignmentSubmissionDate,
          {
            dateStyle: 'full',
            timeStyle: 'medium'
          }
        )

        // Hide submission buttons
        this.showSubmission = false

        // TODO: Too many loops ??

        // Get only files
        const allFiles = this.submittedFiles
          // Filter all submitted files and only get type of "File" and it's a student's file
          .filter(
            (file) =>
              (file.Type !== 'Link') &&
              [2, 3].includes(file.Group_Role)
          )

        // Get docuemnt and abstractIndex
        const [documentIndex, abstractIndex] = this.handleGetDocumentAbstractIndex(allFiles, 'Type')
        let files = allFiles
          // Then, map each file and send axios get request to fetch the file from static folder in server
          .map(async (file, index) => {
            // Request response type to be 'blob'
            const blob = await this.$axios.$get(
              '/public_senior/uploads/assignments/' + file.File_Name,
              {
                responseType: 'blob'
              }
            )
            return {
              // Convert blob to File object
              file: new File([blob], file.File_Name, { type: blob.type }),
              date: new Date(file.Submit_Date).toLocaleString(),
              // Set file type
              selectedType: index === documentIndex ? 'Document' : index === abstractIndex ? 'Abstract' : 'Other'
            }
          })
        // Since, each loop is a promise, promise.all is needed
        files = await Promise.all(files)
        // Finally, replace files with the submitted ones
        this.files = files

        // Now, links also needs to be put in to the UI
        this.submittedFiles
          // Filter to get only file with type 'Link'
          .filter((file) => file.Type === 'Link')
          // For each link push it into the 'availableLinks' array
          .forEach((file) =>
            this.availableLinks.push({
              // Get the last elememt's number in the array, if null fallback to zero
              number: (this.availableLinks.slice(-1)[0]?.number || 0) + 1,
              text: file.File_Name
            })
          )
      } else {
        // * === If no files submitted, due date will be shown * === //
        // Format work submission date (according to `assignments` data table)
        this.submitDate = this.formatLocaleDateString(assignmentDueDate, {
          dateStyle: 'full',
          timeStyle: 'medium'
        })
      }
    },
    handleCheckRepeatFileType(val, file, index) {
      if (!Array.isArray(this.files)) return
      const allSelectedTypes = this.files
        .filter((v) => v !== file)
        .map((v) => v.selectedType)

      if (allSelectedTypes.includes(val) && val !== 'Other') {
        this.$swal.fire(`You can only submit 1 ${val} file type.`)
        // Needs set time out, or value will not change back
        setTimeout(() => {
          file.selectedType = this.previousSelectedType || 'Other'
        }, 100)
      }

      return
    },
    handleSaveCurrentVal(oldType) {
      //TODO: weird..
      this.previousSelectedType = oldType
    },
    // Toggle file drop down effects
    toggleDropActive() {
      this.dropActive = !this.dropActive
    },
    // Handle upload file popup
    handleBrowseFile(e) {
      if (e?.target.files[0]) {
        //Check if total size (in byte) is exceeded
        if (e.target.files[0].size + this.totalUploadSize.byte > this.maxSize) {
          this.$swal.fire({
            icon: 'error',
            title: 'Large file size',
            text: 'A file size more than total file size 5 MB'
          })
          return
        }

        // Upload using "browse"
        // Get date
        const d = new Date().toLocaleString()

        // Update the files array
        this.files = [...this.files, { file: e.target.files[0], date: d }]
      }
    },
    // Handle drop file
    handleDropFile(e) {
      // console.log(this.totalUploadSize);
      // Toggling the drop effect back to normal
      this.toggleDropActive()

      if (e?.dataTransfer.files[0]) {
        //Check if total size (in byte) is exceeded
        if (
          e.dataTransfer.files[0].size + this.totalUploadSize.byte >
          this.maxSize
        ) {
          this.$swal.fire({
            icon: 'error',
            title: 'Large file size',
            text: 'A file size more than total file size 5 MB'
          })
          return
        }

        // Upload using drag and drop file
        // Get date
        const d = new Date().toLocaleString()

        // Update the files array
        this.files = [...this.files, { file: e.dataTransfer.files[0], date: d }]
      }
    },
    handleRemoveFile(e) {
      this.files = this.files.filter(
        (file) => file.date !== e.target.dataset.date
      )
    },
    addLinkField() {
      this.availableLinks = [
        ...this.availableLinks,
        {
          // Number can be null if the last element is poped, so a fallback of zero is needed
          number: (this.availableLinks.slice(-1)[0]?.number || 0) + 1,
          text: ''
        }
      ]
    },
    removeLinkField() {
      this.availableLinks.pop()
    },
    /**
     * @param files - files array
     * @param customPath - custom object path to get to the file type value
     */
    handleGetDocumentAbstractIndex(files, customPath) {
      if (!Array.isArray(files)) return []
      const path = customPath || 'selectedType'
      const documentIndex = files.findIndex(
        (v) => v[path] === 'Document'
      )
      const abstractIndex = files.findIndex(
        (v) => v[path] === 'Abstract'
      )
      return [documentIndex, abstractIndex]
    },
    // Handle upload assignment
    async handleUploadAssignment() {
      try {
        // Check if user input a link into the form
        const valid = this.$refs.linksForm.validate()
        if (!valid) return

        // Check if there are files to be submitted
        if (!this.files || this.files.length === 0) return

        // Append form data with files
        const formData = new FormData()
        // formData.append("file", this.files[0].file);
        this.files.map((file) => formData.append('files', file.file))

        // Append form data with progress id, group id
        // Progress id is from '_progress.vue' page
        formData.append('Progress_ID', this.progressId)
        formData.append(
          'Group_ID',
          this.$store.state.group.currentUserGroup.Group_ID
        )
        formData.append(
          'Group_Member_ID',
          this.$store.state.group.currentUserGroup.Group_Member_ID
        )
        // formData.append(
        //   "Project_on_term_ID",
        //   this.$store.state.auth.currentUser.projectOnTerm
        // );

        // If it is final document there must be abstract files
        if (this.finalDocument) {
          // Get document and abstract files index
          const [documentIndex, abstractIndex] =
            this.handleGetDocumentAbstractIndex(this.files)

          // If no document or abstract
          if (documentIndex === -1 || abstractIndex === -1) {
            this.$swal.fire(
              'Please select all required file types',
              '',
              'warning'
            )
            return
          }

          // If document file's file type is not pdf, shows error and return
          if (
            this.files[documentIndex].file.type !== 'application/pdf' ||
            this.files[abstractIndex].file.type !== 'application/pdf'
          ) {
            this.$swal.fire({
              title: "Document and abstract file's extension must be pdf",
              text: '',
              icon: 'warning'
            })
            return
          }

          formData.append('documentIndex', documentIndex)
          formData.append('abstractIndex', abstractIndex)
        }

        // Append form data with links, if there are any
        this.availableLinks.length !== 0 &&
          this.availableLinks.map((link) => formData.append('links', link.text))

        // Shows confirm upload file(s) dialog
        this.$swal
          .fire({
            title: `Confirm upload files for ${this.title}`,
            text: "You won't be able to re-upload the files",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm'
          })
          .then(async (result) => {
            try {
              if (result.isConfirmed) {
                // Upload file to server
                const res = await this.$axios.post(
                  '/assignment/uploadAssignments',
                  formData
                )

                if (res.status === 409) {
                  // If the response status is 409 then assignment already submitted (possibly by his teammate)
                  // Update UI
                  await this.$nuxt.refresh()
                  await this.handleRenderSubmittedFiles()
                  return
                } else if (res.status !== 200) {
                  // If the response status is not 200 and axios has not thrown an error, this'll throw new error
                  throw new Error(
                    'Failed to upload file, please try again later.'
                  )
                }

                // Update the UI
                this.showSubmission = false

                // Check if work submission date is more than due date, if it is then student submit work late
                const submitTimeStamp = new Date()
                if (
                  submitTimeStamp >
                  new Date(this.progressionDueDate.DueDate_End)
                ) {
                  this.submitOnTime = false
                } else {
                  this.submitOnTime = true
                }

                this.submitDate = this.formatLocaleDateString(submitTimeStamp, {
                  dateStyle: 'full',
                  timeStyle: 'medium'
                })

                // Showing upload succeed
                this.$swal.fire({ title: 'Files uploaded', icon: 'success' })
                return
              } else {
                return
              }
            } catch (err) {
              console.error(err)
              return
            }
          })
      } catch (err) {
        console.error(err)
        return
      }
    },
    handleDownloadSubmittedFile(fileIndex) {
      // Show submission is on this function will not run
      if (this.showSubmission) return

      // Create new blob from file
      const blob = new Blob([this.files[fileIndex].file], {
        type: this.files[fileIndex].file.type
      })
      // Attach new 'a' tag element to DOM
      const link = document.createElement('a')
      // Create object string
      link.href = URL.createObjectURL(blob)
      // Download with the file name
      link.download = this.files[fileIndex].file.name
      link.click()
      // Revoke element from DOM
      URL.revokeObjectURL(link.href)

      // Down here is use for open up in new page
      // // window.open(
      // //   "/api/uploads/assignments/" + this.files[fileIndex].file.name,
      // //   "_blank"
      // // );
    }
  }
}
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
.progress-file-type div.v-radio {
  justify-content: center;
  margin-bottom: 16px;
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

/* Progress upload bar */
.progress-upload-size-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 40%;
}
.progress-upload-size-bar p {
  flex-shrink: 0;
  font-size: clamp(11px, 2vw, 14px);
  width: fit-content;
  color: gray;
  margin: 0;
}

/* Files grid display small */
@media only screen and (max-width: 768px) {
  .progress-file-display-container {
    width: 100%;
    margin-block-start: 0.2rem;
  }
  .progress-file-display {
    display: grid;
    grid-template-columns: 40% 25% 35%;
    gap: 2px;
    align-items: center;
    text-align: center;
    font-size: clamp(12px, 2vw, 14px);
  }
  .progress-upload-size-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 50%;
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
