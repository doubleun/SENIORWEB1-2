<template>
  <section>
    <!-- <main class="admin-group-manage-main"> -->
    <!-- <v-row class="col-6 pb-12" style="color: #fff"
      ><p style="font-size: 28px; font-weight: bold">Group</p></v-row
    > -->
    <h1 style="color: white">Group</h1>
    <!-- <button @click="test">test</button> -->

    <!-- Action buttons -->
    <div class="my-5 d-flex justify-end">
      <div>
        <v-btn color="success" @click="handleExports(selected, allGroups)"
          ><v-icon>mdi-microsoft-excel</v-icon>Export to Excel</v-btn
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
        v-model="selected"
        :headers="headers"
        item-key="Group_ID"
        :items="allGroups"
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
  </section>
</template>

<script>
// import LongTableCard from "@/components/admin/longTableCard";
import exportXLSX from "@/mixins/exportXLSX";

export default {
  layout: "admin",
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
  async asyncData({ $axios }) {
    let majors, yearNSemsters, allGroups;

    try {
      // Fetch all majors
      majors = await $axios.$get("/user/getAllMajors");
      // Fetch all years and semesters
      yearNSemsters = await $axios.$get("/date/allYearsSemester");
      /// Fetch initial group
      allGroups = await $axios.$post("/group/getAllAdmin", {
        Major: majors[0].Major_ID,
        Year: yearNSemsters[0].Academic_Year,
        Semester: yearNSemsters[0].Academic_Term,
      });
    } catch (err) {
      console.log(err);
    }

    return { majors, yearNSemsters, allGroups };
  },
  methods: {
    // TODO: Delete This
    test() {
      console.log(this.majors);
      console.log(this.yearNSemsters);
      console.log(this.allGroups);
    },
    // TODO: Delete This
    testSelect() {
      console.log(this.selected);
    },
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
    // async deletegroup() {
    //   this.loading = true;
    //   this.dialog1 = false;
    //   // this.selectedgroupid.push(this.selected[0]['Group_ID'])
    //   // Create new array with only 2 values that the api needs

    //   const data = this.selected.map((itm) => ({
    //     Group_ID: itm.Group_ID,
    //     Group_Status: 0,
    //   }));
    //   // Fetch update API
    //   const res = await this.$axios.$put("/group/delete", {
    //     data,
    //   });

    //   console.log(res);
    //   console.log("Before Update: ", this.allGroups);
    //   // Update UI
    //   this.allGroups = this.allGroups.filter(
    //     (itm) => !res.result.includes(itm.Group_ID)
    //   );

    //   console.log("UI update: ", this.allGroups);

    //   console.log(this.selectedgroupid);

    //   this.loading = false;
    // },
    async handleChangeRenderGroups() {
      this.loading = true;
      // Clear selected group from the past filter
      this.selected = [];
      this.allGroups = await this.$axios.$post("group/getAllAdmin", {
        Major: this.selectedMajor.Major_ID,
        Year: this.selectedYear,
        Semester: this.selectedSemester,
      });
      this.loading = false;
    },
  },
  mixins: [exportXLSX],
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
