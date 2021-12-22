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
<<<<<<< Updated upstream
          <v-btn color="error"><v-icon>mdi-trash-can</v-icon> Delete</v-btn>
        </div>
      </div>

      <!-- Group table card -->
      <LongTableCard tableTitle="Group">
        <template v-slot:data>
          <!-- Table attributes -->
          <template v-for="attr in attrs">
            <h5 :key="attr">{{ attr }}</h5>
          </template>

          <!-- Table data -->
          <template v-for="group in groupsArr">
            <div :key="group.id + 1" class="group-manage-checkbox-container">
              <v-checkbox v-model="checkbox" value="John" hide-details dense>
                <template v-slot:label>
                  <h5>{{ group.name }}</h5>
                </template>
              </v-checkbox>
            </div>
            <p :key="group.id + 2">{{ group.member }}</p>
            <p :key="group.id + 3">{{ group.program }}</p>
            <p :key="group.id + 4">{{ group.advisor }}</p>
            <p :key="group.id + 5">{{ group.committee.join(", ") }}</p>
=======
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
>>>>>>> Stashed changes
          </template>
        </template>
      </LongTableCard>
    </main>
  </section>
</template>

<script>
import LongTableCard from "@/components/Admin/longTableCard";

export default {
  layout: "admin",
  components: {
    LongTableCard
<<<<<<< Updated upstream
  },
  data: () => ({
    programsArr: ["Information and Communication Engineering"],
    yearsArr: ["2021"],
    semestersArr: ["1/2021", "2/2021"],
    attrs: ["GROUP NAME", "MEMBER", "PROGRAM", "ADVISOR", "COMMITTEE"],
    groupsArr: [
      {
        id: 1,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 2,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 3,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 4,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 5,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 6,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 7,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 8,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 9,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 10,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      }
    ]
  })
=======
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
    const majors = await context.$axios.$get(
      "http://localhost:3000/api/user/getAllMajors"
    );
    // Fetch all years and semesters
    const yearNSemsters = await context.$axios.$get(
      "http://localhost:3000/api/date/allYearsSemester"
    );
    /// Fetch initial group
    const allGroups = await context.$axios.$post(
      "http://localhost:3000/api/group/getAllAdmin",
      {
        Major: majors[0].Major_ID,
        Year: yearNSemsters[0].Academic_Year,
        Semester: yearNSemsters[0].Academic_Term
      }
    );
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
      this.allGroups = await this.$axios.$post(
        "http://localhost:3000/api/group/getAllAdmin",
        {
          Major: this.selectedMajor.Major_ID,
          Year: this.selectedYear,
          Semester: this.selectedSemester
        }
      );
      this.loading = false;
    }
  }
>>>>>>> Stashed changes
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
