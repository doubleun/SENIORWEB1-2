<template>
  <v-card>
    <v-card-title>
      <h3>Score Student</h3>
      <v-spacer></v-spacer>
      <v-text-field
        clearable
        hide-details
        label="Search "
        prepend-inner-icon="mdi-magnify"
        filled
        rounded
        dense
        class="search"
        color="blue"
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :search="search">
      <template v-slot:item.total="{ item }">
        {{
          parseInt(
            +item.progress1 +
              +item.progress2 +
              +item.progress3 +
              +item.progress4 +
              +item.FinalPresentation +
              +item.FinalDocumentation
          )
        }}
      </template>

      <!-- <template v-slot:item.grade="{ item }">
        {{}}
      </template> -->
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: { items: Array },
  data() {
    return {
      search: "",
      gradeCriteria: [],
      headers: [
        {
          text: "ID",
          align: "center",
          filterable: false,
          value: "User_Identity_ID",
        },
        { text: "NAME", value: "student", align: "center" },
        { text: "ADVISOR", value: "Advisor" },
        { text: "Progress1", value: "progress1", align: "center" },
        { text: "Progress2", value: "progress2", align: "center" },
        { text: "Progress3", value: "progress3", align: "center" },
        { text: "Progress4", value: "progress4", align: "center" },
        { text: "FINAL PRESENT", value: "FinalPresentation", align: "center" },
        {
          text: "FINAL DOCUMENT",
          value: "FinalDocumentation",
          align: "center",
        },
        { text: "TOTAL", value: "total", align: "center" },
        { text: "GRADE", value: "grade", align: "center" },
      ],
    };
  },
  async fetch() {
    try {
      const gradeCriteria = await this.$axios.$post("/criteria/gradeMajor", {
        Major_ID: this.$store.state.auth.currentUser.major,
      });
      this.gradeCriteria.sort((a, b) =>
        a.Grade_Criteria_Pass > b.Grade_Criteria_Pass ? 1 : -1
      );
      console.log("criteria", this.gradeCriteria);
    } catch (error) {
      console.log(error);
    }
  },
  // methods: {
  //   grede
  // },
};
</script>

<style scoped>
.v-data-table {
}
</style>
