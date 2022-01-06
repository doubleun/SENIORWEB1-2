<template>
  <!-- NOTE: Change number of repeat based on how many cols you want -->
  <div class="evaluation-score-table">
    <v-container>
      <v-data-table
        :headers="headers"
        :items="score"
        :hide-default-footer="true"
        class="elevation-1"
      >
        <template v-slot:item.progress1="{ item }">
          {{ item.progress1 == null ? 0 : item.progress1 }}
        </template>
        <template v-slot:item.progress2="{ item }">
          {{ item.progress2 == null ? 0 : item.progress2 }}
        </template>
        <template v-slot:item.progress3="{ item }">
          {{ item.progress3 == null ? 0 : item.progress3 }}
        </template>
        <template v-slot:item.progress4="{ item }">
          {{ item.progress4 == null ? 0 : item.progress4 }}
        </template>
        <template v-slot:item.FinalPresentation="{ item }">
          {{ item.FinalPresentation == null ? 0 : item.FinalPresentation }}
        </template>
        <template v-slot:item.FinalDocumentation="{ item }">
          {{ item.FinalDocumentation == null ? 0 : item.FinalDocumentation }}
        </template>

        <!-- <template v-slot:item.total="{ item }">
        {{
          (item.total =
            item.progress1 +
            item.progress2 +
            item.progress3 +
            item.progress4 +
            item.FinalPresentation +
            item.FinalDocumentation)
        }}
      </template> -->
      </v-data-table>
    </v-container>
    <!-- <div v-for="scoreAttribute in scoreAttributes" :key="scoreAttribute.id"> -->
    <!-- Table attributes -->
    <!-- <p class="table-attr">
        {{ scoreAttribute.name }}
      </p> -->

    <!-- Table records -->
    <!-- <p>
        {{ scoreAttribute.maxScore }}
      </p>
    </div> -->
  </div>
</template>

<script>
export default {
  props: { Group_ID: String },
  data() {
    return {
      score: [],
      headers: [
        {
          text: "Progress 1",
          value: "progress1"
        },
        { text: "Progress 2", value: "progress2" },
        { text: "Progress 3", value: "progress3" },
        { text: "Progress 4", value: "progress4" },
        { text: "Final Presentation", value: "FinalPresentation" },
        { text: "Final Documentation", value: "FinalDocumentation" },
        { text: "Total", value: "Total" },
        { text: "Suggestion Grade", value: "Grade" }
      ]
    };
  },
  async fetch() {
    var grade;
    // this.Group_ID = parseInt(this.Group_ID);
    try {
      const score = await this.$axios.$post("/group/socre", {
        Group_ID: this.Group_ID //FIXME:
      });
      console.log("score", score);

      var data = await this.$axios.$post("/criteria/gradeMajor", {
        Major_ID: this.$store.state.group.currentUserGroup.Major
      });

      data.sort((a, b) => {
        return a.Grade_Criteria_Pass - b.Grade_Criteria_Pass;
      });
      // console.log("criteria", data);

      data.forEach(el => {
        if (score[0].Total >= el.Grade_Criteria_Pass) {
          grade = el.Grade_Criteria_Name;
        }
      });
      score[0].Grade = grade;
      this.score.push(score[0]);

      console.log("grade", grade);
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style>
/* Evaluation score table */
.evaluation-score-table {
  display: grid;
  padding: 0.5rem 1rem 1rem;
  overflow-x: auto;
  text-align: center;
}
.evaluation-score-table p {
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
}
.evaluation-score-table .table-attr {
  background-color: #edf2f9;
  padding: 0.4rem;
}
</style>
