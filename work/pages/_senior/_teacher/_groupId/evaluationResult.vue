<template>
  <v-contianer>
    <!-- <main class="coordinator-eval-main"> -->
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">
      Evaluation Result
      {{ groupAdvisor ? "(My Advisee)" : "(My Committee)" }}
    </h2>

    <!-- Card (Evaluation result) -->
    <!-- <ProjectDetailCard /> -->

    <ProjectDetailCard :GroupDetail="GroupDetail" />

    <!-- Evaluation result -->
    <v-card class="co-evaluation-result-card my-12">
      <v-card-title>EVALUATION RESULT</v-card-title>
      <EvaluationResultGrid :Group_ID="Group_ID" :evalScores="fetchScoresRes" />
    </v-card>

    <!-- Evaluation form -->
    <v-card class="co-evaluation-form-card">
      <v-card-title>Evaluation Form</v-card-title>
      <div class="co-evaluation-form-card-content">
        <h5>Comment</h5>
        <v-form ref="form">
          <v-textarea
            v-model="comment"
            :disabled="haveGrade"
            :rules="[() => !!comment || 'This field is required']"
            auto-grow
            outlined
            rows="4"
            row-height="30"
          ></v-textarea>
        </v-form>

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
    <!-- </main> -->
  </v-contianer>
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

    const groupRes = await $axios.$post("/group/getGroupWithID", {
      Group_ID: groupId,
      Email: store.state.auth.currentUser.email,
      // Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
    });

    // Commit group into state
    if (!store.state.group.currentUserGroup)
      store.commit("group/SET_GROUP", groupRes.groupInfo[0]);

    // Set available group progressions based on group major
    store.dispatch("group/storeAvailableProgressions");

    // Fetch given evaluation grade and comment
    const groupInfo = await $axios.$post("/group/getTeachersEval", {
      Email: store.state.auth.currentUser.email,
      Group_ID: groupId,
      Single: true,
      Group_Info: true,
      filterTeachersRole: false,
    });

    console.log("group info", groupInfo);

    // Check if the group has a grade, if not then committe cannot give comment
    if (!groupInfo.group.Grade && groupInfo.group.Current_Member_Role === 1) {
      app.$swal.fire("Please wait until advisor give a grade", "", "info");
      return app.router.push(-1);
    }

    // Fetch available grade criterias
    // Fetch grade from grade criterias
    const gradeCriterias = await $axios.$post("/criteria/gradeMajor", {
      Major_ID: groupInfo.group.Major,
    });
    console.log("Eval grade criterias: ", gradeCriterias);

    // If grade criteria has not been set, redirect user back
    if (gradeCriterias.length === 0) {
      app.$swal.fire(
        "Cannot find grade criterias",
        "Please make sure that you have set grade criterias",
        "warning"
      );
      return app.router.push(-1);
    }
    // Fetch evaluation scores
    const fetchScoresRes = await $axios.$post(
      "/assignment/getEvaluationScores",
      {
        Group_ID: groupId,
      }
    );
    console.log("Group id: ", groupId);
    console.log("Fetched eval scores: ", fetchScoresRes);
    // If there are score (in any progress from 1 - final) then calculate the total score, and suggested grade
    if (!!fetchScoresRes && fetchScoresRes.length !== 0) {
      // Calculate total score
      fetchScoresRes.total = Object.values(fetchScoresRes).reduce(
        (prev, current) =>
          parseFloat(prev) + (!current ? 0 : parseFloat(current)),
        0
      );

      // Calculate sugesstion grade
      const suggestGrade = gradeCriterias.find(
        (criteria) => fetchScoresRes.total >= criteria.Grade_Criteria_Pass
      );
      console.log("Suggest grade: ", suggestGrade);

      // Add to fetchScoresRes
      fetchScoresRes.suggestGrade = suggestGrade.Grade_Criteria_Name;
    }

    // Create grade name array using all available grade criterias
    let gradeNameArr = gradeCriterias.map(
      (criteria) => criteria.Grade_Criteria_Name
    );
    // Add 'as system suggested' as the first element in the array
    gradeNameArr = ["As system suggested", ...gradeNameArr];

    // If there's a given grade assign it to fetchScoreRes for showing in the EvalResultGrid data-table
    groupInfo.group.Grade
      ? (fetchScoresRes.normalGrade = groupInfo.group.Grade)
      : (fetchScoresRes.normalGrade = "");

    // console.log("GroupInfo: ", groupInfo);
    return {
      Group_ID: groupId,
      gradeCriterias,
      gradeNameArr,
      fetchScoresRes: !!fetchScoresRes ? fetchScoresRes : {},
      groupInfo,
      GroupDetail: {
        GroupInfo: groupRes.groupInfo[0],
        GroupMembers: groupRes.groupMembers,
      },
    };
  },

  mounted() {},

  async fetch() {
    // TODO: Maybe create groupInfo in data and use it as this.groupInfo ??
    // Sets group advisor to true if the current user is the advisor of the group (Member_Role of 0 is advisor)
    if (this.groupInfo.group.Current_Member_Role === 0)
      this.groupAdvisor = true;
    // Assign group member id
    this.currentMemberId = this.groupInfo.group.Current_Member_ID;

    // Check if the group alrady has a comment from this user(teacher)
    if (this.groupInfo.eval[0]?.Comment) {
      // If they have been graded, set 'haveGrade' to true and set grade and comment
      this.haveGrade = true;
      // Since 'eval' return from SQL query as an array, we only need the first result since it's the current user's comment
      this.comment = this.groupInfo.eval[0]?.Comment;
      // Check if the group got an I
      if (this.groupInfo.group.Grade === "I") {
        this.gradeI = true;
      } else {
        this.gradeI = false;
      }
      // Assign grade to selected grade
      this.selectedGrade = this.groupInfo.group.Grade;
    }
  },
  methods: {
    async submitGrade() {
      // If group alrady has a grade, teacher can't give them again
      // If no current group member id also return
      if (
        this.haveGrade ||
        !this.currentMemberId ||
        !this.$refs.form.validate()
      )
        return;

      // If re-eval is checked (graded I) assign grade I to the 'selectedGrade'
      if (this.gradeI) this.selectedGrade = "I";

      console.log(this.selectedGrade);
      // If no grade has been selected, warn the user
      if (this.groupAdvisor && this.selectedGrade === null) {
        this.$swal.fire(
          "Missing data",
          "Please select Grade before submit.",
          "info"
        );
        return;
      }

      const submitGrade =
        this.selectedGrade === "As system suggested"
          ? this.fetchScoresRes.suggestGrade
          : this.selectedGrade;

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
                // Input grade based on selected option
                Grade: submitGrade,
                isReEval: submitGrade === "I" ? true : false,
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
                this.fetchScoresRes.normalGrade = submitGrade;
                this.haveGrade = true;

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
