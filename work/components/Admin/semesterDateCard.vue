<template>
  <v-card class="semester-date-card">
    <v-card-title style="padding: 1rem 1rem 0">ASSIGNMENT</v-card-title>
    <!-- Semester date table -->
    <div class="semester-date-content">
      <!-- Table attr -->
      <h4>SEMESTER</h4>
      <h4>START DATE</h4>
      <h4>END DATE</h4>
      <h4>ACTIONS</h4>

      <!-- Table records -->
      <template v-for="data in dateData">
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
            <v-date-picker
              v-model="data.selectedDate"
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
                  dateMenuSave(data.Project_on_term_ID, data.selectedDate)
                "
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </div>
      </template>
    </div>
  </v-card>
</template>

<script>
export default {
  props: { academicYear: Number },
  data() {
    return {
      date: null,
      dateData: [
        {
          Project_on_term_ID: 1,
          Academic_Term: "1",
          selectedDate: [
            new Date().toISOString().substr(0, 10),
            new Date().toISOString().substr(0, 10)
          ],
          dateMenu: false
        },
        {
          Project_on_term_ID: 2,
          Academic_Term: "2",
          selectedDate: [
            new Date().toISOString().substr(0, 10),
            new Date().toISOString().substr(0, 10)
          ],
          dateMenu: false
        }
      ]
    };
  },
  async fetch() {
    try {
      // Fetch latest project on term
      this.dateData = await this.$axios.$get("/date/semester/get");
      // Sort by academic term
      this.dateData.sort((a, b) => a.Academic_Term - b.Academic_Term);
      // Offset date to the locale timezone, else it'll be one day different
      this.dateData = this.dateData.map(itm => {
        const baseStart = new Date(itm.Access_Date_Start);
        const baseEnd = new Date(itm.Access_Date_End);
        return {
          ...itm,
          Access_Date_Start: new Date(
            baseStart.getTime() - baseStart.getTimezoneOffset() * 60000
          ).toISOString(),
          Access_Date_End: new Date(
            baseEnd.getTime() - baseEnd.getTimezoneOffset() * 60000
          ).toISOString()
        };
      });
      // Extract start and end date into an array
      this.dateData = this.dateData.map(itm => ({
        ...itm,
        selectedDate: [
          itm.Access_Date_Start.slice(0, 10),
          itm.Access_Date_End.slice(0, 10)
        ]
      }));
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async dateMenuSave(id, date) {
      const res = await this.$axios.$post("/date/semester/update", {
        data: [...date, id]
      });
      if (res.status === 200) {
        // Update date picker UI
        this.$refs["dateMenu" + id][0].save(date);
        // console.log(this.$refs["dateMenu" + id][0]);
      }
    },
    allowedDates: val => val >= new Date().toISOString().slice(0, 10)
  }
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
