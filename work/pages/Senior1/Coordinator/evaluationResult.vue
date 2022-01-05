<template>
  <section>
    <main class="coordinator-eval-main">
      <h1>Evaluation Result (My Advisee)</h1>

      <!-- Card (Evaluation result) -->
      <ProjectDetailCard />

      <div></div>

      <!-- Evaluation result -->
      <v-card class="co-evaluation-result-card mt-16">
        <v-card-title>EVALUATION RESULT</v-card-title>
        <EvaluationResultGrid />
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

          <h5>Grade</h5>

          <v-select
            v-model="selectedGrades"
            :items="grade"
            :disabled="haveGrade"
            dense
            outlined
          ></v-select>

          <v-btn :disabled="haveGrade" color="primary" @click="submitGrad"
            >SUBMIT</v-btn
          >
        </div>
      </v-card>

      <!-- Edit eval modal -->
    </main>
  </section>
</template>

<script>
import ProjectDetailCard from "@/components/Global/projectDetailCard";
import EvaluationResultGrid from "@/components/Global/evaluationResultGrid";

export default {
  layout: "coordinator",
  components: {
    ProjectDetailCard,
    EvaluationResultGrid
  },
  data() {
    return {
      comment: "",
      selectedGrades: null,
      haveGrade: true,
      grade: []
    };
  },
  async fetch() {
    // fetch grade criteria for teacher grading
    const data = await this.$axios.$post("/criteria/gradeMajor", {
      Major_ID: this.$store.state.auth.currentUser.major
    });

    // set grade to grading
    data.forEach(el => {
      this.grade.push(el.Grade_Criteria_Name);
    });

    // get group info
    const group = await this.$axios.$post("/group/getMyGroup", {
      Group_ID: 1 //FIXME:
    });

    if (group[0].Grade != null && group[0].Grade != "") {
      this.selectedGrades = group[0].Grade;
      this.haveGrade = true;
    } else {
      this.haveGrade = false;
    }
    if (group[0].Comment_Grade != null && group[0].Comment_Grade != "") {
      this.comment = group[0].Comment_Grade;
    }
    console.log("have grade", this.haveGrade);
    // if(group[0].)
  },
  methods: {
    async submitGrad() {
      if (this.haveGrade) {
        return;
      }
      if (this.selectedGrades == null) {
        this.$swal.fire(
          "Missing data",
          "Please select Grade before submit.",
          "info"
        );
        return;
      }
      this.$swal
        .fire({
          icon: "info",
          title: "Submit Grade",
          text: "You can submit a grade once.",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes"
        })
        .then(async result => {
          if (result.isConfirmed) {
            const res = await this.$axios.$post("/group/grading", {
              Group_ID: 1, //FIXME:
              event: 0,
              Grade: this.selectedGrades,
              Comment: this.comment
            });

            if (res.status == 200) {
              this.$nuxt.refresh();
              this.$swal.fire("Successed", "Grade has been saved.", "success");
            } else {
              this.$swal.fire("Error", res.msg, "error");
            }
          }
        });
      // console.log("selected grade ", this.selectedGrades);
    }
  }
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
