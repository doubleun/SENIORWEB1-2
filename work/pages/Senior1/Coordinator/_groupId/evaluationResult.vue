<template>
  <section>
    <main class="coordinator-eval-main">
      <h1>
        Evaluation Result
        {{ groupAdvisor ? "(My Advisee)" : "(My Committee)" }}
      </h1>

      <!-- Card (Evaluation result) -->
      <!-- <ProjectDetailCard /> -->

      <!-- Evaluation result -->
      <v-card class="co-evaluation-result-card my-12">
        <v-card-title>EVALUATION RESULT</v-card-title>
        <EvaluationResultGrid
          :Group_ID="Group_ID"
          :evalScores="fetchScoresRes"
        />
      </v-card>

      <!-- Evaluation form -->
      <v-card class="co-evaluation-form-card">
        <v-card-title>Evaluation Form</v-card-title>
        <div class="co-evaluation-form-card-content">
          <h5>Comment</h5>
          <v-textarea
            v-model="comment"
            :disabled="haveGrade"
            auto-grow
            outlined
            rows="4"
            row-height="30"
          ></v-textarea>

          <div v-if="groupAdvisor">
            <h5>Grade</h5>

            <v-select
              v-model="selectedGrade"
              :items="gradeNameArr"
              :disabled="haveGrade"
              v-if="!gradeI"
              dense
              outlined
            ></v-select>

            <v-checkbox
              v-model="gradeI"
              label="Re-evaluation (Grade I)"
              :disabled="haveGrade"
            ></v-checkbox>
          </div>

          <v-btn :disabled="haveGrade" color="primary" @click="submitGrade"
            >SUBMIT</v-btn
          >
        </div>
      </v-card>

      <!-- Edit eval modal -->
    </main>
  </section>
</template>

<script>
// import ProjectDetailCard from "@/components/global/projectDetailCard";
// import EvaluationResultGrid from "@/components/global/evaluationResultGrid";

export default {
  layout: "coordinator",
  data() {
    return {
      comment: "",
      selectedGrade: null,
      // 'haveGrade' is a flag use to check if grade has been given or not
      haveGrade: false,
      gradeI: false,
      groupAdvisor: false,
      currentMemberId: null,
    };
  },
  async asyncData({ params, redirect, store, $axios }) {
    // Use regex to match only 'Number' in params (ie. ignore 'group' that comes before the actual group id)
    const groupId = params.groupId.match(/(\d)/g).join("");

    // Fetch available grade criterias
    // Fetch grade from grade criterias
    const gradeCriterias = await $axios.$post("/criteria/gradeMajor", {
      Major_ID: store.state.auth.currentUser.major,
    });
    console.log("Eval grade criterias: ", gradeCriterias);

    // If grade criteria has not been set, redirect user back
    if (gradeCriterias.length === 0) {
      return redirect("/Senior1/coordinator/");
    }
    // Fetch evaluation scores
    const fetchScoresRes = await $axios.$post(
      "/assignment/getEvaluationScores",
      {
        Group_ID: groupId,
      }
    );
    console.log("Fetched eval scores: ", fetchScoresRes);
    // Calculate total score
    fetchScoresRes.total = Object.values(fetchScoresRes).reduce(
      (prev, current) => parseInt(prev) + (!current ? 0 : parseInt(current)),
      0
    );

    // Calculate sugesstion grade
    const suggestGrade = gradeCriterias.find(
      (criteria) => fetchScoresRes.total >= criteria.Grade_Criteria_Pass
    );
    console.log("Suggest grade: ", suggestGrade);

    // Add to fetchScoresRes
    fetchScoresRes.suggestGrade = suggestGrade.Grade_Criteria_Name;

    // Create grade name array using all available grade criterias
    let gradeNameArr = gradeCriterias.map(
      (criteria) => criteria.Grade_Criteria_Name
    );
    // Add 'as system suggested' as the first element in the array
    gradeNameArr = ["As system suggested", ...gradeNameArr];
    return { Group_ID: groupId, gradeCriterias, gradeNameArr, fetchScoresRes };
  },

  async fetch() {
    // Fetch given evaluation grade and comment
    const groupInfo = await this.$axios.$post("/group/getTeachersEval", {
      Email: this.$store.state.auth.currentUser.email,
      Group_ID: this.Group_ID,
      Single: true,
      Group_Info: true,
    });
    // console.log("GroupInfo: ", groupInfo);

    // TODO: Maybe create groupInfo in data and use it as this.groupInfo ??
    // Sets group advisor to true if the current user is the advisor of the group (Member_Role of 0 is advisor)
    if (groupInfo.group.Current_Member_Role === 0) this.groupAdvisor = true;
    // Assign group member id
    this.currentMemberId = groupInfo.group.Current_Member_ID;

    // Check if the group alrady has a comment from this user(teacher)
    if (groupInfo.eval[0]?.Comment) {
      // If they have been graded, set 'haveGrade' to true and set grade and comment
      this.haveGrade = true;
      // Since 'eval' return from SQL query as an array, we only need the first result since it's the current user's comment
      this.comment = groupInfo.eval[0]?.Comment;
      // Check if the group got an I
      if (groupInfo.group.Grade === "I") {
        this.gradeI = true;
      } else {
        this.gradeI = false;
      }
      // Assign grade to selected grade
      this.selectedGrade = groupInfo.group.Grade;
    }
  },
  methods: {
    async submitGrade() {
      // If group alrady has a grade, teacher can't give them again
      // If no current group member id also return
      if (this.haveGrade || !this.currentMemberId) return;

      // If no grade has been selected, warn the user
      if (this.groupAdvisor && this.selectedGrade === null) {
        this.$swal.fire(
          "Missing data",
          "Please select Grade before submit.",
          "info"
        );
        return;
      }

      // If re-eval is checked (graded I) assign grade I to the 'selectedGrade'
      if (this.gradeI) this.selectedGrade = "I";

      this.$swal
        .fire({
          icon: "info",
          title: "Submit Evaluation",
          text: "You can submit evaluation only once.",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        })
        .then(async (result) => {
          try {
            if (result.isConfirmed) {
              const res = await this.$axios.$post("/group/grading", {
                Group_ID: this.Group_ID,
                // Event 0 is for normal grade and 1 is for final grade
                event: 0,
                // Input grade based on selected option
                Grade:
                  this.selectedGrade === "As system suggested"
                    ? this.fetchScoresRes.suggestGrade
                    : this.selectedGrade,
                isAdvisor: this.groupAdvisor,
                Comment: this.comment,
                Group_Member_ID: this.currentMemberId,
              });

              if (res.status == 200) {
                this.$swal.fire(
                  "Successed",
                  "Grade has been saved.",
                  "success"
                );
                // Update UI
                this.$nuxt.refresh();
                return;
              } else {
                this.$swal.fire("Error", res.msg, "error");
                return;
              }
            }
          } catch (err) {
            console.log(err);
            this.$swal.fire("Error", err.message, "error");
            return;
          }
        });
      // console.log("selected grade ", this.selectedGrade);
    },
  },
};
</script>

<style>
.coordinator-eval-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.coordinator-eval-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}

/* Evaluation edit button */
.co-evaluation-edit-btn {
  display: flex;
  justify-content: flex-end;
  margin-block: 2rem;
  width: 100%;
}

/* Edit eval modal card */
.edit-eval-card-modal {
  padding: 1rem 1rem 2rem;
}
.edit-eval-card-modal-content {
  padding: 0 1rem;
  font-size: 14px;
}
.edit-eval-card-modal-content p {
  margin-block-end: 0.2rem;
}
.edit-eval-card-modal-content > div {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Evaluation result card */
.co-evaluation-result-card .v-card__title {
  padding: 1rem 2rem 0;
}

/* Evaluation form card */
.co-evaluation-form-card .v-card__title {
  padding: 1rem 2rem 0;
}
.co-evaluation-form-card-content {
  padding: 1rem 2rem 2rem;
}
.co-evaluation-form-card-content > button {
  width: 100%;
}
</style>
