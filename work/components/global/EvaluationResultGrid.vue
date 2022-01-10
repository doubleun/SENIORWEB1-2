<template>
  <!-- NOTE: Change number of repeat based on how many cols you want -->
  <div class="evaluation-score-table">
    <v-container>
      <v-data-table
        :headers="headers"
        :items="[evalScores]"
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
        <template v-slot:item.finalPresentation="{ item }">
          {{ item.FinalPresentation == null ? 0 : item.FinalPresentation }}
        </template>
        <template v-slot:item.finalDocumentation="{ item }">
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
  props: { Group_ID: String, gradeCriterias: Array, evalScores: Object },
  data() {
    return {
      headers: [
        {
          text: "Progress 1",
          value: "progress1",
          align: "center",
          sortable: false,
        },
        {
          text: "Progress 2",
          value: "progress2",
          align: "center",
          sortable: false,
        },
        {
          text: "Progress 3",
          value: "progress3",
          align: "center",
          sortable: false,
        },
        {
          text: "Progress 4",
          value: "progress4",
          align: "center",
          sortable: false,
        },
        {
          text: "Final Presentation",
          value: "finalPresentation",
          align: "center",
          sortable: false,
        },
        {
          text: "Final Documentation",
          value: "finalDocumentation",
          align: "center",
          sortable: false,
        },
        { text: "Total", value: "total", align: "center", sortable: false },
        {
          text: "Suggestion Grade",
          value: "grade",
          align: "center",
          sortable: false,
        },
      ],
    };
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
