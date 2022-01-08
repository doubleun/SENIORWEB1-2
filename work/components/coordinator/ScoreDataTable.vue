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
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
    ></v-data-table>
  </v-card>
</template>

<script>
export default {
  props: { items: Array },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "ID",
          align: "start",
          filterable: false,
          value: "id"
        },
        { text: "NAME", value: "name" },
        { text: "ADVISOR", value: "advisor" },
        { text: "Progress1", value: "progress1" },
        { text: "Progress2", value: "progress2" },
        { text: "FINAL PRESENT", value: "finalpresent" },
        { text: "FINAL DOCUMENT", value: "finaldocument" },
        { text: "TOTAL", value: "total" },
        { text: "GRADE", value: "grade" }
      ]
    };
  }
};
</script>

<style scoped>
.v-data-table {
}
</style>
