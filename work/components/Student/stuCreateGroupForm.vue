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
                ref=""
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
              <!-- Student -->
              <!-- Loop the "projectMembers" array and render each student fields -->
              <div v-for="member in projectMembers" :key="member">
                <h5 class="font-weight-bold mt-5">Student {{ member }}</h5>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      ref="stuName"
                      v-model="name[member - 1]"
                      :rules="[
                        () => !!name[member - 1] || 'This field is required',
                      ]"
                      required
                      label="Student Name"
                      outlined
                      dense
                      class="mt-5"
                    >
                    </v-text-field>
                    <v-text-field
                      ref="stuPhoneNumber"
                      v-model="phone[member - 1]"
                      :rules="[
                        () => !!phone[member - 1] || 'This field is required',
                      ]"
                      required
                      label="Student Phone Number"
                      outlined
                      dense
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      ref="stuID"
                      v-model="idstu[member - 1]"
                      :rules="[
                        () => !!idstu[member - 1] || 'This field is required',
                      ]"
                      required
                      label="Student ID"
                      outlined
                      dense
                      class="mt-5"
                    >
                    </v-text-field>
                    <v-text-field
                      ref="stuEmail"
                      v-model="email[member - 1]"
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
            </div>
            <!-- Add member -->
            <div class="mb-5" v-show="projectMembers.length < 4">
              <a class="text-decoration-underline" @click="addMemberFields"
                >+ Add Member</a
              >
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
                    v-model="coadvisorName"
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
                ><v-btn rounded dark color="indigo" @click="submitInfo">
                  Create
                </v-btn></v-col
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
    advisorEmail: "6131302001@lamduan.mfu.ac.th",
    committee1Name: "",
    committee1Email: "6131302001@lamduan.mfu.ac.th",
    committee2Name: "",
    committee2Email: "6131302002@lamduan.mfu.ac.th",
    coadvisorName: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) =>
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "E-mail must be valid",
    ],
    projectMembers: [1],
    name: ["", "", "", ""],
    phone: ["", "", "", ""],
    idstu: ["", "", "", ""],
    email: ["", "", "", ""],
    major: 1,
  }),
  methods: {
    addMemberFields() {
      this.projectMembers = [
        ...this.projectMembers,
        this.projectMembers.slice(-1)[0] + 1,
      ];
    },
    async submitInfo() {
      let number = 1;
      if (this.name[1] != "") {
        number++;
      }
      if (this.name[2] != "") {
        number++;
      }
      if (this.name[3] != "") {
        number++;
      }

      const res = await this.$axios.$post("group/createGroup", {
       Project_NameTh: this.thaiName,
          Project_NameEn: this.engName,
          Studen_Number: number,
          Advisor_Email: this.advisorEmail,
          CoAdvisor_Name: this.coadvisorName,
          Committee1_Email: this.committee1Email,
          Committee2_Email: this.committee2Email,
          Student1_Tel: this.phone[0],
          Student2_Tel: this.phone[1],
          Student3_Tel: this.phone[2],
          Student4_Tel: this.phone[3],
          Email_Student1: this.email[0],
          Email_Student2: this.email[1],
          Email_Student3: this.email[2],
          Email_Student4: this.email[3],
          Major: this.major,
          Project_on_term_ID:this.$store.state.auth.currentUser.projectOnTerm
      });
    },
  },
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
