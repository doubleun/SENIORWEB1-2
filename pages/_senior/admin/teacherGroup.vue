<template>
  <v-container>
    <h2 class="header-title mb-2 mt-5 white--text">Group of Teacher</h2>

    <v-card style="margin-top: 12%">
      <v-card-title>
        <h3>Group</h3>
        <v-spacer></v-spacer>
        <v-row class="d-flex justify-end">
          <v-col md="2" class="d-flex justify-end">
            <FilterDialog
              :countGroup="countGroup"
              :yearNSemsters="yearNSemsters"
              @on-filtering="handelchangeRender"
            />
          </v-col>
          <v-col md="6">
            <v-text-field
              v-model="search"
              clearable
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="countGroup"
        class="elevation-1"
        :search="search"
      >
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import utils from "@/mixins/utils";
import dialog from "@/mixins/dialog";
export default {
  layout: "admin",
  mixins: [utils, dialog],

  data() {
    return {
      search: "",
      dialog: false,

      headers: [
        { text: "NAME", align: "center", value: "User_Name" },
        { text: "EMAIL", align: "center", value: "User_Email" },
        {
          text: "ADVISOR",
          align: "center",
          value: "Advisor",
        },
        {
          text: "COMMITTEE",
          align: "center",
          value: "Committee",
        },
      ],
    };
  },

  async asyncData({ $axios, store }) {
    let countGroup, majors, yearNSemsters;
    try {
      // Fetch all majors
      majors = await $axios.$get("/major/getAllActiveMajors");
      majors.unshift({ Major_ID: 0, Major_Name: "All" });

      // Fetch all years and semesters
      yearNSemsters = await $axios.$get("/date/allYearsSemester");

      // Fetch count group
      countGroup = await $axios.$post("/group/countOwnGroup", {
        Academic_Year: yearNSemsters[0].Academic_Year,
        Academic_Term: yearNSemsters[0].Academic_Term,
      });
    } catch (error) {
      console.log(error);
    }

    return { countGroup: countGroup.data, majors, yearNSemsters };
  },

  methods: {
    async handelchangeRender(year, semester, majorId, role) {
      try {
        const res = await this.$axios.$post("/group/countOwnGroup", {
          Academic_Year: year,
          Academic_Term: semester,
        });

        if (res.status === 200) {
          this.$nuxt.refresh();
        }
        this.dialog = false;
      } catch (error) {}
    },
  },
};
</script>
