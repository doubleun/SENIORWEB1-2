<template>
  <div>
    <v-container>
      <h2 class="header-title mb-2 mt-5 mb-10 white--text">Score</h2>
      <v-row class="btsem">
        <v-col cols="4" sm="4" md="4" lg="4">
          <div class="login" align="center" justify="center">
            <v-row><h4 class="white--text">Semester</h4></v-row>
            <v-row>
              <v-select
                :items="sem"
                label="semester"
                dense
                solo
                class="teb mb-1 mt-1 ma-2 mb-1"
              ></v-select>
            </v-row>
          </div>
        </v-col>
        <v-col cols="4" sm="4" md="4" lg="4">
          <div class="login" align="center" justify="center">
            <v-row><h4 class="white--text">Grade</h4></v-row>
            <v-row>
              <v-select
                :items="grade"
                label="Grade"
                dense
                solo
                class="teb mb-1 mt-1 mb-1"
              ></v-select>
            </v-row>
          </div>
        </v-col>
        <v-col cols="4" sm="4" md="4" lg="4">
          <div class="login" align="center" justify="center">
            <v-row>
              <v-btn
                :loading="loading3"
                :disabled="loading3"
                @click="handleExports"
                class="mb-1 mt-7 mb-1 ma-2 dark-blue--text"
              >
                Export to Excel
              </v-btn>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <scoreDataTable :items="items" />
    </v-container>
  </div>
</template>
<script>
import scoreDataTable from "@/components/Coordinator/scoreDataTable";
import exportXLSX from "@/mixins/exportXLSX";
export default {
  data: () => ({
    loading3: false,
    sem: ["1/2564", "2/2564"],
    grade: ["S", "U", "I"],
    items: [
      {
        id: "6131302010",
        name: "Anuthep Tayngam",
        advisor: "Surapong uttama",
        progress1: "10",
        progress2: "10",
        finalpresent: "25",
        finaldocument: "45",
        total: "90",
        grade: "S"
      },
      {
        id: "6131302010",
        name: "Anuthep Tayngam",
        advisor: "Surapong uttama",
        progress1: "10",
        progress2: "10",
        finalpresent: "25",
        finaldocument: "45",
        total: "90",
        grade: "S"
      },
      {
        id: "6131302010",
        name: "Anuthep Tayngam",
        advisor: "Surapong uttama",
        progress1: "10",
        progress2: "10",
        finalpresent: "25",
        finaldocument: "45",
        total: "90",
        grade: "S"
      },
      {
        id: "6131302010",
        name: "Anuthep Tayngam",
        advisor: "Surapong uttama",
        progress1: "10",
        progress2: "10",
        finalpresent: "25",
        finaldocument: "45",
        total: "90",
        grade: "S"
      },
      {
        id: "6131302010",
        name: "Anuthep Tayngam",
        advisor: "Surapong uttama",
        progress1: "10",
        progress2: "10",
        finalpresent: "25",
        finaldocument: "45",
        total: "90",
        grade: "S"
      },

      {
        id: "6131302010",
        name: "Anuthep Tayngam",
        advisor: "Surapong uttama",
        progress1: "10",
        progress2: "10",
        finalpresent: "25",
        finaldocument: "45",
        total: "90",
        grade: "S"
      },
      {
        id: "6131302010",
        name: "Anuthep Tayngam",
        advisor: "Surapong uttama",
        progress1: "10",
        progress2: "10",
        finalpresent: "25",
        finaldocument: "45",
        total: "90",
        grade: "S"
      },
      {
        id: "6131302010",
        name: "Anuthep Tayngam",
        advisor: "Surapong uttama",
        progress1: "10",
        progress2: "10",
        finalpresent: "25",
        finaldocument: "45",
        total: "90",
        grade: "S"
      },
      {
        id: "6131302010",
        name: "Anuthep Tayngam",
        advisor: "Surapong uttama",
        progress1: "10",
        progress2: "10",
        finalpresent: "25",
        finaldocument: "45",
        total: "90",
        grade: "S"
      }
    ]
  }),
  mixins: [exportXLSX],
  components: {
    scoreDataTable
  },
  layout: "coordinatorsidebar"
};
</script>
<style scoped>
.v-btn:hover {
  background-color: #1a237e; /* blue */
  color: white;
}
.btsem {
  padding-left: 60%;
}
.teb {
  width: 100%;
}
.login {
  margin-top: 2px;
  margin-right: 3px;
  width: 100%;
}
.h4 {
  color: white;
}
</style>
