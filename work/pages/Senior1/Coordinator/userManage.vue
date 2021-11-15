<template>
  <div>
    <v-container>
      <h2 class="header-title mb-2 mt-5 mb-10 white--text">User Manage</h2>
      <v-row class="btsem">
        <v-col cols="6" sm="6" md="6" lg="6">
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
        <v-col cols="6" sm="6" md="6" lg="6">
          <div class="login" align="center" justify="center">
            <v-row>
              <v-btn
                :loading="loading3"
                :disabled="loading3"
                class="mb-1 mt-7 mb-1 ma-2 dark-blue--text"
              >
                <v-icon dark-blue>
                  mdi-application-import
                </v-icon>

                Import
              </v-btn>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <userDataTable />
    </v-container>
  </div>
</template>
<script>
import userDataTable from "@/components/Coordinator/๊userDataTable";
export default {
  data: () => ({
    sem: ["1/2564", "2/2564"]
  }),
  components: {
    userDataTable
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
  padding-left: 70%;
}
</style>
