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
        { text: "GRADE", value: "grade" }, 
      ],

      items: [
        {
          id:"6131302010",
          name:"Anuthep Tayngam",
          advisor:"Surapong uttama",
          progress1:"10",
          progress2:"10",
          finalpresent:"25",
          finaldocument:"45",
          total:"90",
          grade:"S",

        },
        {
          id:"6131302010",
          name:"Anuthep Tayngam",
          advisor:"Surapong uttama",
          progress1:"10",
          progress2:"10",
          finalpresent:"25",
          finaldocument:"45",
          total:"90",
          grade:"S",

        },
        {
          id:"6131302010",
          name:"Anuthep Tayngam",
          advisor:"Surapong uttama",
          progress1:"10",
          progress2:"10",
          finalpresent:"25",
          finaldocument:"45",
          total:"90",
          grade:"S",

        },
        {
          id:"6131302010",
          name:"Anuthep Tayngam",
          advisor:"Surapong uttama",
          progress1:"10",
          progress2:"10",
          finalpresent:"25",
          finaldocument:"45",
          total:"90",
          grade:"S",

        },
        {
          id:"6131302010",
          name:"Anuthep Tayngam",
          advisor:"Surapong uttama",
          progress1:"10",
          progress2:"10",
          finalpresent:"25",
          finaldocument:"45",
          total:"90",
          grade:"S",

        },

        {
          id:"6131302010",
          name:"Anuthep Tayngam",
          advisor:"Surapong uttama",
          progress1:"10",
          progress2:"10",
          finalpresent:"25",
          finaldocument:"45",
          total:"90",
          grade:"S",

        },
        {
          id:"6131302010",
          name:"Anuthep Tayngam",
          advisor:"Surapong uttama",
          progress1:"10",
          progress2:"10",
          finalpresent:"25",
          finaldocument:"45",
          total:"90",
          grade:"S",

        },
        {
          id:"6131302010",
          name:"Anuthep Tayngam",
          advisor:"Surapong uttama",
          progress1:"10",
          progress2:"10",
          finalpresent:"25",
          finaldocument:"45",
          total:"90",
          grade:"S",

        },
        {
          id:"6131302010",
          name:"Anuthep Tayngam",
          advisor:"Surapong uttama",
          progress1:"10",
          progress2:"10",
          finalpresent:"25",
          finaldocument:"45",
          total:"90",
          grade:"S",

        }
      ]
    };
  }
};
</script>

<style scoped>
.v-data-table{
  
}
</style>
