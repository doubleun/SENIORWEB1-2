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
          value: "id"
        },
        { text: "NAME", value: "name" },
        { text: "EMAIL", value: "email" },
        { text: "SEM", value: "semester" }
      ],
      id: [
        {
          id: "6131302010",
          name: "Authep Tayngam",
          email: "3131302010@lamduanh.mfu.ac.th",
          semester: "2/2564"
        },
      ],
      
    };
  },
  
  async asyncData({ $axios }) {
    let infostudent
    // Fetch all majors
    infostudent = await $axios.$post("user/getAllUserWithMajor",{
        Major_ID : this.$store.state.auth.currentUser.projectOnTerm,
        Project_on_term_ID:this.$store.state.auth.currentUser.projectOnTerm,
        User_Role:1
    });
    console.log("kkk")

    return { infostudent };
  },
   methods: {

   }
};
</script>
