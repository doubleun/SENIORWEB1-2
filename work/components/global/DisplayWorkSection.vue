<template>
  <div class="display-work-container">
    <!-- Work submission alert -->
    <div style="width: 100%">
      <v-alert type="warning" style="width: fit-content" v-if="noWorkSubmitted"
        >No work submitted</v-alert
      >
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
        <!-- <embed :src="selectedFile.src" class="preview-work-card-content" /> -->
        <object :data="selectedFile.src" width="100%" height="100%"></object>
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
          :disabled="noWorkSubmitted"
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

        <v-form ref="form" v-model="valid">
          <div v-if="maxScore !== 0">
            <h5>Score</h5>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="givenScore"
                  :disabled="showSubmitted"
                  :rules="[
                    () => givenScore !== null || 'This field is required',
                    handleCheckValidScore,
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
          </div>
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
            :show-size="!showSubmitted"
            prepend-icon=""
            v-model="teacherFile"
          ></v-file-input>
        </v-form>

        <v-btn
          color="primary"
          :disabled="showSubmitted"
          @click="handleSubmitScore"
          >SUBMIT</v-btn
        >
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    noWorkSubmitted: {
      type: Boolean,
      default: false,
    },
    progressId: {
      type: Number,
      default: 1,
    },
    submittedFiles: {
      type: Array,
      default: [],
    },
    maxScore: {
      type: Number,
      default: 0,
    },
    Assignment_ID: {
      type: Number,
      default: 0,
    },
    scoreInfo: {
      type: null,
      default: null,
    },
  },
  data() {
    return {
      valid: true,
      showSubmitted: false,
      submitOnTime: false,
      submitDate: "",
      selectScores: [1, 2, 3, 4, 5],
      teacherFile: null,
      givenScore: null,
      comment: null,
      uploadSrcs: [],
      files: [],
      links: [],
      selectedFile: { src: "" },
    };
  },
  computed: {
    // This will replace the middle of the string with '...' thus shorten each file name
    shortFileNames() {
      // Starting at 1/3rd position to 2/3rd position
      return this.files.map((file) => {
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
    },
  },
  async mounted() {
    // If no work submitted then set show submitted to true (ie. lock all fields and submit button)
    if (this.noWorkSubmitted) {
      this.showSubmitted = true;
    }
    // console.log(!this.noWorkSubmitted && !!this.scoreInfo?.Score);
    // * === Sets teacher submitted score and file if exists === * //
    // If there is score to display or score is zero (in case of 0 score or proposal which score will always be zero)
    // Then set the UI of submitted score
    if (!!this.scoreInfo?.Score || this.scoreInfo?.Score === 0) {
      // console.log("score info:", this.scoreInfo);
      this.showSubmitted = true;
      // Sets score
      this.givenScore = this.scoreInfo.Score;

      // Sets comment
      this.comment = this.scoreInfo.Comment;

      // Sets file
      const blob = await this.$axios.$get(
        "/public_senior/uploads/assignments/" + this.scoreInfo.File_Name,
        {
          responseType: "blob",
        }
      );
      this.teacherFile = new File(
        [blob],
        // Remove time stamp in front of each file name
        this.scoreInfo.File_Name.replace(/(^\d+-)/, ""),
        {
          type: blob.type,
        }
      );
    }

    // * === Render student's files === * //
    // If there are submitted files get them from static folder
    if (this.submittedFiles.length !== 0) {
      // TODO: Check submitted date to the due date and set 'submittedOnTime' flag accordingly
      // Format work submission date (according to `assignments` data table)
      this.submitDate = new Date(
        this.submittedFiles[0].Submit_Date
      ).toLocaleString("th-TH", {
        dateStyle: "full",
        timeStyle: "medium",
      });

      // Get all submitted files as file object
      let files = this.submittedFiles
        // Filter all submitted files and only get type of "File" and it's a student's file (role 2 and 3 are for students)
        .filter(
          (file) => file.Type === "File" && [2, 3].includes(file.Group_Role)
        )
        // Then, map each file and send axios get request to fetch the file from static folder in server
        .map(async (file) => {
          // Request response type to be 'blob'
          const blob = await this.$axios.$get(
            "/public_senior/uploads/assignments/" +
              encodeURIComponent(file.File_Name),
            {
              "Content-Type": "application/json;charset=utf-8",
              responseType: "blob",
            }
          );
          return {
            // Convert blob to File object
            file: new File([blob], file.File_Name, { type: blob.type }),
            date: new Date(file.Submit_Date).toLocaleString(),
          };
        });
      // Since, each loop is a promise, promise.all is needed
      this.files = await Promise.all(files);

      // TODO: Delete this !
      console.log("Files: ", this.files);
    }

    // Create object string on all files
    this.files.forEach((file) => {
      this.uploadSrcs.push(URL.createObjectURL(file.file));
    });

    // Sets initial selected src
    this.selectedFile = { src: this.uploadSrcs[0], index: 0 };

    // Set links array
    this.links = this.submittedFiles.filter((file) => file.Type === "Link");
  },
  beforeDestroy() {
    // Clean up
    this.uploadSrcs.forEach((src) => URL.revokeObjectURL(src));
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
      // Remove time stamp in front of the file name
      const nameNoTime = this.files[this.selectedFile.index].file.name.replace(
        /(^\d+-)/,
        ""
      );
      // Create download with the file name that has time stamp removed
      link.download = nameNoTime;
      // Initiate download
      link.click();
      // Revoke donwload link element from DOM
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
      // console.log(this.showSubmitted)
      // If already submitted score or no work has been submitted this function won't run
      if (this.showSubmitted || this.noWorkSubmitted) return;

      // Validate form
      this.$refs.form.validate();
      if (!this.valid) return;

      const formData = new FormData();

      // Append form data with file
      formData.append("file", this.teacherFile);

      // Append the rest of the data
      formData.append("Score", this.givenScore || 0);
      formData.append("Max_Score", this.maxScore);
      formData.append("Comment", this.comment);
      formData.append(
        "Group_Member_ID",
        this.$store.state.group.currentUserGroup.Current_Member_ID
      );
      formData.append(
        "Group_ID",
        this.$store.state.group.currentUserGroup.Group_ID
      );
      formData.append("Assignment_ID", this.Assignment_ID);

      // If this progress is proposal, skip finding the next progress id and simply use the current one
      if (this.progressId === 2) {
        formData.append("Next_Progress_ID", 2);
      } else {
        // Else get current progress index from all avaialble progresses
        const currentProgressIndex =
          this.$store.state.group.availableProgress.findIndex(
            (progress) => progress.Progress_ID === this.progressId
          );
        // The next progress id will be in the current progress id (ie. mark that current progress is finished)
        // More info: each group progression marks if it's done yet. So by updating group progression to current ones, we mark that it's done
        formData.append(
          "Next_Progress_ID",
          this.$store.state.group.availableProgress[currentProgressIndex]
            .Progress_ID
        );
      }

      const res = await this.$axios.$post(
        "/assignment/giveProgressScore",
        formData
      );

      if (res.status === 200) {
        this.showSubmitted = true;
      }
    },
  },
};
</script>

<style>
/* Display work */
.display-work-container {
  margin-block-start: 2rem;
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
