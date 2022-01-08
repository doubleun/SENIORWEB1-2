<template>
  <div>
    <!-- Sorting buttons -->
    <v-row class="mb-4 justify-end">
      <v-col cols="12" sm="2">
        <p class="white--text my-0">Year</p>
        <v-select
          v-model="selectedYear"
          :items="yearNSemsters.map(itm => itm.Academic_Year)"
          @change="handleChangeRenderGroups"
          dense
          solo
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="1">
        <p class="white--text my-0">Semester</p>
        <v-select
          v-model="selectedSemester"
          :items="yearNSemsters.map(itm => itm.Academic_Term)"
          @change="handleChangeRenderGroups"
          dense
          solo
          hide-details
        />
      </v-col>
    </v-row>
    <div class="dataTable">
      <!-- Data Table -->
      <v-card>
        <v-card-title>
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
          :items="groups"
          :search="search"
          item-key="Group_ID"
        >
          <!-- <template v-slot:item.Group_Name_Eng="{ item }">
            <v-row class="mb-6 pa-5 justify-space-around" no-gutters>
              <div style="cursor: pointer">
                {{ item.Group_Name_Eng }}
              </div>
            </v-row>
          </template> -->
          <template v-slot:item.actions="{ item }">
            <v-row class="justify-center py-5" no-gutters>
              <!-- <v-col md="3"> -->
              <v-row align="center" justify="space-around">
                <v-col>
                  <v-btn color="primary" @click="pushOtherPage(item.Group_ID)">
                    <v-icon left> mdi-eye-arrow-right </v-icon>
                    View
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    color="error"
                    @click="deleteGroup(item.Group_ID, item.Group_Name_Eng)"
                  >
                    <v-icon left> mdi-trash-can </v-icon>
                    Delete
                  </v-btn>
                </v-col>
                <!-- <v-row align="center" justify="space-around">
                  <v-btn
                    class="mb-10"
                    color="error"
                    @click="pushOtherPage(item.Group_ID)"
                  >
                    <v-icon left> mdi-trash-can </v-icon>
                    View
                  </v-btn>
                </v-row> -->
              </v-row>
              <!-- </v-col> -->
            </v-row>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    Group_Role: Number
  },
  data() {
    return {
      search: "",
      selectedYear: null,
      selectedSemester: null,
      loading: false,
      selected: [],
      students: [],
      advisor: [],
      committee: [],
      headers: [
        {
          text: "GROUP NAME",
          align: "center",
          sortable: false,
          value: "Group_Name_Eng"
        },
        { text: "MEMBER", align: "center", value: "Students" },
        { text: "ADVISOR", align: "center", value: "Advisor" },
        { text: "PROGRAM", align: "center", value: "Major" },
        { text: "COMMITTEE", align: "center", value: "Committees" },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          align: "center",
          width: 170
        }
      ],
      yearNSemsters: [],
      groups: []
    };
  },
  async fetch() {
    try {
      // let that = this;
      // Fetch all years and semesters
      this.yearNSemsters = await this.$axios.$get("/date/allYearsSemester");
      console.log("yearNsemester", this.yearNSemsters);

      this.selectedYear = this.yearNSemsters[0].Academic_Year;
      this.selectedSemester = this.yearNSemsters[0].Academic_Term;

      // Fetch initial group FIXME: use user major
      this.groups = await this.$axios.$post("/group/listOwnGroup", {
        User_Email: this.$store.state.auth.currentUser.email,
        Year: this.selectedYear,
        Semester: this.selectedSemester,
        Group_Role: this.Group_Role
      });
      console.log("groups", this.groups);
    } catch (err) {
      console.log(err);
    }
  },
  mounted() {
    // Set the default value
    console.log("test test", this.yearNSemsters);
    console.log("Group role", this.Group_Role);
  },
  methods: {
    // TODO: keep group id to state for scoring of group
    pushOtherPage(id) {
      this.$router.push(`/Senior1/coordinator/group${id}`);
    },
    async handleChangeRenderGroups() {
      // let this = this;
      this.loading = true;
      try {
        this.groups = await this.$axios.$post("/group/listOwnGroup", {
          User_Email: this.$store.state.auth.currentUser.email,
          Year: this.selectedYear,
          Semester: this.selectedSemester,
          Group_Role: this.Group_Role
        });
        this.groups.map(el => {
          if ((el.Group_Role = 0)) {
            this.advisor.push(el);
          }
        });
        this.loading = false;
        console.log(this.groups);
      } catch (error) {
        console.log(error);
      }
    },
    async deleteGroup(id, name) {
      this.$swal
        .fire({
          icon: "info",
          title: "Delete Group",
          html: `Are you want to Delete Group <b>${name}</b>?`,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes"
        })
        .then(async result => {
          if (result.isConfirmed) {
            const res = await this.$axios.$put("/group/delete/one", {
              Group_ID: id
            });
            if (res.status == 200) {
              this.$nuxt.refresh();
              this.$swal.fire("Successed", "Grade has been saved.", "success");
            } else {
              this.$swal.fire("Error", res.msg, "error");
            }
          }
        });
    }
  }
};
</script>
