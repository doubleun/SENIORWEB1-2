<template>
  <v-card class="due-assignment-card">
    <v-card-title style="padding: 1rem 1rem 0">ASSIGNMENT</v-card-title>
    <!-- Assignment table -->
    <div class="due-assignment-content">
      <!-- Table attr -->
      <h4>TOPIC</h4>
      <h4>ASSIGN DATE</h4>
      <h4>DUE DATE</h4>
      <h4>FILE</h4>
      <h4>ACTIONS</h4>

      <!-- Table records -->
      <template v-for="data in dummyData">
        <p :key="data.topic + 1">{{ data.topic }}</p>
        <p :key="data.topic + 2">{{ data.assignDate }}</p>
        <p :key="data.topic + 3">{{ data.dueDate }}</p>
        <p :key="data.topic + 4">{{ data.file }}</p>
        <div :key="data.topic + 5">
          <!-- Edit assign date -->
          <v-menu
            :ref="'assignMenu' + data.id"
            v-model="data.assignMenu"
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
                <v-icon>mdi-calendar-month</v-icon> ASSIGN DATE
              </v-btn>
            </template>
            <v-date-picker
              v-model="data.assignDate"
              color=""
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="data.assignMenu = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="() => dateMenuSave('assign', data.id, data.assignDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>

          <!-- Due date -->
          <v-menu
            :ref="'dueMenu' + data.id"
            v-model="data.dueMenu"
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
            <v-date-picker v-model="data.dueDate" color="" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="data.dueMenu = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="() => dateMenuSave('due', data.id, data.dueDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>

          <!-- View file -->
          <!-- <v-btn
            color="light-green darken-1"
            class="white--text"
            :disabled="data.file === 0"
            @click="
              $nuxt.$router.push({
                path: '/Senior1/Coordinator/viewAssignment',
                query: { assignmentId: data.id }
              })
            "
          >
            <v-icon>mdi-clipboard-text</v-icon> VIEW
          </v-btn> -->
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
          topic: "Group",
          assignDate: new Date().toISOString().substr(0, 10),
          dueDate: new Date().toISOString().substr(0, 10),
          file: 0,
          assignMenu: false,
          dueMenu: false
        },
        {
          id: 2,
          topic: "Progress 1",
          assignDate: new Date().toISOString().substr(0, 10),
          dueDate: new Date().toISOString().substr(0, 10),
          file: 90,
          assignMenu: false,
          dueMenu: false
        },
        {
          id: 3,
          topic: "Progress 2",
          assignDate: new Date().toISOString().substr(0, 10),
          dueDate: new Date().toISOString().substr(0, 10),
          file: 90,
          assignMenu: false,
          dueMenu: false
        },
        {
          id: 4,
          topic: "Progress 3",
          assignDate: new Date().toISOString().substr(0, 10),
          dueDate: new Date().toISOString().substr(0, 10),
          file: 90,
          assignMenu: false,
          dueMenu: false
        },
        {
          id: 5,
          topic: "Progress 4",
          assignDate: new Date().toISOString().substr(0, 10),
          dueDate: new Date().toISOString().substr(0, 10),
          file: 90,
          assignMenu: false,
          dueMenu: false
        },
        {
          id: 6,
          topic: "Final Presentation",
          assignDate: new Date().toISOString().substr(0, 10),
          dueDate: new Date().toISOString().substr(0, 10),
          file: 100,
          assignMenu: false,
          dueMenu: false
        },
        {
          id: 7,
          topic: "Final Documentation",
          assignDate: new Date().toISOString().substr(0, 10),
          dueDate: new Date().toISOString().substr(0, 10),
          file: 90,
          assignMenu: false,
          dueMenu: false
        },
        {
          id: 8,
          topic: "Re-Evaluation",
          assignDate: new Date().toISOString().substr(0, 10),
          dueDate: new Date().toISOString().substr(0, 10),
          file: 90,
          assignMenu: false,
          dueMenu: false
        }
      ]
    };
  },
  methods: {
    dateMenuSave(action, id, date) {
      if (action === "assign") {
        console.log(this.$refs["assignMenu" + id][0]);
        this.$refs["assignMenu" + id][0].save(date);
      } else {
        console.log(this.$refs["dueMenu" + id][0]);
        this.$refs["dueMenu" + id][0].save(date);
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
