<template>
  <section>
    <main class="coordinator-eval-main">
      <h1>Evaluation Result (My Advisee)</h1>

      <!-- Card (Evaluation result) -->
      <ProjectDetailCard />

      <!-- Edit button -->
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <div class="co-evaluation-edit-btn">
            <v-btn color="primary" outlined v-bind="attrs" v-on="on"
              >Edit</v-btn
            >
          </div>
        </template>

        <!-- Edit eval card modal  -->
        <v-card class="edit-eval-card-modal">
          <v-card-title>
            EVALUATION RESULT
          </v-card-title>
          <div class="edit-eval-card-modal-content">
            <p>Progress 1</p>
            <v-text-field outlined dense></v-text-field>
            <p>Progress 2</p>
            <v-text-field outlined dense></v-text-field>
            <p>Progress 3</p>
            <v-text-field outlined dense></v-text-field>
            <p>Progress 4</p>
            <v-text-field outlined dense></v-text-field>
            <p>Final Presentation</p>
            <v-text-field outlined dense></v-text-field>
            <p>Final Documentation</p>
            <v-text-field outlined dense></v-text-field>
            <div>
              <v-btn>Cancel</v-btn>
              <v-btn color="primary">Submit</v-btn>
            </div>
          </div>
        </v-card>
      </v-dialog>

      <!-- Evaluation result -->
      <v-card class="co-evaluation-result-card">
        <v-card-title>EVALUATION RESULT</v-card-title>
        <EvaluationResultGrid />
      </v-card>

      <!-- Evaluation form -->
      <v-card class="co-evaluation-form-card">
        <v-card-title>Evaluation Form</v-card-title>
        <div class="co-evaluation-form-card-content">
          <h5>Comment</h5>
          <v-textarea auto-grow outlined rows="4" row-height="30"></v-textarea>

          <h5>Grade</h5>
          <v-select :items="selectGrades" dense outlined></v-select>

          <v-btn color="primary">SUBMIT</v-btn>
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
      selectGrades: ["A", "B", "C", "D", "F"]
    };
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
