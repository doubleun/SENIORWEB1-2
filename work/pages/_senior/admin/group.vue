<template>
  <v-container>
    <!-- <main class="admin-group-manage-main"> -->
    <!-- <v-row class="col-6 pb-12" style="color: #fff"
      ><p style="font-size: 28px; font-weight: bold">Group</p></v-row
    > -->
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Group</h2>
    <!-- <button @click="test">test</button> -->
    <SelectSenior />

    <!-- Action buttons -->
    <div class="my-5 d-flex justify-end" style="gap: 0.5rem; flex-wrap: wrap">
      <div>
        <v-btn color="success" @click="handleExports(selected, allGroups)"
          ><v-icon>mdi-microsoft-excel</v-icon>Export to Excel</v-btn
        >
      </div>
      <div>
        <v-btn
          color="indigo darken-2"
          dark
          @click="handleMoveGroups"
          v-if="$store.getters['auth/currentUser'].senior === 1"
          ><v-icon>mdi-microsoft-excel</v-icon>Move group to senior 2</v-btn
        >
      </div>
    </div>

    <v-card>
      <v-card-title>
        <h3>Groups</h3>
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
                      <p>Study Program</p>
                    </v-col>
                    <v-col md="9">
                      <v-select
                        v-model="selectedMajor"
                        :items="majors"
                        item-text="Major_Name"
                        item-value="Major_ID"
                        return-object
                        dense
                        solo
                        hide-details
                        off
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="manageTeacher">
                    <v-col md="3">
                      <p>Role</p>
                    </v-col>
                    <v-col md="9">
                      <v-select
                        v-model="selectedRole"
                        :items="roles"
                        item-text="Role_Name"
                        item-value="Role_ID"
                        return-object
                        dense
                        solo
                        hide-details
                      />
                    </v-col>
                  </v-row>
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
                    @click="handleChangeRenderGroups"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col md="6"
            ><v-text-field
              v-model="searchGroup"
              clearable
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field
          ></v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="allGroups"
        item-key="Group_ID"
        :search="searchGroup"
      >
        <template v-slot:item.Group_Name_Eng="props">
          <v-row class="pa-2 justify-space-around" no-gutters>
            <div style="cursor: pointer">
              {{ props.item.Group_Name_Eng }}
            </div>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
    <!-- </main> -->
  </v-container>
</template>

<script>
// import LongTableCard from "@/components/admin/longTableCard";
import exportXLSX from "@/mixins/exportXLSX";
import dialog from "@/mixins/dialog";

export default {
  layout: "admin",
  mixins: [exportXLSX, dialog],
  data() {
    return {
      searchGroup: "",
      selectedMajor: {},
      selectedYear: null,
      selectedSemester: null,
      loading: false,
      dialog1: false,
      singleSelect: false,
      selected: [],
      selectedgroupid: [],
      dialogFilter: false,
      manageTeacher: false,
      headers: [
        {
          text: "GROUP NAME",
          align: "center",
          sortable: false,
          value: "Group_Name_Eng",
        },
        { text: "MEMBER", align: "center", value: "Students" },
        { text: "PROGRAM", align: "center", value: "Major" },
        { text: "ADVISOR", align: "center", value: "Advisor" },
        { text: "COMMITTEE", align: "center", value: "Committee" },
      ],
    };
  },
  mounted() {
    // Set the default value
    this.selectedMajor = this.majors[0];
    this.selectedYear = this.yearNSemsters[0].Academic_Year;
    this.selectedSemester = this.yearNSemsters[0].Academic_Term;
  },
  async asyncData({ $axios, store }) {
    let majors, yearNSemsters, allGroups;

    const senior = store.getters["auth/currentUser"].senior;
    try {
      if (!senior) throw new Error("Cannot find senior");
      // Fetch all majors
      majors = await $axios.$get("/major/getAllActiveMajors");
      // Fetch all years and semesters
      yearNSemsters = await $axios.$get("/date/allYearsSemester");
      /// Fetch initial group
      allGroups = await $axios.$post("/group/getAllAdmin", {
        Major: majors[0].Major_ID,
        Year: yearNSemsters[0].Academic_Year,
        Semester: yearNSemsters[0].Academic_Term,
        Senior: senior,
      });
    } catch (err) {
      console.log(err);
      return { majors: [], yearNSemsters: [], allGroups: [] };
    }

    return { majors, yearNSemsters, allGroups };
  },
  methods: {
    checkdia() {
      if (this.selected.length == 0) {
        this.$swal.fire({
          // title: "Error!",
          text: "Please select at least one group",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        this.dialog1 = true;
      }
    },
    async handleMoveGroups() {
      const moveGroups = async () => {
        // Fetch project on term id for the group's next senior (ie. senior 2 projectOnTermId based on this group year and semster)
        const projectOnTerm = await this.$axios.$post("date/getProjectOnTerm", {
          Academic_Year: this.selectedYear,
          Academic_Term: this.selectedSemester,
          Senior: 2,
        });
        // console.log("projectOnTerm: ", projectOnTerm);

        return this.$axios.$post("group/moveGroup", {
          // FIXME: This seems like a bad idea ?
          Project_on_term_ID: projectOnTerm.Project_on_term_ID,
        });
      };
      await this.showLoading(moveGroups);
    },
    async handleChangeRenderGroups() {
      this.loading = true;
      // Clear selected group from the past filter
      this.selected = [];
      this.allGroups = await this.$axios.$post("group/getAllAdmin", {
        Major: this.selectedMajor.Major_ID,
        Year: this.selectedYear,
        Semester: this.selectedSemester,
        Senior: this.$store.getters["auth/currentUser"].senior,
      });
      this.loading = false;
      this.dialogFilter = false;
    },
  },
};
</script>

<style>
.admin-group-manage-main {
  margin-block-end: 2rem;
}
.admin-group-manage-main p,
.admin-group-manage-main h5 {
  font-size: 14px;
  margin: 0;
}
.admin-group-manage-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.admin-group-manage-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}

/* Group manage actions */
.admin-group-manage-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.admin-group-manage-actions .v-select {
  margin-block-end: 23px;
}
/* Reduce the second and third select box's width */
.admin-group-manage-actions > div:nth-child(n + 2):nth-child(-n + 3) {
  width: 10%;
}
.admin-group-manage-actions > div:first-child {
  width: 36%;
}
.admin-group-manage-actions > div:last-child {
  display: flex;
  gap: 0.5rem;
}

/* Group manage table card */
.group-manage-checkbox-container .v-input {
  margin: 0;
}

@media only screen and (max-width: 795px) {
  .admin-group-manage-actions > div:first-child {
    width: 50%;
  }
  .admin-group-manage-actions > div:nth-child(n + 2):nth-child(-n + 3) {
    width: 22%;
  }
  .admin-group-manage-actions .v-select {
    margin-block-end: 0.2rem;
  }
  .admin-group-manage-actions .v-btn {
    margin-block-end: 0.5rem;
  }
}
</style>
