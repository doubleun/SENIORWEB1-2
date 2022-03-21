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

    <ViewGroupDetail
      :majors="majors"
      :yearNSemsters="yearNSemsters"
      :allGroups="allGroups"
      isAdmin
      @on-filtering="handleChangeRenderGroups"
    />
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
      // selectedMajor: {},
      // selectedYear: null,
      // selectedSemester: null,
      loading: false,
      dialog1: false,
      singleSelect: false,
      selected: [],
      selectedgroupid: [],
      manageTeacher: false,
    };
  },
  mounted() {
    // Set the default value
    // this.selectedMajor = this.majors[0];
    // this.selectedYear = this.yearNSemsters[0].Academic_Year;
    // this.selectedSemester = this.yearNSemsters[0].Academic_Term;
  },
  async asyncData({ $axios, store }) {
    let majors, yearNSemsters, allGroups;

    const senior = store.getters["auth/currentUser"].senior;
    try {
      if (!senior) throw new Error("Cannot find senior");
      // Fetch all majors
      majors = await $axios.$get("/user/getAllMajors");
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
    async handleChangeRenderGroups(year, semester, major, senior) {
      this.loading = true;
      this.allGroups = await this.$axios.$post("group/getAllAdmin", {
        Major: major,
        Year: year,
        Semester: semester,
        Senior: senior,
      });
      this.loading = false;
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
