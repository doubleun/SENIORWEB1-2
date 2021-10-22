<template>
    <div><!-- Create group form -->
    <v-form>
      <v-card class="content mt-5">
        <!-- Part : project name -->
        <div class="projectName">
          <v-alert color="indigo lighten-5">
            <h3 class="font-weight-bold">Project Name</h3>
          </v-alert>
          <v-row
            ><v-col cols="12" sm="6"
              ><v-text-field
                label="English Name"
                outlined
                dense
              ></v-text-field></v-col
            ><v-col cols="12" sm="6"
              ><v-text-field
                label="Thai Name"
                outlined
                dense
              ></v-text-field></v-col
          ></v-row>
        </div>
        <!-- Part : project member -->
        <div class="projectMember">
          <v-alert color="indigo lighten-5">
            <h3 class="font-weight-bold">Project Member</h3>
          </v-alert>
          <h4 class="font-weight-bold">Student 1</h4>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field label="Student Name" outlined dense class="mt-3">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                label="Student Phone Number"
                outlined
                dense
                class="mt-3"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                label="Student Lamduan Mail"
                outlined
                dense
                class="mt-3"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <h4 class="font-weight-bold">Student 2</h4>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field label="Student Name" outlined dense class="mt-3">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                label="Student Phone Number"
                outlined
                dense
                class="mt-3"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                label="Student Lamduan Mail"
                outlined
                dense
                class="mt-3"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <h4 class="font-weight-bold">Student 3</h4>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field label="Student Name" outlined dense class="mt-3">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                label="Student Phone Number"
                outlined
                dense
                class="mt-3"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                label="Student Lamduan Mail"
                outlined
                dense
                class="mt-3"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </div>
        <!-- Part : project advisor -->
        <div class="projectAdvisor">
          <v-alert color="indigo lighten-5">
            <h3 class="font-weight-bold">Project Advisor</h3>
          </v-alert>
          <v-row
            ><v-col cols="12" sm="6"
              ><v-text-field
                label="Advisor Name"
                outlined
                dense
              ></v-text-field></v-col
          ></v-row>
        </div>
        <!-- Part : project co - advisor -->
        <div class="projectCoAdvisor">
          <v-alert color="indigo lighten-5">
            <h3 class="font-weight-bold">Project Co - Advisor</h3>
          </v-alert>
          <v-row
            ><v-col cols="12" sm="6"
              ><v-text-field
                label="Project Co - Advisor Name"
                outlined
                dense
              ></v-text-field></v-col
          ></v-row>
        </div>
        <!-- Part : project committee -->
        <div class="projectCommittee">
          <v-alert color="indigo lighten-5">
            <h3 class="font-weight-bold">Project Committee</h3>
          </v-alert>

          <v-row
            ><v-col cols="12" sm="6"
              ><v-text-field
                label="Committee 1 Name"
                outlined
                dense
              ></v-text-field></v-col
            ><v-col cols="12" sm="6"
              ><v-text-field
                label="Committee 2 Name"
                outlined
                dense
              ></v-text-field></v-col
          ></v-row>
        </div>
      </v-card>
      <!-- Create button -->
      <v-row class="text-center"
        ><v-col
          ><v-btn
            rounded
            dark
            color="indigo"
            to="/Student/stuCreatedGroup"
            class="mt-10"
          >
            Create
          </v-btn></v-col
        ></v-row
      >
    </v-form></div>
</template>
<style scoped>
.content {
  padding: 20px;
}
.v-btn {
  width: 200px;
}
</style>