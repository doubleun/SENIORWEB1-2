<template>
  <v-card class="due-assignment-card">
    <v-card-title style="padding: 1rem 1rem 0">ASSIGNMENT</v-card-title>
    <!-- Assignment table -->
    <v-container>
      <v-data-table
        :headers="headers"
        :items="progressionDuedate"
        :hide-default-footer="true"
        class="elevation-1"
      >
        <!-- set start/end date -->
        <template v-slot:item.DueDate_Start="{ item }">
          <span v-if="item.selectedDate[0] < item.selectedDate[1]">
            <span v-if="item.selectedDate[0] == offsetDate(access_Date_Start)">
              yyyy/mm/dd
            </span>
            <span v-else>
              {{ item.selectedDate[0] }}
            </span>
          </span>

          <span v-else>
            <span v-if="item.selectedDate[1] == offsetDate(access_Date_End)">
              yyyy/mm/dd
            </span>
            <span v-else>
              {{ item.selectedDate[1] }}
            </span>
          </span>
        </template>

        <template v-slot:item.DueDate_End="{ item }">
          <span v-if="item.selectedDate[0] > item.selectedDate[1]">
            <span v-if="item.selectedDate[0] == offsetDate(access_Date_Start)">
              yyyy/mm/dd
            </span>
            <span v-else>
              {{ item.selectedDate[0] }}
            </span>
          </span>

          <span v-else>
            <span v-if="item.selectedDate[1] == offsetDate(access_Date_End)">
              yyyy/mm/dd
            </span>

            <span v-else>
              {{ item.selectedDate[1] }}
            </span>
          </span>
        </template>

        <!--edit button -->
        <template v-slot:item.action="{ item }">
          <v-row class="justify-center" no-gutters>
            <v-col md="3">
              <v-row align="center" justify="space-around">
                <!-- <v-btn
                  color="blue darken-4"
                  class="white--text"
                  v-on="on"
                  v-bind="attrs"
                  ><v-icon>mdi-pen</v-icon> Edit</v-btn
                > -->
                <v-menu
                  :ref="'dateMenu' + item.Progress_ID"
                  v-model="item.dateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="blue lighten-1"
                      class="white--text px-5"
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon>mdi-calendar-month</v-icon> EDIT
                    </v-btn>
                  </template>
                  <v-date-picker
                    v-model="item.selectedDate"
                    :allowed-dates="allowedDates"
                    color=""
                    no-title
                    scrollable
                    range
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="item.dateMenu = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="
                        dateMenuSave(
                          item.selectedDate,
                          item.Progress_ID,
                          item.Progression_Info_ID
                        )
                      "
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-row>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-container>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      date: null,
      progressionDuedate: [],
      access_Date_Start: null,
      access_Date_End: null,
      totalFile: [],
      headers: [
        {
          text: "TOPIC",
          value: "Progress_Name",
          align: "center"
        },
        { text: "ASSIGNDATE", value: "DueDate_Start", align: "center" },
        { text: "DUEDATE", value: "DueDate_End", align: "center" },
        { text: "FILE", value: "totalFile", align: "center" },
        { text: "ACTION", value: "action", align: "center" }
      ]
    };
  },
  async fetch() {
    try {
      var duedate = await this.$axios.$post("/date/progression", {
        Senior: this.$store.state.auth.currentUser.senior,
        Major_ID: this.$store.state.auth.currentUser.major,
        Project_on_term_ID: this.$store.state.auth.currentUser.projectOnTerm
      });
      // console.log("progression Duedate", duedate);

      var criteria = await this.$axios.$post("/criteria/scoreMajor", {
        Major_ID: this.$store.state.auth.currentUser.major
      });

      // set ascess date
      this.access_Date_Start = duedate.projectOnTerm[0].Access_Date_Start;
      this.access_Date_End = duedate.projectOnTerm[0].Access_Date_End;

      // move topic to first
      const indexArr = criteria.findIndex(el => el.Progress_ID === 7);
      const topic = criteria.splice(indexArr, 1);

      criteria = [...topic, ...criteria];
      console.log("criteria old", criteria);

      // delete progress that don't have score (Total = 0)
      criteria.forEach(async (el, index) => {
        if (
          el.Total === 0 &&
          (el.Progress_ID === 1 ||
            el.Progress_ID === 2 ||
            el.Progress_ID === 3 ||
            el.Progress_ID === 4)
        ) {
          criteria.splice(index, 1);
          // return;
          // console.log("delete pg id", el.Progress_ID);
        }
      });

      // get count file
      for (let index = 0; index < criteria.length; index++) {
        let total = await this.$axios.$post("/assignment/countFile", {
          Project_on_term_ID: this.$store.state.auth.currentUser.projectOnTerm,
          Progress_ID: criteria[index].Progress_ID,
          Major: this.$store.state.auth.currentUser.major
        });
        criteria[index].totalFile = await total[0].TotalFile;
      }

      // map date
      // no due date in this semester
      if (duedate.progressionDuedate.length == 0) {
        criteria = criteria.map(el => ({
          ...el,
          selectedDate: [
            this.offsetDate(duedate.projectOnTerm[0].Access_Date_Start),
            this.offsetDate(duedate.projectOnTerm[0].Access_Date_End)
          ],
          Progression_Info_ID: 0,
          dateMenu: false
        }));
      } else {
        // console.log("have some due date");
        // if have due date in this semester
        for (let i = 0; i < criteria.length; i++) {
          for (let j = 0; j < duedate.progressionDuedate.length; j++) {
            // have some due date in this semster
            if (
              duedate.progressionDuedate[j].Progress_ID ==
              criteria[i].Progress_ID
            ) {
              criteria[i].selectedDate = [
                this.offsetDate(duedate.progressionDuedate[j].DueDate_Start),
                this.offsetDate(duedate.progressionDuedate[j].DueDate_End)
              ];
              criteria[i].Progression_Info_ID =
                duedate.progressionDuedate[j].Progression_Info_ID;

              criteria[i].dateMenu = false;
              break;
            }

            criteria[i].selectedDate = [
              this.offsetDate(duedate.projectOnTerm[0].Access_Date_Start),
              this.offsetDate(duedate.projectOnTerm[0].Access_Date_End)
            ];
            criteria[i].Progression_Info_ID = 0;

            criteria[i].dateMenu = false;
          }
        }
      }
      this.progressionDuedate = criteria;

      console.log("progression Duedate22", this.progressionDuedate);
    } catch (error) {}
  },

  methods: {
    allowedDates(val) {
      return (
        val >= this.offsetDate(this.access_Date_Start) &&
        val <= this.offsetDate(this.access_Date_End)
      );
    },

    // offset date
    offsetDate(date) {
      return new Date(
        new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
      )
        .toISOString()
        .substring(0, 10);
    },

    async dateMenuSave(date, progressId, progressInfoId) {
      var newDate = date.sort();
      console.log("sort date", newDate);

      let res = await this.$axios.$post("date/progression/update", {
        DueDate_Start: newDate[0],
        DueDate_End: newDate[1],
        Progress_ID: progressId,
        Progression_Info_ID: progressInfoId,
        Major_ID: this.$store.state.auth.currentUser.major,
        Project_on_term_ID: this.$store.state.auth.currentUser.projectOnTerm,
        Senior: this.$store.state.auth.currentUser.senior
      });

      if (res.status == 200) {
        console.log("success", res);
        // console.log("ref", this.$refs["dateMenu" + progressId]);
        this.$refs["dateMenu" + progressId] = false;
      }
    }
  }
};
</script>

<style>
.due-assignment-card {
  padding: 0.4rem 1.4rem 1rem;
}
.due-assignment-content p {
  margin: 0;
}
.due-assignment-content {
  display: grid;
  grid-template-columns: repeat(5, auto);
  overflow-x: auto;
  margin-block-start: 1rem;
  text-align: center;
  align-items: center;
  gap: 2rem 1rem;
}
@media only screen and (max-width: 600px) {
  .due-assignment-content {
    display: grid;
    grid-template-columns: 150px 110px 110px 60px 340px;
    overflow-x: auto;
    margin-block-start: 1rem;
    text-align: center;
    align-items: center;
    gap: 0.8rem 0.5rem;
    font-size: 14px;
  }
  .due-assignment-content .v-btn__content {
    font-size: 12px;
  }
  .due-assignment-content .v-icon {
    font-size: 16px !important;
  }
}
.due-assignment-content > h4 {
  margin-block: 1rem;
}
</style>
