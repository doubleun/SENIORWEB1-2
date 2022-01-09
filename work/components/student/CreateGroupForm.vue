<template>
  <div>
    <v-row>
      <v-col>
        <h2 class="header-title mb-2 mt-5">Create Group</h2>
      </v-col>
      <!-- Alerts -->
      <!-- <div v-if="0">
        <v-col cols="8"
          ><v-alert type="warning"
            >An invitation to join the group has been sent. Please wait for your
            invitation to be accepted.</v-alert
          ></v-col
        >
      </div>
      <div v-else>
        <v-col
          ><v-alert type="success"
            >Everyone you've invited has accepted into your group.</v-alert
          ></v-col
        >
      </div> -->
    </v-row>
    <v-divider></v-divider>
    <!-- Create group form -->
    <v-form ref="form" v-model="valid">
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
                :disabled="!headMember"
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
                :disabled="!headMember"
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
              <div v-for="(member, index) in projectMembers" :key="member">
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
                      disabled
                      class="mt-5"
                    >
                    </v-text-field>
                    <v-text-field
                      ref="stuPhoneNumber"
                      v-model="phone[member - 1]"
                      :rules="[
                        () => !!phone[member - 1] || 'This field is required',
                      ]"
                      :disabled="!headMember"
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
                      :items="allStudentsInSchool"
                      :filter="customStudentFilter"
                      :disabled="index == 0 || !headMember"
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
                      disabled
                      dense
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </div>
            </div>
            <!-- Add and remove member flex -->
            <div class="d-flex flex-row" v-if="headMember">
              <!-- Add member -->
              <div class="mb-5 mr-5" v-show="projectMembers.length < 4">
                <a class="text-decoration-underline" @click="addMemberFields"
                  >+ Add Member</a
                >
              </div>
              <!-- Remove member -->
              <div class="mb-5" v-show="projectMembers.length > 1">
                <a class="text-decoration-underline" @click="removeMemberFields"
                  >- Remove Member</a
                >
              </div>
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
                    :items="allTeachersInSchool"
                    :filter="customTeacherFilter"
                    :disabled="
                      (!!selectedAdvisor && groupCreated) || !headMember
                    "
                    outlined
                    dense
                    color="blue"
                    hide-no-data
                    hide-selected
                    item-text="User_Name"
                    item-value="User_Name"
                    placeholder="Search advisor name"
                    :rules="[
                      () => !!selectedAdvisor || 'This field is required',
                    ]"
                    clearable
                    return-object
                  ></v-autocomplete>
                  <v-autocomplete
                    v-model="selectedCoAdvisor"
                    :items="allTeachersInSchool"
                    :filter="customTeacherFilter"
                    :disabled="
                      (!!selectedCoAdvisor && groupCreated) || !headMember
                    "
                    outlined
                    dense
                    color="blue"
                    hide-no-data
                    hide-selected
                    item-text="User_Name"
                    item-value="User_Name"
                    placeholder="Search co-advisor name"
                    clearable
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
                    :items="allTeachersInSchool"
                    :filter="customTeacherFilter"
                    :disabled="
                      (!!selectedCommittee1 && groupCreated) || !headMember
                    "
                    outlined
                    dense
                    color="blue"
                    hide-no-data
                    hide-selected
                    item-text="User_Name"
                    item-value="User_Name"
                    placeholder="Search committee 1"
                    :rules="[
                      () => !!selectedCommittee1 || 'This field is required',
                    ]"
                    clearable
                    return-object
                  ></v-autocomplete>
                  <v-autocomplete
                    v-model="selectedCommittee2"
                    :items="allTeachersInSchool"
                    :filter="customTeacherFilter"
                    :disabled="
                      (!!selectedCommittee2 && groupCreated) || !headMember
                    "
                    outlined
                    dense
                    color="blue"
                    hide-no-data
                    hide-selected
                    item-text="User_Name"
                    item-value="User_Name"
                    placeholder="Search committee 2"
                    clearable
                    return-object
                    :rules="[
                      () => !!selectedCommittee2 || 'This field is required',
                    ]"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </div>
            <!-- Create button -->
            <v-row
              class="text-center"
              v-if="
                this.$store.state.group.currentUserGroup.User_Status === 0 ||
                headMember
              "
            >
              <v-col v-if="headMember">
                <v-btn
                  rounded
                  dark
                  color="indigo"
                  @click="submitInfo"
                  v-if="this.groupMembers.length === 0"
                >
                  Create
                </v-btn>
                <v-btn rounded dark color="indigo" @click="updateInfo" v-else> Update </v-btn>
              </v-col>

              <!-- If not head member, then shows accept and decline invite instead -->
              <template v-else>
                <v-col cols="12" sm="6">
                  <v-btn
                    rounded
                    dark
                    color="success"
                    @click="handleInviteResponse(1)"
                  >
                    Accept
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-btn
                    rounded
                    dark
                    color="error"
                    @click="handleInviteResponse(2)"
                  >
                    Decline
                  </v-btn>
                </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-form>
  </div>
</template>
<script>
export default {
  data: () => ({
    // Flag for setting disabled field, this is for when group is created (some field can't be change if this is ture)
    groupCreated: false,
    // Flag for checking if current user is head of the group
    headMember: true,
    // TODO: By the way there's more efficient way of doing this using object
    // Array containing each student info as object (after select one in the auto complete, it'll add into this array)
    selectedStudent: [null, null, null, null],
    // Keeps search term value of each student's studentId field
    studentSearchTerm: [null, null, null, null],
    // For loading (currently not use)
    studentLoading: false,
    // All students and teachers in major fecthed from database (see 'async fetch' down below)
    allStudentsInSchool: [],
    allTeachersInSchool: [],
    // Filterd list of students from all users in the major
    filteredStudents: [],
    // Object contains advisor info as object (after select one in the auto complete, it'll assign to this variable)
    selectedAdvisor: null,
    selectedCoAdvisor: null,
    selectedCommittee1: null,
    selectedCommittee2: null,
    valid: true,
    thaiName: "",
    engName: "",
    stuName: "",
    stuID: "",
    stuPhoneNumber: "",
    stuEmail: "",
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
    // idstu: ["", "", "", ""],
    email: ["", "", "", ""],
    major: 1,
    Group_ID:17
  }),
  props: { groupMembers: Array },
  async fetch() {
    // TODO: This is big fetch, put this in a state and check if exists before fetch it
    // Fetch students and teachers
    const res = await this.$axios.$post("/user/getAllUsersInSchool", {
      Project_on_term_ID: this.$store.state.auth.currentUser.projectOnTerm,
    });
    // Assign students and teachers to variables
    this.allStudentsInSchool = res.students;
    console.log("Students: ", res.students);
    this.allTeachersInSchool = res.teachers;
    console.log("Teachers: ", res.students);
  },
  watch: {
    // This will watch for changes in selected student (ie. run after click on auto complete student id)
    // And assign value into name and email array
    selectedStudent(val) {
      this.name = val.map((itm) => itm?.User_Name);
      this.email = val.map((itm) => itm?.User_Email);
    },
  },
  methods: {
    // Add member fields
    addMemberFields() {
      this.projectMembers = [
        ...this.projectMembers,
        this.projectMembers.slice(-1)[0] + 1,
      ];
    },
    // Remove member fields
    removeMemberFields() {
      this.projectMembers.pop();
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
      // Validate form to make sure that everything is filled
      this.$refs.form.validate();

      // Make sure that atleast one advisor and one committee is selected
      if (
        this.selectedAdvisor === null ||
        this.selectedCommittee1 === null ||
        this.valid === false
      )
        return;

      this.$swal
        .fire({
          icon: "info",
          title: "Create group",
          text: "Confirm create group.",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const res = await this.$axios.$post("group/createGroup", {
              Project_NameTh: this.thaiName,
              Project_NameEn: this.engName,
              Studen_Number: this.projectMembers.length,
              Advisor_Email: this.selectedAdvisor.User_Email,
              CoAdvisor_Name: this.selectedCoAdvisor?.User_Name || "",
              Committee1_Email: this.selectedCommittee1?.User_Email,
              Committee2_Email: this.selectedCommittee2?.User_Email || "",
              Student1_Tel: this.phone[0],
              Student2_Tel: this.phone[1],
              Student3_Tel: this.phone[2],
              Student4_Tel: this.phone[3],
              Email_Student1: this.email[0],
              Email_Student2: this.email[1],
              Email_Student3: this.email[2],
              Email_Student4: this.email[3],
              Major: this.major,
              Project_on_term_ID:
                this.$store.state.auth.currentUser.projectOnTerm,
            });
            console.log(res);
            if (res.status == 200) {
              this.$swal
                .fire("Successed", "Group has been created.", "success")
                .then((result) => {
                  if (result.isConfirmed) window.location.reload();
                });
            } else {
              this.$swal.fire("Error", res.msg, "error");
            }
          }
        });
    },
    async updateInfo() {
      // Validate form to make sure that everything is filled
      this.$refs.form.validate();

      // Make sure that atleast one advisor and one committee is selected
      if (
        this.selectedAdvisor === null ||
        this.selectedCommittee1 === null ||
        this.valid === false
      )
        return;

      this.$swal
        .fire({
          icon: "info",
          title: "Update group",
          text: "Confirm update group.",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const res = await this.$axios.$post("group/updateGroup", {
              Project_NameTh: this.thaiName,
              Project_NameEn: this.engName,
              Studen_Number: this.projectMembers.length,
              Advisor_Email: this.selectedAdvisor.User_Email,
              CoAdvisor_Name: this.selectedCoAdvisor?.User_Name || "",
              Committee1_Email: this.selectedCommittee1?.User_Email,
              Committee2_Email: this.selectedCommittee2?.User_Email || "",
              Student1_Tel: this.phone[0],
              Student2_Tel: this.phone[1],
              Student3_Tel: this.phone[2],
              Student4_Tel: this.phone[3],
              Email_Student1: this.email[0],
              Email_Student2: this.email[1],
              Email_Student3: this.email[2],
              Email_Student4: this.email[3],
              Major: this.major,
              Group_ID: this.Group_ID,
              Project_on_term_ID:
                this.$store.state.auth.currentUser.projectOnTerm,
            });
            console.log(res);
            if (res.status == 200) {
              this.$swal
                .fire("Successed", "Group has been created.", "success")
                .then((result) => {
                  if (result.isConfirmed) window.location.reload();
                });
            } else {
              this.$swal.fire("Error", res.msg, "error");
            }
          }
        });
    },
    async handleInviteResponse(response) {
      // Just in case, validate form to make sure that everything is filled
      this.$refs.form.validate();
      if (!this.valid) return;

      // Request invite response api
      try {
        // Show confirm dialog
        this.$swal
          .fire({
            icon: "info",
            title: `Confirm ${
              response === 1 ? "accept" : "decline"
            } group invitation ?`,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
          })
          .then(async (result) => {
            if (result.isConfirmed) {
              const res = await this.$axios.$post("/group/updateMemberStatus", {
                User_Email: this.$store.state.auth.currentUser.email,
                Group_Id: this.$store.state.group.currentUserGroup.Group_ID,
                Status: response,
              });
              if (res.status !== 200) throw err;
            } else {
              return;
            }
          });
      } catch (err) {
        console.log(err);
        this.$swal.fire("Error");
      }
    },
  },
  mounted() {
    // console.log('Current user group: ', this.$store.state.group.currentUserGroup);
    // console.log("Group members: ", this.groupMembers);
    // Check if there are group members array before pass in value to text fields
    if (this.groupMembers.length !== 0) {
      // Sets project name
      this.thaiName = this.$store.state.group.currentUserGroup.Group_Name_Thai;
      this.engName = this.$store.state.group.currentUserGroup.Group_Name_Eng;

      // Sets project members
      this.groupMembers
        // Filter groupMembers array to get only group role 2, which is student role
        .filter((itm) => itm.Group_Role === 3 || itm.Group_Role === 2)
        .map((itm, index) => {
          index >= 1 &&
            // Add more project member fields
            this.addMemberFields();

          // Pass value into all project member fields
          this.selectedStudent[index] = {
            User_Email: itm.User_Email,
            User_Identity_ID: itm.User_Identity_ID,
            User_Name: itm.User_Name,
            User_Role: itm.User_Role,
          };
          this.name[index] = itm.User_Name;
          this.email[index] = itm.User_Email;
          this.phone[index] = itm.User_Phone;
        });
      // Sets advisor
      const advisor = this.groupMembers.filter((itm) => itm.Group_Role === 0);
      if (advisor.length !== 0)
        this.selectedAdvisor = {
          User_Email: advisor[0].User_Email,
          User_Name: advisor[0].User_Name,
          disabled: true,
        };
      console.log(this.$store.state.group.currentUserGroup);
      //Set co-advisor name
      if (this.$store.state.group.currentUserGroup.Co_Advisor !== "") {
        this.selectedCoAdvisor = {
          User_Name: this.$store.state.group.currentUserGroup.Co_Advisor,
        };
      }
      // Set committes
      this.groupMembers
        .filter((member) => member.Group_Role === 1)
        .map((member, index) => {
          this["selectedCommittee" + (index + 1)] = {
            User_Name: member.User_Name,
            User_Email: member.User_Email,
          };
        });

      // Sets group created to true
      this.groupCreated = true;
    } else {
      // If no groups, set group created to false
      this.groupCreated = false;

      // And insert the current user as head of the group (ie. first member)
      this.email[0] = this.$store.state.auth.currentUser.email;
      (this.name[0] = this.$store.state.auth.currentUser.name),
        (this.selectedStudent[0] = {
          User_Email: this.$store.state.auth.currentUser.email,
          User_Identity_ID: this.$store.state.auth.currentUser.userId,
          User_Name: this.$store.state.auth.currentUser.name,
          User_Role: this.$store.state.auth.currentUser.role,
        });
    }

    // Check if current user is the head of the group
    if (this.email[0] === this.$store.state.auth.currentUser.email) {
      this.headMember = true;
    } else {
      this.headMember = false;
    }
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
