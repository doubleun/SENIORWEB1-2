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
          <v-btn color="success"
            ><v-icon>mdi-microsoft-excel</v-icon> Export to Excel</v-btn
          >
          <v-btn color="error" @click="dialog1 = true"
            ><v-icon>mdi-trash-can</v-icon> Delete</v-btn
          >
        </div>
      </div>
      <v-dialog v-model="dialog1" max-width="500px">
        <v-card>
          <v-card-title>
            <span>Delete this?</span>
          </v-card-title>
          <v-card-text>
            Have you confirmed to delete this?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="light" text right @click="dialog1 = false">
              Close
            </v-btn>
            <v-btn color="primary" right @click="dialog1 = false">
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card>
        <v-card-title>
          Group List
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
          v-model="selected"
          :headers="headers"
          :single-select="singleSelect"
          item-key="Group_ID"
          :items="allGroups"
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
import LongTableCard from "@/components/Admin/longTableCard";

export default {
  layout: "admin",
  components: {
    LongTableCard,
  },
  data() {
    return {
      dialog1: false,
      singleSelect: false,
      selected: [],
      headers: [
        {
          text: "GROUP NAME",
          align: "center",
          sortable: false,
          value: "groupName",
        },
        { text: "MEMBER", align: "center", value: "member" },
        { text: "PROGRAM", align: "center", value: "program" },
        { text: "ADVISOR", align: "center", value: "adviosr" },
        { text: "COMMITTEE", align: "center", value: "committee" },
      ],
      items: [
        {
          groupName:
            "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
          member: "Anuthep Tayngam, Pipat Marsri",
          program: "Computer Science and Innovation",
          adviosr: "Surapong Uttama",
          committee: "Khwnuta Kirimasthong, Sarawut Jaijma",
        },
        {
          groupName: "Ablefetch: Online Platform for Freelancing Service",
          member: "Sasreen Abdunsomad, Pipat Marsri",
          program: "Computer Science and Innovation",
          adviosr: "Nilubon Kurubanjerdjit ",
          committee: "Soontarin Nupap, Khwunta Kirimasthong",
        },
      ],
    };
  },
  data() {
    return {
      selectedMajor: {},
      selectedYear: null,
      selectedSemester: null,
      loading: false,
      dialog1: false,
      singleSelect: false,
      selected: [],
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
  async asyncData(context) {
    // Fetch all majors
    const majors = await context.$axios.$get("/user/getAllMajors");
    // Fetch all years and semesters
    const yearNSemsters = await context.$axios.$get("/date/allYearsSemester");
    /// Fetch initial group
    const allGroups = await context.$axios.$post("/group/getAllAdmin", {
      Major: majors[0].Major_ID,
      Year: yearNSemsters[0].Academic_Year,
      Semester: yearNSemsters[0].Academic_Term
    });
    return { majors, yearNSemsters, allGroups };
  },
  methods: {
    // TODO: Delete This
    test() {
      console.log(this.majors);
      console.log(this.yearNSemsters);
      console.log(this.allGroups);
    },
    async handleChangeRenderGroups() {
      this.loading = true;
      this.allGroups = await this.$axios.$post("group/getAllAdmin", {
        Major: this.selectedMajor.Major_ID,
        Year: this.selectedYear,
        Semester: this.selectedSemester
      });
      this.loading = false;
    }
  }
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
