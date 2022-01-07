<template>
  <section>
    <main class="admin-group-manage-main">
      <h1>Group</h1>
      <!-- <button @click="test">test</button> -->

      <!-- Action buttons -->
      <div class="admin-group-manage-actions">
        <div>
          <p class="white--text">Study Program</p>
          <v-select
            v-model="selectedMajor"
            :items="majors"
            @change="handleChangeRenderGroups"
            item-text="Major_Name"
            item-value="Major_ID"
            return-object
            dense
            solo
            hide-details
            off
          />
        </div>
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
        <div>
          <v-btn color="success" @click="handleExports(selected, allGroups)"
            ><v-icon>mdi-microsoft-excel</v-icon> Export to Excel</v-btn
          >
          <v-btn color="error" @click="checkdia"
            ><v-icon>mdi-trash-can</v-icon> Delete</v-btn
          >
        </div>
      </div>
      <v-dialog v-model="dialog1" max-width="500px">
        <v-card>
          <v-card-title>
            <span>Delete this?</span>
          </v-card-title>
          <v-card-text> Have you confirmed to delete this? </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="light" text right @click="dialog1 = false">
              Close
            </v-btn>
            <v-btn color="primary" right @click="deletegroup"> Yes </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card>
        <v-card-title>
          Group List
          <v-spacer></v-spacer>
          <v-col md="3"
            ><v-text-field
              v-model="searchGroup"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              outlined
            ></v-text-field
          ></v-col>
        </v-card-title>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :single-select="singleSelect"
          item-key="Group_ID"
          :items="allGroups"
          :search="searchGroup"
          show-select
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
    </main>
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
      headers: [
        {
          text: "GROUP NAME",
          align: "center",
          sortable: false,
          value: "Group_Name_Eng"
        },
        { text: "MEMBER", align: "center", value: "Students" },
        { text: "PROGRAM", align: "center", value: "Major" },
        { text: "ADVISOR", align: "center", value: "Advisor" },
        { text: "COMMITTEE", align: "center", value: "Committee" }
      ]
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
        Semester: yearNSemsters[0].Academic_Term
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
          confirmButtonText: "OK"
        });
      } else {
        this.dialog1 = true;
      }
    },
    async deletegroup() {
      this.loading = true;
      this.dialog1 = false;
      // this.selectedgroupid.push(this.selected[0]['Group_ID'])
      // Create new array with only 2 values that the api needs

      const data = this.selected.map(itm => ({
        Group_ID: itm.Group_ID,
        Group_Status: 0
      }));
      // Fetch update API
      const res = await this.$axios.$put("/group/delete", {
        data
      });

      console.log(res);
      console.log("Before Update: ", this.allGroups);
      // Update UI
      this.allGroups = this.allGroups.filter(
        itm => !res.result.includes(itm.Group_ID)
      );

      console.log("UI update: ", this.allGroups);

      console.log(this.selectedgroupid);

      this.loading = false;
    },
    async handleChangeRenderGroups() {
      this.loading = true;
      // Clear selected group from the past filter
      this.selected = [];
      this.allGroups = await this.$axios.$post("group/getAllAdmin", {
        Major: this.selectedMajor.Major_ID,
        Year: this.selectedYear,
        Semester: this.selectedSemester
      });
      this.loading = false;
    }
  },
  mixins: [exportXLSX]
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
