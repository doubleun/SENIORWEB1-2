<template>
  <v-container>
    <!-- <main class="due-assignment-card-main"> -->
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Document</h2>
    <v-card>
      <v-card-title>
        <h3>Document</h3>
        <v-spacer></v-spacer>
        <v-row class="d-flex justify-end">
          <v-col md="2" class="d-flex justify-end">
            <v-dialog v-model="dialogFilter" persistent max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mt-5 mr-2"
                  small
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon> mdi-filter-variant-plus </v-icon>
                </v-btn>
              </template>

              <!-- Action buttons -->
              <v-card>
                <v-card-title> Filter </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col md="3">
                      <p>Year</p>
                    </v-col>
                    <v-col md="9">
                      <v-select
                        v-model="selectedYear"
                        :items="yearNSemsters.map((itm) => itm.Academic_Year)"
                        dense
                        solo
                        hide-details
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col md="3">
                      <p>Semester</p>
                    </v-col>
                    <v-col md="9">
                      <v-select
                        v-model="selectedSemester"
                        :items="yearNSemsters.map((itm) => itm.Academic_Term)"
                        dense
                        solo
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="dialogFilter = false"
                  >
                    Close
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="handelchangeRenderDocument"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col md="6">
            <v-text-field
              v-model="search"
              clearable
              append-icon="mdi-magnify"
              label="Search"
              single-line
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table :headers="headers" :items="documents" :search="search">
        <!-- <template v-slot:item.action="{ item }">
          <v-row class="mb-6 pa-5 justify-center" no-gutters>
            <button @click="download(item)">download</button>
            <a href= item[0][4] download="">Download</a>
          </v-row>
        </template> -->
        <template v-slot:item.fileName="{ item }">
          <a target="_blank" :href="'/api/' + item.path">
            {{ item.fileName }}</a
          >
          <!-- <a href="/api/" {{ item.path}}>{{ item.fileName }}</a> -->
        </template>
      </v-data-table>
    </v-card>
    <!-- </main> -->
  </v-container>
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
      selectedYear: null,
      selectedSemester: null,
      yearNSemsters: [{ Academic_Term: 0, Academic_Year: 0 }],
      dialogFilter: false,
      headers: [
        {
          text: "File Name",
          value: "fileName",
          align: "center",
        },
        { text: "Type", value: "type", align: "center" },
        { text: "Submit Date", value: "submitDate", align: "center" },
        { text: "Group", value: "groupName", align: "center" },
        // { text: "Action", value: "action", align: "center" },
      ],
      documents: [],
    };
  },
  async fetch() {
    // TODO: This is big fetch, put this in a state and check if exists before fetch it
    // Fetch students and teachers
    try {
      this.yearNSemsters = await this.$axios.$get("/date/allYearsSemester");
      console.log("this.yearNSemsters: ", this.yearNSemsters);

      this.documents = await this.$axios.$post("/group/getAllFilesMajor", {
        Academic_Year: this.yearNSemsters[0].Academic_Year,
        Academic_Term: this.yearNSemsters[0].Academic_Term,
        Major: this.$store.state.auth.currentUser.major,
      });

      console.log("res", this.documents);

      this.documents.map((el) => {
        el.submitDate = this.offsetDate(el.submitDate);
      });
    } catch (error) {
      console.log(error);
    }
  },

  mounted() {
    this.selectedYear = this.yearNSemsters[0].Academic_Year;
    this.selectedSemester = this.yearNSemsters[0].Academic_Term;
  },
  methods: {
    offsetDate(date) {
      // console.log("offsetdate", date);
      let offsetDate = new Date(
        new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
      ).toISOString();
      return (
        offsetDate.split("T")[0] + "\t" + offsetDate.split("T")[1].split(".")[0]
      );
    },
    download(item) {
      window.location.href = "/api/" + item["path"];
    },
    async handelchangeRenderDocument() {
      try {
        this.documents = await this.$axios.$post("/group/getAllFilesMajor", {
          Academic_Year: this.selectedYear,
          Academic_Term: this.selectedSemester,
          Major: this.$store.state.auth.currentUser.major,
        });
      } catch (error) {
        console.log(error);
      }
      this.dialogFilter = true;
    },
  },
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
