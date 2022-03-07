<template>
  <v-card class="semester-date-card">
    <v-card-title style="padding: 1rem 1rem 0"></v-card-title>
    <!-- Semester date table -->
    <div class="semester-date-content">
      <!-- Table attr -->
      <h4>SEMESTER</h4>
      <h4>START DATE</h4>
      <h4>END DATE</h4>
      <h4>ACTIONS</h4>

      <!-- Table records -->
      <template v-for="(data, index) in dateData">
        <p :key="data.Academic_Term + 9">
          {{ data.Academic_Term + "/" + academicYear }}
        </p>
        <p :key="data.Academic_Term + 99">{{ data.selectedDate[0] }}</p>
        <p :key="data.Academic_Term + 999">{{ data.selectedDate[1] }}</p>
        <div :key="data.Academic_Term + 9999">
          <!-- Edit assign date -->
          <v-menu
            :ref="'dateMenu' + data.Project_on_term_ID"
            v-model="data.dateMenu"
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
            <v-dialog
              ref="dialog"
              v-model="data.dateMenu"
              :return-value.sync="date"
              persistent
              width="290px"
            >
              <v-date-picker
                v-model="bindDate[index].selectedDate"
                :allowed-dates="allowedDates"
                color=""
                no-title
                scrollable
                range
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="data.dateMenu = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="
                    dateMenuSave(
                      data.Project_on_term_ID,
                      bindDate[index].selectedDate,
                      index
                    )
                  "
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-menu>
        </div>
      </template>
    </div>

    <!-- Add new semester -->
    <template>
      <div class="text-center" v-show="dateData.length < 3">
        <v-dialog v-model="newSemesterDateDialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <div class="mt-5 mb-2 d-flex justify-center">
              <v-btn color="primary dark-1" dark v-bind="attrs" v-on="on"
                >+ Add new semester</v-btn
              >
            </div>
          </template>

          <!-- Dialog card -->
          <v-card>
            <v-card-title class="text-h5 mb-3"> Add new semester </v-card-title>
            <v-row class="mx-5">
              <v-col class="d-flex" cols="12" sm="12" md="4">
                <div class="d-flex flex-column">
                  <p class="text-subtitle-2 my-0">Semester</p>
                  <v-select
                    :items="availableSemesters"
                    v-model="selectedSemester"
                    placeholder="Ex: 1"
                    dense
                    hide-details
                    outlined
                  ></v-select>
                </div>
              </v-col>
              <v-col class="d-flex" cols="12" sm="12" md="8">
                <div class="d-flex flex-column" style="width: 100%">
                  <p class="text-subtitle-2 my-0">Year</p>
                  <v-form ref="form" v-model="valid">
                    <v-text-field
                      placeholder="Ex: 2021"
                      v-model="academicYear"
                      disabled
                      full-width
                      outlined
                      dense
                    ></v-text-field>
                  </v-form>
                </div>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                depressed
                class="px-5 my-1"
                @click="handleNewSemester"
              >
                Add
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-card>
</template>

<script>
import utils from "@/mixins/utils";
export default {
  //asd
  props: { academicYear: Number },
  data() {
    return {
      newSemesterDateDialog: false,
      availableSemesters: [1, 2, 3],
      selectedSemester: null,
      valid: true,
      date: null,
      dateData: [
        {
          Project_on_term_ID: 1,
          Academic_Term: "1",
          selectedDate: [
            new Date().toISOString().substr(0, 10),
            new Date().toISOString().substr(0, 10),
          ],
          dateMenu: false,
        },
        {
          Project_on_term_ID: 2,
          Academic_Term: "2",
          selectedDate: [
            new Date().toISOString().substr(0, 10),
            new Date().toISOString().substr(0, 10),
          ],
          dateMenu: false,
        },
      ],
      bindDate: [
        {
          Project_on_term_ID: 1,
          Academic_Term: "1",
          selectedDate: [
            new Date().toISOString().substr(0, 10),
            new Date().toISOString().substr(0, 10),
          ],
          dateMenu: false,
        },
        {
          Project_on_term_ID: 2,
          Academic_Term: "2",
          selectedDate: [
            new Date().toISOString().substr(0, 10),
            new Date().toISOString().substr(0, 10),
          ],
          dateMenu: false,
        },
      ],
    };
  },
  mixins: [utils],
  async fetch() {
    try {
      // Fetch latest project on term
      this.dateData = await this.$axios.$post("/date/semester/get", {
        year: this.academicYear,
      });
      if (this.dateData.length !== 0) {
        // Sort by academic term
        this.dateData.sort((a, b) => a.Academic_Term - b.Academic_Term);
        // Offset date to the locale timezone, else it'll be one day different
        this.dateData = this.dateData.map((itm) => {
          const baseStart = new Date(itm.Access_Date_Start);
          const baseEnd = new Date(itm.Access_Date_End);
          return {
            ...itm,
            Access_Date_Start: new Date(
              baseStart.getTime() - baseStart.getTimezoneOffset() * 60000
            ).toISOString(),
            Access_Date_End: new Date(
              baseEnd.getTime() - baseEnd.getTimezoneOffset() * 60000
            ).toISOString(),
          };
        });
        // Extract start and end date into an array
        this.dateData = this.dateData.map((itm) => ({
          ...itm,
          selectedDate: [
            itm.Access_Date_Start.slice(0, 10),
            itm.Access_Date_End.slice(0, 10),
          ],
        }));
        // Check if semster alrady exists
        const existsSemesters = this.dateData.map((el) => el.Academic_Term);
        this.availableSemesters = this.availableSemesters.filter(
          (el) => !existsSemesters.includes(el)
        );

        // data bind
        this.bindDate = this.handleCloneDeep(this.dateData);
      }
      console.log("Fetched, Date data: ", this.dateData);
    } catch (err) {
      console.log(err);
    }
  },
  watch: {
    // When new academic year is created from the parent's function, this child component will re-fetch the semester date
    academicYear(val) {
      console.log("academicYear changed");
      this.$fetch();
    },
  },
  methods: {
    async dateMenuSave(id, date, index) {
      var sortDate = date.sort();
      const res = await this.$axios.$post("/date/semester/update", {
        data: [...date, id],
      });
      if (res.status === 200) {
        // Update date picker UI
        this.$swal.fire("Successed!", "", "success");
        this.$refs["dateMenu" + id][0].save(date);
        this.dateData[index] = this.bindDate[index];
        // console.log(this.$refs["dateMenu" + id][0]);
      }
    },
    async handleNewSemester() {
      try {
        // // If selected semster is invalid display error and return
        // if (
        //   !this.availableSemesters.includes(this.selectedSemester) ||
        //   this.selectedSemester < 0
        // ) {
        //   this.$swal.fire('Invaid semester', 'Please try again later', 'warning')
        //   return;
        // }
        const res = await this.$axios.$post(
          "http://localhost:3000/api/date/semester/new",
          {
            data: [
              {
                year: this.academicYear,
                term: this.selectedSemester,
                dateStart: new Date().toISOString().substr(0, 10),
                dateEnd: new Date().toISOString().substr(0, 10),
              },
            ],
          }
        );
        // Close add new semester dialog
        this.newSemesterDateDialog = false;
        // Re-fetch new data
        await this.$fetch();
      } catch (err) {
        console.log(err);
      }
    },
    allowedDates: (val) => val >= new Date().toISOString().slice(0, 10),
  },
};
</script>

<style>
.semester-date-card {
  padding: 0.4rem 1.4rem 1rem;
}
.semester-date-content p {
  margin: 0;
}
.semester-date-content {
  display: grid;
  grid-template-columns: repeat(4, auto);
  overflow-x: auto;
  margin-block-start: 1rem;
  text-align: center;
  align-items: center;
  gap: 2rem 1rem;
}
@media only screen and (max-width: 600px) {
  .semester-date-content {
    display: grid;
    grid-template-columns: auto 90px 80px 200px;
    overflow-x: auto;
    margin-block-start: 1rem;
    text-align: center;
    align-items: center;
    gap: 1rem;
    font-size: 14px;
  }
  .semester-date-content .v-btn__content {
    font-size: 12px;
  }
  .semester-date-content .v-icon {
    font-size: 16px !important;
  }
}
.semester-date-content > h4 {
  margin-block: 1rem;
}
</style>
