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
          <div v-if="item.selectedDate[0] < item.selectedDate[1]">
            <span>
              {{ item.selectedDate[0] }}
            </span>
          </div>

          <div v-else>
            <span>
              {{ item.selectedDate[1] }}
            </span>
          </div>
        </template>

        <template v-slot:item.DueDate_End="{ item }">
          <div v-if="item.selectedDate[0] > item.selectedDate[1]">
            <span>
              {{ item.selectedDate[0] }}
            </span>
          </div>

          <div v-else>
            <span>
              {{ item.selectedDate[1] }}
            </span>
          </div>
        </template>

        <!--edit button -->
        <template v-slot:item.action="{ item, index }">
          <v-row class="justify-center" no-gutters>
            <v-col md="3">
              <v-row align="center" justify="space-around">
                <v-menu
                  :ref="'dateMenu' + item.Progress_ID"
                  v-model="item.dateMenu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="blue lighten-1"
                      class="white--text px-5"
                      v-on="on"
                      v-bind="attrs"
                      :disabled="!item.editable"
                    >
                      <v-icon>mdi-calendar-month</v-icon>
                      <span v-if="item.assignable">Assign</span>
                      <span v-else>Edit</span>
                    </v-btn>
                  </template>

                  <v-dialog
                    ref="dialog"
                    v-model="item.dateMenu"
                    :return-value.sync="date"
                    persistent
                    width="290px"
                  >
                    <v-card>
                      <v-date-picker
                        v-model="bindProgressionDuedate[index].selectedDate"
                        color=""
                        no-title
                        scrollable
                        range
                        :max="bindProgressionDuedate[index].endDate"
                        :min="bindProgressionDuedate[index].startDate"
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="item.dateMenu = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            // (item.isSelectDate = false),
                            dateMenuSave(
                              bindProgressionDuedate[index].selectedDate,
                              item.Progress_ID,
                              item.Progression_Info_ID,
                              index
                            )
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                      <div v-if="!item.isSelectDate" class="pa-5">
                        <span class="red--text text--lighten-1"
                          >Please completely to select assign date and
                          duedate</span
                        >
                      </div>
                    </v-card>
                  </v-dialog>
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
import utils from "@/mixins/utils";
export default {
  data() {
    return {
      date: null,
      progressionDuedate: [],
      bindProgressionDuedate: [],
      // selectedDate: [],
      access_Date_Start: null,
      access_Date_End: null,
      headers: [
        {
          text: "TOPIC",
          value: "Progress_Name",
          align: "center",
        },
        { text: "ASSIGNDATE", value: "DueDate_Start", align: "center" },
        { text: "DUEDATE", value: "DueDate_End", align: "center" },
        { text: "ACTION", value: "action", align: "center" },
      ],
    };
  },
  mixins: [utils],
  async fetch() {
    try {
      // fect duedate
      var duedate = await this.$axios.$post("/date/progression", {
        Senior: this.$store.state.auth.currentUser.senior,
        Major_ID: this.$store.state.auth.currentUser.major,
        Project_on_term_ID: this.$store.state.auth.currentUser.projectOnTerm,
      });
      // console.log("progression Duedate", duedate);

      var criteria = await this.$axios.$post("/criteria/scoreMajor", {
        Major_ID: this.$store.state.auth.currentUser.major,
        Project_on_term_ID: this.$store.state.auth.currentUser.projectOnTerm,
        onlyAvailable: true,
      });

      // Add in group and proposal before all available progress
      const progressTemplate = [
        {
          Major_ID: 1,
          Progress_ID: 1,
          Progress_Name: "Group",
          Project_on_term_ID: 15,
          Total: 0,
        },
        {
          Major_ID: 1,
          Progress_ID: 2,
          Progress_Name: "Proposal",
          Project_on_term_ID: 15,
          Total: 0,
        },
      ];
      criteria = [...progressTemplate, ...criteria];
      // console.log(" criteria1", criteria);

      // set ascess date
      this.access_Date_Start = duedate.projectOnTerm[0].Access_Date_Start;
      this.access_Date_End = duedate.projectOnTerm[0].Access_Date_End;

      // map date
      // no due date in this semester
      if (duedate.progressionDuedate.length == 0) {
        // console.log("No due date");
        criteria = criteria.map((el, index) => ({
          ...el,
          selectedDate: [
            this.offsetDate(Date.now()),
            this.offsetDate(Date.now()),
          ],
          Progression_Info_ID: 0,
          dateMenu: false,
          editable: index == 0 ? true : false,
          assignable: true,
          startDate: this.offsetDate(this.access_Date_Start),
          endDate: this.offsetDate(this.access_Date_End),
          isSelectDate: true,
        }));
      } else {
        // console.log("have some due date");
        // if have due date in this semester

        for (let i = 0; i < criteria.length; i++) {
          for (let j = 0; j < duedate.progressionDuedate.length; j++) {
            // have due date

            if (
              duedate.progressionDuedate[j].Progress_ID ==
              criteria[i].Progress_ID
            ) {
              criteria[i].selectedDate = [
                this.offsetDate(duedate.progressionDuedate[j].DueDate_Start),
                this.offsetDate(duedate.progressionDuedate[j].DueDate_End),
              ];
              criteria[i].Progression_Info_ID =
                duedate.progressionDuedate[j].Progression_Info_ID;

              criteria[i].dateMenu = false;

              criteria[i].editable = true;

              if (i != criteria.length - 1) {
                criteria[i + 1].editable = true;
              }
              criteria[i].assignable = false;

              // add start, end datepicker
              if (i == 0) {
                criteria[i].startDate = this.offsetDate(this.access_Date_Start);
              } else {
                criteria[i].startDate = this.plusOneDay(
                  criteria[i - 1].selectedDate[1]
                );
              }
              criteria[i].endDate = this.offsetDate(this.access_Date_End);
              criteria[i].isSelectDate = true;

              // console.log("index", i);
              break;
            }

            // don't have duedate
            criteria[i].selectedDate = [
              this.offsetDate(Date.now()),
              this.offsetDate(Date.now()),
            ];
            criteria[i].Progression_Info_ID = 0;

            criteria[i].dateMenu = false;
            criteria[i].editable = criteria[i].editable
              ? criteria[i].editable
              : false;
            criteria[i].assignable = true;

            criteria[i].startDate = this.plusOneDay(
              criteria[i - 1].selectedDate[1]
            );

            criteria[i].endDate = this.offsetDate(this.access_Date_End);
            criteria[i].isSelectDate = true;
          }
        }
      }

      this.progressionDuedate = criteria.sort((a, b) =>
        a.Progress_ID > b.Progress_ID ? 1 : -1
      );

      this.bindProgressionDuedate = this.handleCloneDeep(
        this.progressionDuedate
      );
    } catch (error) {}
  },

  computed: {},

  methods: {
    allowedDates(val) {
      return (
        val >= this.offsetDate(this.access_Date_Start) &&
        val <= this.offsetDate(this.access_Date_End)
      );
    },

    plusOneDay(date) {
      let offsetDate = new Date(
        new Date(date).setDate(new Date(date).getDate() + 1)
      )
        .toISOString()
        .substring(0, 10);

      // console.log("off set ", offsetDate);
      // console.log("ori ", date);
      return offsetDate;
    },

    // offset date
    offsetDate(date) {
      // console.log("offsetdate", date);
      return new Date(
        new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
      )
        .toISOString()
        .substring(0, 10);
    },

    async dateMenuSave(date, progressId, progressInfoId, index) {
      var newDate = date.sort();
      // console.log("sort date", newDate);
      // const progressionDuedateIndex = this.progressionDuedate.indexOf(item);
      console.log(newDate);

      // // let self = this;
      // if (newDate.length < 2) {
      //   this.progressionDuedate[index].isSelectDate = false;
      //   return (this.progressionDuedate[index].dateMenu = true);
      // }

      // // return;

      // this.progressionDuedate[index].isSelectDate = true;

      // let res = await this.$axios.$post("date/progression/update", {
      //   DueDate_Start: newDate[0],
      //   DueDate_End: newDate[1],
      //   Progress_ID: progressId,
      //   Progression_Info_ID: progressInfoId,
      //   Major_ID: this.$store.state.auth.currentUser.major,
      //   Project_on_term_ID: this.$store.state.auth.currentUser.projectOnTerm,
      //   Senior: this.$store.state.auth.currentUser.senior,
      // });

      // if (res.status == 200) {
      //   // console.log("success", res);

      //   await this.$nuxt.refresh();
      //   this.$swal.fire("Successed", "", "success");
      //   // console.log("ref", this.$refs["dateMenu" + progressId]);
      //   // this.$refs["dateMenu" + progressId] = false;
      // } else {
      //   this.$swal.fire("Something wrong", res.msg, "error");
      // }
    },
  },
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
