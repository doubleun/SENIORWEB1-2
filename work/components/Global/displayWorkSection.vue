<template>
  <div class="display-work-container">
    <!-- (Left-side)Preview file -->
    <v-card class="preview-work-card">
      <!-- Switch file preview tabs -->
      <v-tabs show-arrows dark background-color="primary">
        <v-tab
          v-for="(fileName, index) in shortFileNames"
          :key="index"
          @click="handleChangeFilePreview(index)"
          >{{ fileName }}</v-tab
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
          <div class="d-flex" style="gap: 0.4rem">
            <a
              :href="link.File_Name"
              target="_blank"
              v-for="(link, index) in links"
              :key="index"
              >{{ "Link " + (index + 1) }}</a
            >
          </div>
        </div>

        <v-form>
          <h5>Score</h5>
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="givenScore"
                :disabled="showSubmitted"
                :rules="[
                  () => !!givenScore || 'This field is required',
                  handleCheckValidScore
                ]"
                placeholder="Score:"
                outlined
                dense
                type="number"
                min="0"
                step="1"
                @keyup="handleScoreInput"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <p style="margin: 0; padding-top: 10px">/ {{ maxScore }}</p>
            </v-col>
          </v-row>
          <!-- <v-select :items="selectScores" dense outlined></v-select> -->

          <h5>Comment</h5>
          <v-textarea
            v-model="comment"
            :disabled="showSubmitted"
            :rules="[() => !!comment || 'This field is required']"
            placeholder="Comment:"
            outlined
            auto-grow
            rows="4"
            row-height="30"
          ></v-textarea>

          <h5>Upload File</h5>
          <v-file-input
            :clearable="false"
            :disabled="showSubmitted"
            outlined
            hide-details
            dense
            show-size
            prepend-icon=""
            v-model="teacherFile"
          ></v-file-input>
        </v-form>

        <v-btn color="primary" @click="handleSubmitScore">SUBMIT</v-btn>
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
    },
    maxScore: {
      type: Number,
      default: 0
    },
    Assignment_ID: {
      type: Number,
      default: 0
    },
    scoreInfo: {
      type: null,
      default: {}
    }
  },
  data() {
    return {
      showSubmitted: false,
      selectScores: [1, 2, 3, 4, 5],
      teacherFile: null,
      givenScore: null,
      comment: null,
      uploadSrcs: [],
      files: [],
      links: [],
      selectedFile: { src: "" }
    };
  },
  computed: {
    // This will replace the middle of the string with '...' thus shorten each file name
    shortFileNames() {
      // Starting at 1/3rd position to 2/3rd position
      return this.files.map(file => {
        // Remove time stamp in front of each file name
        const nameNoTime = file.file.name.replace(/(^\d+-)/, "");
        return nameNoTime.length > 16
          ? nameNoTime.replace(
              nameNoTime.substring(
                // 1/3rd position index
                nameNoTime.length / 3,
                // 2/3rd position index
                (nameNoTime.length / 3) * 2
              ),
              "..."
            )
          : nameNoTime;
      });
    }
  },
  async mounted() {
    // * === Sets teacher submitted score and file if exists === * //
    if (this.scoreInfo || typeof this.scoreInfo === "object") {
      // console.log("score info:", this.scoreInfo);
      this.showSubmitted = true;
      // Sets score
      this.givenScore = this.scoreInfo.Score;

      // Sets comment
      this.comment = this.scoreInfo.Comment;

      // Sets file
      const blob = await this.$axios.$get(
        "/uploads/assignments/" + this.scoreInfo.File_Name,
        {
          responseType: "blob"
        }
      );
      this.teacherFile = new File(
        [blob],
        // Remove time stamp in front of each file name
        this.scoreInfo.File_Name.replace(/(^\d+-)/, ""),
        {
          type: blob.type
        }
      );
    }

    // * === Render student's files === * //
    // If there are submitted files get them from static folder
    if (this.submittedFiles.length !== 0) {
      // Get all submitted files as file object
      let files = this.submittedFiles
        // Filter all submitted files and only get type of "File" and it's a student's file
        .filter(
          file => file.Type === "File" && [2, 3].includes(file.Group_Role)
        )
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

      // Shorten filename
      console.log("Files: ", this.files);
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
    },
    handleScoreInput() {
      this.givenScore = Math.trunc(this.givenScore);
    },
    handleCheckValidScore() {
      return this.givenScore > this.maxScore || this.givenScore < 0
        ? "Invalid score"
        : true;
    },
    async handleSubmitScore() {
      // If already submitted score, this function won't run
      if (!this.showSubmitted) return;

      const formData = new FormData();

      // Append form data with file
      formData.append("file", this.teacherFile);

      // Append the rest of the data
      formData.append("Score", this.givenScore);
      formData.append("Comment", this.comment);
      formData.append(
        "Group_Member_ID",
        this.$store.state.group.currentUserGroup.Current_Member_ID
      );
      formData.append("Assignment_ID", this.Assignment_ID);

      const res = await this.$axios.$post(
        "/assignment/giveProgressScore",
        formData
      );

      if (res.status === 200) {
        this.showSubmitted = true;
      }
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
