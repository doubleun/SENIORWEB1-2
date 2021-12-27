<template>
  <v-card>
    <v-card-title>
      <h3>Student </h3>
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
      :items="id"
      item-text="Major_Name"
      item-value="Major_ID"
      :search="search"
    ></v-data-table>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      infostudent:[],
      headers: [
        {
          text: "ID",
          align: "start",
          filterable: false,
          value: "User_Identity_ID"
        },
        { text: "NAME", value: "User_Name" },
        { text: "EMAIL", value: "User_Email" },
        { text: "SEM", value: "semester" }
      ],
      id: [
        
      ],
      
    };
  },
  
  async fetch() {
    let infostudent
  
    infostudent = await this.$axios.$post("user/getAllUserWithMajor",{
        Major_ID : this.$store.state.auth.currentUser.projectOnTerm,
        Project_on_term_ID:this.$store.state.auth.currentUser.projectOnTerm,
        User_Role:1
    });
    this.id=infostudent
    console.log("this "+infostudent[0]['User_Email'])

    return { infostudent };
  },
   methods: {

   }
};
</script>
