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
      <template v-for="data in dummyData">
        <p :key="data.semester + 9">{{ data.semester }}</p>
        <p :key="data.semester + 99">{{ data.startDate }}</p>
        <p :key="data.semester + 999">{{ data.endDate }}</p>
        <div :key="data.semester + 9999">
          <!-- Edit assign date -->
          <v-menu
            :ref="'startDateMenu' + data.id"
            v-model="data.startDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="blue lighten-1"
                class="white--text"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon>mdi-calendar-month</v-icon> EDIT
              </v-btn>
            </template>
            <v-date-picker
              v-model="data.startDate"
              color=""
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="data.startDateMenu = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="() => dateMenuSave('assign', data.id, data.startDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>

          <!-- Due date -->
          <v-menu
            :ref="'endDateMenu' + data.id"
            v-model="data.endDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="red darken-2"
                class="white--text"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon>mdi-clock-time-two</v-icon> DUE DATE
              </v-btn>
            </template>
            <v-date-picker v-model="data.endDate" color="" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="data.endDateMenu = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="() => dateMenuSave('due', data.id, data.endDate)"
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
  data() {
    return {
      date: null,
      dummyData: [
        {
          id: 1,
          semester: "1/2021",
          startDate: new Date().toISOString().substr(0, 10),
          endDate: new Date().toISOString().substr(0, 10),
          startDateMenu: false,
          endDateMenu: false
        },
        {
          id: 2,
          semester: "2/2021",
          startDate: new Date().toISOString().substr(0, 10),
          endDate: new Date().toISOString().substr(0, 10),
          startDateMenu: false,
          endDateMenu: false
        },
        {
          id: 3,
          semester: "3/2021",
          startDate: new Date().toISOString().substr(0, 10),
          endDate: new Date().toISOString().substr(0, 10),
          startDateMenu: false,
          endDateMenu: false
        }
      ]
    };
  },
  methods: {
    dateMenuSave(action, id, date) {
      if (action === "assign") {
        console.log(this.$refs["startDateMenu" + id][0]);
        this.$refs["startDateMenu" + id][0].save(date);
      } else {
        console.log(this.$refs["endDateMenu" + id][0]);
        this.$refs["endDateMenu" + id][0].save(date);
      }
    }
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
