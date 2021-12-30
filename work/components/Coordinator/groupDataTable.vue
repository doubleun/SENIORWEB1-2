<template>
  <div>
    <!-- Action buttons -->
    <div class="admin-group-manage-actions">
      <div>
        <p class="white--text">Year</p>
        <v-select
          v-model="selectedYear"
          :items="yearNSemsters.map(itm => itm.Academic_Year)"
          @change="handleChangeRenderGroups"
          dense
          solo
          hide-details
        />
      </div>
      <div>
        <p class="white--text">Semester</p>
        <v-select
          v-model="selectedSemester"
          :items="yearNSemsters.map(itm => itm.Academic_Term)"
          @change="handleChangeRenderGroups"
          dense
          solo
          hide-details
        />
      </div>
    </div>
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
          <template v-slot:item.Group_Name_Eng="{ item }">
            <v-row class="mb-6 pa-5 justify-space-around" no-gutters>
              <div style="cursor: pointer">
                {{ item.Group_Name_Eng }}
              </div>
            </v-row>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-row class="justify-center" no-gutters>
              <v-col md="3">
                <v-row align="center" justify="space-around">
                  <v-btn color="primary" @click="handelViewGroup(item)">
                    <v-icon left> mdi-eye-arrow-right </v-icon>
                    View
                  </v-btn>
                </v-row>
              </v-col>
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
      dialog1: false,
      singleSelect: false,
      selected: [],
      selectedgroupid: {},
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

    // try {
    //   this.selectedYear = this.yearNSemsters[0].Academic_Year;
    //   this.selectedSemester = this.yearNSemsters[0].Academic_Term;
    // } catch (error) {
    //   console.log(error);
    // }
  },
  methods: {
    // TODO: keep group id to state for scoring of group
    async handelViewGroup(group) {
      console.log(group);
      // Dispatch event to store current user group info
      await this.$store.dispatch("group/storeTeacherGroupInfo", group.Group_ID);
      this.$router.push("/Senior1/Coordinator/groupInfo");
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
    }
  }
};
</script>
