<template>
  <div>
    <!-- Create group form -->
    <v-form ref="form">
      <v-card class="content mt-5">
        <v-row>
          <v-col cols="12" sm="3"
            ><h3 class="font-weight-bold">CREATE GROUP</h3></v-col
          >
          <v-col cols="12" sm="9">
            <!-- Part : project name -->
            <div class="projectName">
              <h4 class="font-weight-bold">Project Name</h4>
              <v-text-field
                ref="thaiName"
                v-model="thaiName"
                :rules="[() => !!thaiName || 'This field is required']"
                required
                class="mt-5"
                label="Thai Name"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                ref="engName"
                v-model="engName"
                :rules="[() => !!engName || 'This field is required']"
                required
                label="English Name"
                outlined
                dense
              ></v-text-field>
            </div>

            <!-- Part : project member -->
            <div class="projectMember">
              <h4 class="font-weight-bold">Project Member</h4>
              <h5 class="font-weight-bold mt-5">Student 1</h5>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    ref="stuName"
                    v-model="stuName"
                    :rules="[() => !!stuName || 'This field is required']"
                    required
                    label="Student Name"
                    outlined
                    dense
                    class="mt-5"
                  >
                  </v-text-field>
                  <v-text-field
                    ref="stuPhoneNumber"
                    v-model="stuPhoneNumber"
                    :rules="[
                      () => !!stuPhoneNumber || 'This field is required',
                    ]"
                    required
                    label="Student Phone Number"
                    outlined
                    dense
                  >
                  </v-text-field>
                  <div class="mb-5">
                    <a href="#" class="text-decoration-underline"
                      >+ Add Member</a
                    >
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    ref="stuID"
                    v-model="stuID"
                    :rules="[() => !!stuID || 'This field is required']"
                    required
                    label="Student ID"
                    outlined
                    dense
                    class="mt-5"
                  >
                  </v-text-field>
                  <v-text-field
                    ref="stuEmail"
                    v-model="stuEmail"
                    :rules="emailRules"
                    required
                    label="Student Lamduan Mail"
                    outlined
                    dense
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </div>
            <!-- Part : project advisor -->
            <div class="projectAdvisor">
              <h4 class="font-weight-bold">Project Advisor</h4>
              <v-row>
                <v-col class="mt-5">
                  <v-text-field
                    ref="advisorName"
                    v-model="advisorName"
                    :rules="[() => !!advisorName || 'This field is required']"
                    required
                    label="Advisor Name"
                    outlined
                    dense
                  ></v-text-field>
                  <v-text-field
                    label="Co-advisor Name"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
            <!-- Part : project committee -->
            <div class="projectCommittee">
              <h4 class="font-weight-bold">Project Committee</h4>
              <v-row>
                <v-col class="mt-5">
                  <v-text-field
                    ref="committee1Name"
                    v-model="committee1Name"
                    :rules="[
                      () => !!committee1Name || 'This field is required',
                    ]"
                    required
                    label="Committee One Name"
                    outlined
                    dense
                  ></v-text-field>
                  <v-text-field
                    ref="committee2Name"
                    v-model="committee2Name"
                    :rules="[
                      () => !!committee2Name || 'This field is required',
                    ]"
                    required
                    label="Committee Two Name"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
            <!-- Create button -->
            <v-row class="text-center"
              ><v-col
                ><v-btn rounded dark color="indigo"> Create </v-btn></v-col
              ></v-row
            >
          </v-col>
        </v-row>
      </v-card>
    </v-form>
  </div>
</template>
<script>
export default {
  data: () => ({
    thaiName: "",
    engName: "",
    stuName: "",
    stuID: "",
    stuPhoneNumber: "",
    stuEmail: "",
    advisorName: "",
    committee1Name: "",
    committee2Name: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) =>
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "E-mail must be valid",
    ],
  }),
};
</script>
<style scoped>
.content {
  padding: 40px;
}
.v-btn {
  width: 200px;
}
</style>