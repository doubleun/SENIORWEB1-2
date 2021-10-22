<template>
  <div>
    <!-- Search text field -->
    <div class="searchKeyword">
      <v-row
        ><v-col cols="12" sm="6" xs="6" class="mt-5"
          ><v-text-field
            label="Search keyword"
            outlined
            dense
            clearable
            append-icon="mdi-magnify"
          ></v-text-field
        ></v-col>
        <!-- Search button -->
        <v-col
          ><v-btn
            rounded
            dark
            color="indigo"
            to="/Global/globalSearchResult"
            class="mt-5"
          >
            Search
          </v-btn></v-col
        ></v-row
      >
      <!-- Card result of search -->
      <v-card v-for="paper in info" :key="paper.title" class="mb-5">
        <v-card-text>
          <h3>Title : {{ paper.title }}</h3>
          <h3>Authors : {{ paper.authors }}</h3>
          <h3>Advisor : {{ paper.advisor }}</h3>
          <h3>Published : {{ paper.publish }}</h3>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      info: [
        {
          title: "AI tools: development trends and selection",
          authors: "E. Bradley",
          advisor: "P. Chung",
          publish: "20 July 2021",
        },
        {
          title: "A Code Complexity Model of Object Oriented Programming (OOP)",
          authors: "Thamer Alrawashdeh",
          advisor: "Hiba Wasmi",
          publish: "16 August 2021",
        },
        {
          title:
            "Implementation of Simulation Platform for Craniofacial Surgery Based on COM",
          authors: "Gu Fang",
          advisor: "Cui Yi-qun",
          publish: "27 September 2021",
        },
        {
          title:
            "Apparent Ultra-High b-Value Diffusion-Weighted Image Reconstruction via Hidden Conditional Random Fields",
          authors: "Mohammad Javad Shafiee",
          advisor: "Masoom A. Haider",
          publish: "30 October 2021",
        },
      ],
    };
  },
};
</script>
<style scoped>
.v-btn {
  width: 200px;
}
</style>
