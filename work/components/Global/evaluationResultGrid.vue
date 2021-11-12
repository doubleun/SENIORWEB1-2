<template>
  <!-- NOTE: Change number of repeat based on how many cols you want -->
  <div
    class="evaluation-score-table"
    style="grid-template-columns: repeat(8, auto)"
  >
    <div v-for="scoreAttribute in scoreAttributes" :key="scoreAttribute.id">
      <!-- Table attributes -->
      <p class="table-attr">
        {{ scoreAttribute.name }}
      </p>

      <!-- Table records -->
      <p>
        {{ scoreAttribute.maxScore }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scoreAttributes: [
        {
          id: 1,
          name: "Progress 1",
          maxScore: 10
        },
        {
          id: 2,
          name: "Progress 2",
          maxScore: 10
        },
        {
          id: 3,
          name: "Progress 3",
          maxScore: 10
        },
        {
          id: 4,
          name: "Progress 4",
          maxScore: 10
        },
        {
          id: 5,
          name: "Final Presentation",
          maxScore: 45
        },
        {
          id: 6,
          name: "Final Documentation",
          maxScore: 15
        },
        {
          id: 7,
          name: "Total",
          maxScore: 100
        },
        {
          id: 8,
          name: "Grade",
          maxScore: "S"
        }
      ]
    };
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
