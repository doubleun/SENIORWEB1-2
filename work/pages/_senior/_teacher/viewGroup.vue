<template>
  <v-container>
    <!-- <main class="admin-group-manage-main"> -->
    <!-- <v-row class="col-6 pb-12" style="color: #fff"
      ><p style="font-size: 28px; font-weight: bold">Group</p></v-row
    > -->
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Group</h2>
    <!-- <button @click="test">test</button> -->
    <SelectSenior v-if="role === 99" />

    <!-- Action buttons -->
    <div class="my-5 d-flex justify-end" style="gap: 0.5rem; flex-wrap: wrap">
      <div>
        <v-btn color="success" @click="handleExports(selected, allGroups)"
          ><v-icon>mdi-microsoft-excel</v-icon>Export to Excel</v-btn
        >
      </div>
    </div>

    <ViewGroupDetail
      :yearNSemsters="yearNSemsters"
      :allGroups="allGroups"
      :title="'Group'"
      @on-filtering="handleChangeRenderGroups"
    />
    <!-- </main> -->
  </v-container>
</template>

<script>
import exportXLSX from "@/mixins/exportXLSX";
import dialog from "@/mixins/dialog";

export default {
  mixins: [exportXLSX, dialog],
  layout: "coordinatorsidebar",
  data() {
    return {
      loading: false,
      manageTeacher: false,
    };
  },

  async asyncData({ $axios, store }) {
    let yearNSemsters, allGroups;

    const senior = store.getters["auth/currentUser"].senior;
    const role = store.getters["auth/currentUser"].role;

    try {
      if (!senior) throw new Error("Cannot find senior");

      // Fetch all years and semesters
      yearNSemsters = await $axios.$get("/date/allYearsSemester");
      /// Fetch initial group
      allGroups = await $axios.$post("/group/getAllAdmin", {
        Major: store.state.auth.currentUser.major,
        Year: yearNSemsters[0].Academic_Year,
        Semester: yearNSemsters[0].Academic_Term,
        Senior: senior,
      });
    } catch (err) {
      console.log(err);
      return { yearNSemsters: [], allGroups: [] };
    }

    return { yearNSemsters, allGroups, role };
  },

  methods: {
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
