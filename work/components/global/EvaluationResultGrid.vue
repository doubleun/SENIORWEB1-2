<template>
  <!-- Conditionally bind class of 'px-4' if grade is hide -->
  <v-data-table
    :headers="finalHeaders"
    :items="[evalScores]"
    hide-default-footer
    disable-sort
    class="elevation-1 pb-4"
    :class="{ 'px-4': hideGrade }"
  >
    <template v-slot:item.progress1="{ item }">
      {{ item.progress1 == null ? "-" : item.progress1 }}
    </template>
    <template v-slot:item.progress2="{ item }">
      {{ item.progress2 == null ? "-" : item.progress2 }}
    </template>
    <template v-slot:item.progress3="{ item }">
      {{ item.progress3 == null ? "-" : item.progress3 }}
    </template>
    <template v-slot:item.progress4="{ item }">
      {{ item.progress4 == null ? "-" : item.progress4 }}
    </template>
    <template v-slot:item.finalPresentation="{ item }">
      {{ item.FinalPresentation == null ? "-" : item.FinalPresentation }}
    </template>
    <template v-slot:item.finalDocumentation="{ item }">
      {{ item.FinalDocumentation == null ? "-" : item.FinalDocumentation }}
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
</template>

<script>
export default {
  props: { Group_ID: String, evalScores: Object, hideGrade: Boolean },
  data() {
    return {
      headers: [
        {
          text: "Progress 1",
          value: "progress1",
          align: "center",
        },
        {
          text: "Progress 2",
          value: "progress2",
          align: "center",
        },
        {
          text: "Progress 3",
          value: "progress3",
          align: "center",
        },
        {
          text: "Progress 4",
          value: "progress4",
          align: "center",
        },
        {
          text: "Final Presentation",
          value: "finalPresentation",
          align: "center",
        },
        {
          text: "Final Documentation",
          value: "finalDocumentation",
          align: "center",
        },
        { text: "Total", value: "total", align: "center" },
        {
          text: "Suggestion Grade",
          value: "suggestGrade",
          align: "center",
        },
      ],
    };
  },
  computed: {
    // Check if hiding grade is true (passed in via props)
    finalHeaders() {
      // If 'hideGrade' is true, cut off after the Total score, else return the full headers
      return this.hideGrade ? this.headers.splice(0, 7) : this.headers;
    },
  },
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
