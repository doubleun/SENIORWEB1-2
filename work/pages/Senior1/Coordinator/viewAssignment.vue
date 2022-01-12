<template>
  <section>
    <main class="due-assignment-card-main">
      <h1>Document</h1>

      <!-- Assignment card -->
      <!-- <v-card>
        <v-card-title>
          Progress 1
        </v-card-title> -->

      <!-- Content -->
      <!-- <div class="due-assignment-thumbnail-container">
          <template v-for="thumb in displayArr">
            <p class="due-assignment-thumbnail" :key="thumb">{{ thumb }}</p>
          </template>
        </div> -->
      <!-- <v-pagination v-model="page" :length="pageLength" circle></v-pagination>
      </v-card> -->
      <v-card>
        <v-card-title>
          List Documents
          <v-spacer></v-spacer>
          <v-col md="3"
            ><v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              outlined
            ></v-text-field
          ></v-col>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="desserts"
          :search="search"
        ></v-data-table>
      </v-card>
    </main>
  </section>
</template>

<script>
export default {
  layout: "coordinatorsidebar",
  data() {
    return {
      page: 1,
      tempArr: [...Array(32).keys()],
      eachPageArr: [],
      search: "",
      headers: [
        {
          text: "Name File",
          value: "namefile",
          align: "center",
        },
        { text: "Type", value: "type", align: "center" },
        { text: "Date", value: "date", align: "center" },
        { text: "Group", value: "group", align: "center" },
        { text: "Action", value: "group", align: "center" },
      ],
      desserts: [
        {
          namefile: "document progress 1.doc",
          type: "Doc",
          date: "11/12/2021",
          group: "",
          // size: "2.8 MB",
        },
      ],
    };
  },
  // async asyncData({ $axios,store }) {
  //   // get file name,submit date, group name in major
  //   // let res
  //   // const res = await $axios.$post("/user/getAllUsersInSchool", {
  //   //   Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
  //   // });
  //   res = await $axios.$post("/assignment/getBymajor", {
  //     Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
  //     Major:store.state.auth.currentUser.major
  //   });
  //   console.log(res)
  // },
  async fetch() {
    // TODO: This is big fetch, put this in a state and check if exists before fetch it
    // Fetch students and teachers
    const res = await this.$axios.$post("/group/getAllFilesMajor", {
      Project_on_term_ID: this.$store.state.auth.currentUser.projectOnTerm,
      Major: this.$store.state.auth.currentUser.major,
    });
    console.log(res[0]);
    for (let i = 0; i > res.length; i++) {
      this.desserts.push({
        namefile: res[i]["File_Name"],
        type: res[i]["Type"],
        date: res[i]["time"],
        group: res[i]["group_Name"],
        // size: "2.8 MB",
      });
    }
  },
  methods: {},
  // computed: {
  //   displayArr() {
  //     const startIndex = 16 * (this.page - 1);
  //     const endIndex = startIndex + 16;
  //     return this.tempArr.slice(startIndex, endIndex);
  //   },
  //   pageLength() {
  //     return Math.ceil(this.tempArr.length / 16);
  //   },
  // },
};
</script>

<style>
.due-assignment-card-main {
  margin-block-end: 2rem;
}
.due-assignment-card-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.due-assignment-card-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}
.due-assignment-thumbnail-container {
  display: grid;
  grid-template-columns: repeat(4, auto);
  align-items: center;
  padding: 1rem 1rem 2rem;
  gap: 2rem 1rem;
}
.due-assignment-thumbnail {
  width: 200px;
  height: 200px;
  background-color: #e5e5e5;
  margin-inline: auto;
}
@media only screen and (max-width: 600px) {
  .due-assignment-thumbnail-container {
    display: grid;
    grid-template-columns: repeat(2, auto);
    align-items: center;
    padding: 0.5rem 0.5rem 1rem;
    gap: 1rem 0.5rem;
  }
  .due-assignment-thumbnail {
    width: 140px;
    height: 140px;
    background-color: #e5e5e5;
    margin-inline: auto;
  }
}
</style>
