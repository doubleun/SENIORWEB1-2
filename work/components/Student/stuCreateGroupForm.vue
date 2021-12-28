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
                        () => !!name[member - 1] || 'This field is required'
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
                        () => !!phone[member - 1] || 'This field is required'
                      ]"
                      required
                      label="Student Phone Number"
                      outlined
                      dense
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <!-- <v-text-field
                      ref="stuID"
                      v-model="idstu[member - 1]"
                      :rules="[
                        () => !!idstu[member - 1] || 'This field is required'
                      ]"
                      required
                      label="Student ID"
                      outlined
                      dense
                      class="mt-5"
                    >
                    </v-text-field> -->
                    <v-autocomplete
                      v-model="selectedStudent[member - 1]"
                      :loading="studentLoading"
                      :items="allStudentsInMajor"
                      :filter="customStudentFilter"
                      class="mt-5"
                      outlined
                      dense
                      color="blue"
                      hide-no-data
                      hide-selected
                      item-text="User_Identity_ID"
                      item-value="User_Identity_ID"
                      placeholder="Search student ID"
                      clearable
                      return-object
                    ></v-autocomplete>
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
                  <!-- <v-text-field
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
                  ></v-text-field> -->
                  <v-autocomplete
                    v-model="selectedAdvisor"
                    :items="allTeachersInMajor"
                    :filter="customTeacherFilter"
                    outlined
                    dense
                    color="blue"
                    hide-no-data
                    hide-selected
                    item-text="User_Name"
                    item-value="User_Name"
                    placeholder="Search advisor name"
                    return-object
                  ></v-autocomplete>
                  <v-autocomplete
                    v-model="selectedCoAdvisor"
                    :items="allTeachersInMajor"
                    :filter="customTeacherFilter"
                    outlined
                    dense
                    color="blue"
                    hide-no-data
                    hide-selected
                    item-text="User_Name"
                    item-value="User_Name"
                    placeholder="Search co-advisor name"
                    return-object
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </div>
            <!-- Part : project committee -->
            <div class="projectCommittee">
              <h4 class="font-weight-bold">Project Committee</h4>
              <v-row>
                <v-col class="mt-5">
                  <!-- <v-text-field
                    ref="committee1Name"
                    v-model="committee1Name"
                    :rules="[
                      () => !!committee1Name || 'This field is required'
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
                      () => !!committee2Name || 'This field is required'
                    ]"
                    required
                    label="Committee Two Name"
                    outlined
                    dense
                  ></v-text-field> -->
                  <v-autocomplete
                    v-model="selectedCommittee1"
                    :items="allTeachersInMajor"
                    :filter="customTeacherFilter"
                    outlined
                    dense
                    color="blue"
                    hide-no-data
                    hide-selected
                    item-text="User_Name"
                    item-value="User_Name"
                    placeholder="Search committee 1"
                    return-object
                  ></v-autocomplete>
                  <v-autocomplete
                    v-model="selectedCommittee2"
                    :items="allTeachersInMajor"
                    :filter="customTeacherFilter"
                    outlined
                    dense
                    color="blue"
                    hide-no-data
                    hide-selected
                    item-text="User_Name"
                    item-value="User_Name"
                    placeholder="Search committee 2"
                    return-object
                  ></v-autocomplete>
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
    // TODO: By the way there's more efficient way of doing this using object
    // Array containing each student info as object (after select one in the auto complete, it'll add into this array)
    selectedStudent: [null, null, null, null],
    // Keeps search term value of each student's studentId field
    studentSearchTerm: [null, null, null, null],
    // For loading (currently not use)
    studentLoading: false,
    // All students and teachers in major fecthed from database (see 'async fetch' down below)
    allStudentsInMajor: [],
    allTeachersInMajor: [],
    // Filterd list of students from all users in the major
    filteredStudents: [],
    // Object contains advisor info as object (after select one in the auto complete, it'll assign to this variable)
    selectedAdvisor: {},
    selectedCoAdvisor: {},
    selectedCommittee1: {},
    selectedCommittee2: {},
    thaiName: "",
    engName: "",
    stuName: "",
    stuID: "",
    stuPhoneNumber: "",
    stuEmail: "",
    // !NOT USE
    // advisorName: "",
    // advisorEmail: "6131302001@lamduan.mfu.ac.th",
    // committee1Name: "",
    // committee1Email: "6131302001@lamduan.mfu.ac.th",
    // committee2Name: "",
    // committee2Email: "6131302002@lamduan.mfu.ac.th",
    // coadvisorName: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v =>
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "E-mail must be valid"
    ],
    projectMembers: [1],
    name: ["", "", "", ""],
    phone: ["", "", "", ""],
    // idstu: ["", "", "", ""],
    email: ["", "", "", ""],
    major: 1
  }),
  async fetch() {
    // TODO: This is big fetch, put this in a state and check if exists before fetch it
    // Fetch students and teachers
    const res = await this.$axios.$post("/user/getAllUsersInMajor", {
      Major_ID: this.$store.state.auth.currentUser.major,
      Project_on_term_ID: this.$store.state.auth.currentUser.projectOnTerm
    });
    // Assign students and teachers to variables
    this.allStudentsInMajor = res.students;
    this.allTeachersInMajor = res.teachers;
  },
  watch: {
    // This will watch for changes in selected student (ie. run after click on auto complete student id)
    // And assign value into name and email array
    selectedStudent(val) {
      this.name = val.map(itm => itm?.User_Name);
      this.email = val.map(itm => itm?.User_Email);
    }
  },
  methods: {
    // Add member fields
    addMemberFields() {
      this.projectMembers = [
        ...this.projectMembers,
        this.projectMembers.slice(-1)[0] + 1
      ];
      console.log(this.selectedStudent);
    },
    // Student autocomplete filter
    customStudentFilter(item, queryText, itemText) {
      if (queryText === "") return;
      return (
        item.User_Role === 1 && item.User_Identity_ID.indexOf(queryText) > -1
      );
    },
    // Advisor, co-advisor, committee autocomplete filter (ie. Teacher filter)
    customTeacherFilter(item, queryText, itemText) {
      return (
        item.User_Role !== 1 &&
        queryText !== this.selectedAdvisor &&
        queryText !== this.selectedCoAdvisor &&
        queryText !== this.selectedCommittee1 &&
        item.User_Name.indexOf(queryText) > -1
      );
    },
    async submitInfo() {
      // let number = 1;
      // if (this.name[1] != "") {
      //   number++;
      // }
      // if (this.name[2] != "") {
      //   number++;
      // }
      // if (this.name[3] != "") {
      //   number++;
      // }

      const res = await this.$axios.$post("group/createGroup", {
        Project_NameTh: this.thaiName,
        Project_NameEn: this.engName,
        Studen_Number: this.projectMembers.length,
        Advisor_Email: this.selectedAdvisor.User_Email,
        CoAdvisor_Name: this.selectedCoAdvisor.User_Name,
        Committee1_Email: this.selectedCommittee1?.User_Email,
        Committee2_Email: this.selectedCommittee2?.User_Email,
        Student1_Tel: this.phone[0],
        Student2_Tel: this.phone[1],
        Student3_Tel: this.phone[2],
        Student4_Tel: this.phone[3],
        Email_Student1: this.email[0],
        Email_Student2: this.email[1],
        Email_Student3: this.email[2],
        Email_Student4: this.email[3],
        Major: this.major,
        Project_on_term_ID: this.$store.state.auth.currentUser.projectOnTerm
      });
    }
  }
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
