<template>
  <div>
    <v-row>
      <v-col>
        <h2 class="header-title mb-2 mt-5">Create Group</h2>
        <p v-if="groupMembers.length !== 0">
          <strong style="color: red">*</strong>
          You can update group information until submit an assignment
        </p>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <!-- Create group form -->
    <v-form ref="form" lazy-validation v-model="valid">
      <v-card class="content mt-5">
        <v-row>
          <v-col cols="12" sm="3">
            <h3 class="font-weight-bold">CREATE GROUP</h3>
          </v-col>
          <v-col cols="12" sm="9">
            <!-- Part : project name -->
            <div class="projectName">
              <h4 class="font-weight-bold">Project Name</h4>
              <v-text-field
                ref=""
                v-model="thaiName"
                :rules="[
                  () =>
                    handleValidateTextField({
                      string: thaiName,
                      option: 'onlyNormalCharTh',
                      errorMsg:
                        'This field is required / Not allow start and end with space / Not allow space, special character and only Thai characters.'
                    })
                ]"
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
                :rules="[
                  () =>
                    handleValidateTextField({
                      string: engName,
                      option: 'onlyNormalCharEngAndNumber',
                      errorMsg:
                        'This field is required / Not allow start and end with space / Not allow special character and only English characters.'
                    })
                ]"
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
              <div v-for="(member, index) in student" :key="index">
                <h5 class="font-weight-bold mt-5">
                  Student {{ index + 1 }}
                  <!-- Icon indicate if teacher submiited eval comment yet -->
                  <v-chip
                    class="ma-2"
                    :color="member.User_Status === 1 ? 'green' : 'orange'"
                    text-color="white"
                  >
                    {{ member.User_Status === 1 ? 'Accepted' : 'Pendding' }}
                  </v-chip>
                </h5>
                <!-- {{ memberStatus[index] }} -->
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      ref="stuName"
                      v-model="student[index].User_Name"
                      :rules="[() => !!name[index] || 'This field is required']"
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
                      v-model="student[index].User_Phone"
                      :maxlength="10"
                      :rules="[
                        () =>
                          handleValidateTextField({
                            string: phone[index],
                            option: 'onlyNumber',
                            errorMsg:
                              'This field is required /Only number / Not allow start and end with space'
                          }),
                        () =>
                          phone[index][0] != 0 ? 'Please Start with 0' : true,
                        () =>
                          phone[index].length != 10
                            ? 'Only 10 digit of number'
                            : true
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
                    <v-autocomplete
                      v-model="student[index]"
                      :loading="studentLoading"
                      :items="allStudentsInSchool"
                      :filter="customStudentFilter"
                      :disabled="
                        index === 0 ||
                        !headMember ||
                        memberStatus[index] === 1 ||
                        groupCreated
                      "
                      :rules="[
                        (val) => selectMemberRules('student', index, val)
                      ]"
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
                      v-model="student[index].User_Email"
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
            <div class="d-flex flex-row" v-if="!groupCreated">
              <!-- Add member -->
              <div class="mb-5 mr-5" v-show="projectMembers.length < 10">
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
                  <div v-for="(user, index) in advisor" :key="index">
                    <v-chip
                      class="ma-2"
                      :color="
                        ((!!user && groupCreated) || !headMember) &&
                        user.User_Status == 1
                          ? 'green'
                          : 'orange'
                      "
                      text-color="white"
                    >
                      {{
                        ((!!user && groupCreated) || !headMember) &&
                        user.User_Status == 1
                          ? 'Accepted'
                          : 'Pendding'
                      }}
                    </v-chip>

                    <v-autocomplete
                      v-model="advisor[index]"
                      :items="allTeachersInSchool"
                      :filter="customTeacherFilter"
                      :disabled="
                        (!!user && user.User_Status !== 3 && groupCreated) ||
                        !headMember
                      "
                      :rules="[(val) => selectMemberRules('advisor', 0, val)]"
                      outlined
                      dense
                      color="blue"
                      hide-no-data
                      hide-selected
                      item-text="User_Name"
                      item-value="User_Name"
                      placeholder="Search advisor name"
                      clearable
                      return-object
                    ></v-autocomplete>
                  </div>
                  <v-text-field
                    v-model="coadvisorName"
                    label="Co-advisor Name"
                    :rules="[
                      () =>
                        handleValidateTextField({
                          string: coadvisorName,
                          option: 'onlyNormalCharEngAndNumber',
                          required: false,
                          errorMsg:
                            'Not allow start and end with space / Not allow special character and only English characters.'
                        })
                    ]"
                    :disabled="!headMember"
                    color="blue"
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
                  <div v-for="(user, index) in committee" :key="index">
                    <v-chip
                      class="ma-2"
                      :color="
                        ((!!user && groupCreated) || !headMember) &&
                        user.User_Status == 1
                          ? 'green'
                          : 'orange'
                      "
                      text-color="white"
                    >
                      {{
                        ((!!user && groupCreated) || !headMember) &&
                        user.User_Status == 1
                          ? 'Accepted'
                          : 'Pendding'
                      }}
                    </v-chip>
                    <!-- {{ committee[index] }} -->
                    <v-autocomplete
                      v-model="committee[index]"
                      :items="allTeachersInSchool"
                      :filter="customTeacherFilter"
                      :disabled="
                        (!!user && user.User_Status !== 3 && groupCreated) ||
                        !headMember
                      "
                      :rules="[(val) => selectMemberRules('advisor', 1, val)]"
                      outlined
                      dense
                      color="blue"
                      hide-no-data
                      hide-selected
                      item-text="User_Name"
                      item-value="User_Name"
                      placeholder="Search committee"
                      clearable
                      return-object
                    ></v-autocomplete>
                  </div>
                </v-col>
              </v-row>
            </div>
            <!-- Create button -->
            <!-- v-if checks if user has a group and if they do what is thier group member status (user status) -->
            <!-- if it's zero meaning they are pending member, but if they are not pending member we check if they are head member next -->
            <v-row class="text-center" v-if="showResposeBtn || headMember">
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
                <v-btn
                  rounded
                  dark
                  color="indigo"
                  @click="updateInfo"
                  v-if="groupMembers.length !== 0 && !isHaveAssignment"
                >
                  Update
                </v-btn>
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
import utils from '@/mixins/utils'
export default {
  data: () => ({
    // Flag for setting disabled field, this is for when group is created (some field can't be change if this is ture)
    groupCreated: false,
    // Flag for checking if current user is head of the group
    headMember: true,
    // TODO: By the way there's more efficient way of doing this using object
    // Array containing each student info as object (after select one in the auto complete, it'll add into this array)
    selectedStudent: [null, null, null, null],
    // For loading (currently not use)
    studentLoading: false,
    // All students and teachers in major fecthed from database (see 'async fetch' down below)
    allStudentsInSchool: [],
    allTeachersInSchool: [],
    // Object contains advisor info as object (after select one in the auto complete, it'll assign to this variable)
    selectedAdvisor: null,
    selectedAdvisorstatus: 3,
    // selectedCoAdvisor: null,
    coadvisorName: '',
    // selectedCommittee1: null,
    // selectedCommittee2: null,
    // selectedCommittee1status: 3,
    // selectedCommittee2status: 3,
    valid: true,
    thaiName: '',
    engName: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) =>
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || 'E-mail must be valid'
    ],
    projectMembers: [1],
    memberStatus: [],
    name: ['', '', '', '', '', '', '', '', '', ''],
    phone: ['', '', '', '', '', '', '', '', '', ''],
    // idstu: ["", "", "", "", "","", "", "", "", ""],
    email: ['', '', '', '', '', '', '', '', '', ''],
    major: '1',
    showResposeBtn: false,
    isHaveAssignment: false,
    student: [{}],
    advisor: [{}],
    committee: [{}]
  }),
  mixins: [utils],

  props: { groupMembers: Array },
  async fetch() {
    // TODO: This is big fetch, put this in a state and check if exists before fetch it
    // Fetch students and teachers
    const res = await this.$axios.$post('/user/getAllUsersInSchool', {
      // Project_on_term_ID: this.$store.state.auth.currentUser.projectOnTerm,
    })

    let isHaveAssignment = []

    if (!!this.$store.state.group.currentUserGroup) {
      // Fetch group assignment for block update info after submit an assignment
      isHaveAssignment = await this.$axios.$post(
        '/assignment/groupAssignment',
        {
          Group_ID: this.$store.state.group.currentUserGroup.Group_ID
        }
      )
    }
    this.isHaveAssignment = isHaveAssignment.length > 0 ? true : false
    // Assign students and teachers to variables
    this.allStudentsInSchool = res.students
    // console.log("Students: ", res.students);
    this.allTeachersInSchool = res.teachers

    // console.log("Teachers: ", res.teachers);
  },
  watch: {
    // This will watch for changes in selected student (ie. run after click on auto complete student id)
    // And assign value into name and email array
    selectedStudent(val) {
      this.name = val.map((itm) => itm?.User_Name)
      this.email = val.map((itm) => itm?.User_Email)
    }
  },
  mounted() {
    console.log('Group members: ', this.groupMembers)
    // Check if there are group members array before pass in value to text fields

    if (this.groupMembers.length !== 0) {
      // ===== set project name =====
      this.thaiName = this.$store.state.group.currentUserGroup.Group_Name_Thai
      this.engName = this.$store.state.group.currentUserGroup.Group_Name_Eng

      // ===== set group member =====
      //Set co-advisor name
      if (this.$store.state.group.currentUserGroup.Co_Advisor !== '') {
        this.coadvisorName = this.$store.state.group.currentUserGroup.Co_Advisor
      }

      // set student
      this.student = this.groupMembers.filter(
        (el) => el.Group_Role === 3 || el.Group_Role === 2
      )
      // set advisor
      this.advisor = this.groupMembers.filter((el) => el.Group_Role === 0)

      // set committee
      this.committee = this.groupMembers.filter((el) => el.Group_Role === 1)

      // Sets group created to true
      this.groupCreated = true
    } else {
      // If no groups, set group created to false
      this.groupCreated = false
      // And insert the current user as head of the group (ie. first member)
      this.student[0].User_Email = this.$store.state.auth.currentUser.email
      this.student[0].User_Identity_ID =
        this.$store.state.auth.currentUser.userId
      this.student[0].User_Name = this.$store.state.auth.currentUser.name
      this.student[0].User_Role = this.$store.state.auth.currentUser.role
      this.student[0].Group_Role = 3
      this.student[0].User_Major = this.$store.state.auth.currentUser.major
      this.student[0].User_Status = 1
      // this.student[0].User_Phone = 0

      console.log('inital student', this.student)
    }

    // Check if current user is the head of the group
    const headEmail = this.student[0].User_Email || ''
    if (headEmail.toLowerCase() === this.$store.state.auth.currentUser.email) {
      this.headMember = true
    } else if (this.$store.state.group.currentUserGroup.User_Status === 0) {
      // If the current user is not head of the group, check if he has user status of pending (ie. status of 0)
      this.showResposeBtn = true
      this.headMember = false
    } else {
      // Else, the current user is a member of the group, and they alrady accept the invite
      this.headMember = false
    }
  },
  methods: {
    // student selected rules
    selectMemberRules(role, index, val) {
      let errorMsg = true
      if (!val) {
        return 'This field is required'
      }

      switch (role) {
        case 'student':
          for (let i = 0; i < this.selectedStudent.length; i++) {
            if (this.selectedStudent[i] == null || i == index) continue
            if (
              this.selectedStudent[i].User_Identity_ID == val.User_Identity_ID
            ) {
              errorMsg = 'Student has been in group'
              break
            } else {
              errorMsg = true
            }
          }
        case 'advisor':
          let selectedTeacher = [
            this.selectedAdvisor,
            this.selectedCommittee1,
            this.selectedCommittee2
          ]

          for (let i = 0; i < selectedTeacher.length; i++) {
            if (selectedTeacher[i] == null || i == index) continue
            if (selectedTeacher[i].User_Email == val.User_Email) {
              errorMsg = 'Teacher has been in group'
              break
            } else {
              errorMsg = true
            }
          }
          break
      }

      return errorMsg
    },
    // Add member fields
    addMemberFields() {
      this.student = [...this.student, this.student.slice(-1)[0] + 1]
    },
    // Remove member fields
    removeMemberFields() {
      this.student.pop()
    },
    // Student autocomplete filter
    customStudentFilter(item, queryText, itemText) {
      if (queryText === '') return
      return (
        item.User_Role === 1 && item.User_Identity_ID.indexOf(queryText) > -1
      )
    },
    // Advisor, co-advisor, committee autocomplete filter (ie. Teacher filter)
    customTeacherFilter(item, queryText, itemText) {
      return (
        item.User_Role !== 1 &&
        queryText !== this.selectedAdvisor &&
        // queryText !== this.selectedCoAdvisor &&
        queryText !== this.selectedCommittee1 &&
        item.User_Name.indexOf(queryText) > -1
      )
    }
    // async submitInfo() {
    //   // Validate form to make sure that everything is filled
    //   this.$refs.form.validate()
    //   // console.log(this.selectedStudent)
    //   // Make sure that atleast one advisor and one committee is selected
    //   // console.log(this.$refs.form.validate());
    //   // console.log(this.valid);
    //   if (
    //     this.selectedAdvisor === null ||
    //     this.selectedCommittee1 === null ||
    //     this.selectedCommittee2 === null ||
    //     this.thaiName === '' ||
    //     this.thaiName === null ||
    //     this.engName === '' ||
    //     this.engName === null ||
    //     this.$refs.form.validate() === false
    //   )
    //     return

    //   this.$swal
    //     .fire({
    //       icon: 'info',
    //       title: 'Create group',
    //       text: 'Confirm create group.',
    //       showCancelButton: true,
    //       confirmButtonColor: '#3085d6',
    //       cancelButtonColor: '#d33',
    //       confirmButtonText: 'Yes'
    //     })
    //     .then(async (result) => {
    //       //
    //       if (result.isConfirmed) {
    //         const res = await this.$axios.$post('/group/createGroup', {
    //           Project_NameTh: this.thaiName,
    //           Project_NameEn: this.engName,
    //           Studen_Number: this.projectMembers.length,
    //           Advisor_Email: this.selectedAdvisor.User_Email,
    //           // CoAdvisor_Name: this.selectedCoAdvisor?.User_Name || "",
    //           CoAdvisor_Name: this.coadvisorName || '',
    //           Committee1_Email: this.selectedCommittee1?.User_Email,
    //           Committee2_Email: this.selectedCommittee2?.User_Email || '',
    //           Student1_Tel: this.phone[0],
    //           Student2_Tel: this.phone[1],
    //           Student3_Tel: this.phone[2],
    //           Student4_Tel: this.phone[3],
    //           Student5_Tel: this.phone[4],
    //           Student6_Tel: this.phone[5],
    //           Student7_Tel: this.phone[6],
    //           Student8_Tel: this.phone[7],
    //           Student9_Tel: this.phone[8],
    //           Student10_Tel: this.phone[9],
    //           Email_Student1: this.email[0],
    //           Email_Student2: this.email[1],
    //           Email_Student3: this.email[2],
    //           Email_Student4: this.email[3],
    //           Email_Student5: this.email[4],
    //           Email_Student6: this.email[5],
    //           Email_Student7: this.email[6],
    //           Email_Student8: this.email[7],
    //           Email_Student9: this.email[8],
    //           Email_Student10: this.email[9],
    //           Major: this.$store.state.auth.currentUser.major
    //           // Project_on_term_ID:
    //           //   this.$store.state.auth.currentUser.projectOnTerm,
    //         })
    //         console.log(res.status)
    //         // if (res.status == 200) {
    //         this.$swal
    //           .fire('Successed', 'Group has been created.', 'success')
    //           .then((result) => {
    //             if (result.isConfirmed) window.location.reload()
    //           })
    //         // } else {
    //         //   this.$swal.fire("Error", res.msg, "error");
    //         // }
    //       }
    //     })
    // },
    // async updateInfo() {
    //   // Validate form to make sure that everything is filled
    //   this.$refs.form.validate()

    //   // Make sure that atleast one advisor and one committee is selected
    //   if (
    //     this.selectedAdvisor === null ||
    //     this.selectedCommittee1 === null ||
    //     this.selectedCommittee2 === null ||
    //     this.thaiName === '' ||
    //     this.thaiName === null ||
    //     this.engName === '' ||
    //     this.engName === null ||
    //     this.$refs.form.validate() === false
    //   )
    //     return

    //   if (this.isHaveAssignment) return

    //   this.$swal
    //     .fire({
    //       icon: 'info',
    //       title: 'Update group',
    //       text: 'Confirm update group.',
    //       showCancelButton: true,
    //       confirmButtonColor: '#3085d6',
    //       cancelButtonColor: '#d33',
    //       confirmButtonText: 'Yes'
    //     })
    //     .then(async (result) => {
    //       if (result.isConfirmed) {
    //         const res = await this.$axios.$put('group/updateGroup', {
    //           Project_NameTh: this.thaiName,
    //           Project_NameEn: this.engName,
    //           Studen_Number: this.projectMembers.length,
    //           Advisor_Email: this.selectedAdvisor.User_Email,
    //           CoAdvisor_Name: this.coadvisorName || '',
    //           Committee1_Email: this.selectedCommittee1?.User_Email,
    //           Committee2_Email: this.selectedCommittee2?.User_Email || '',
    //           Student1_Tel: this.phone[0],
    //           Student2_Tel: this.phone[1],
    //           Student3_Tel: this.phone[2],
    //           Student4_Tel: this.phone[3],
    //           Student5_Tel: this.phone[4],
    //           Student6_Tel: this.phone[5],
    //           Student7_Tel: this.phone[6],
    //           Student8_Tel: this.phone[7],
    //           Student9_Tel: this.phone[8],
    //           Student10_Tel: this.phone[9],
    //           Email_Student1: this.email[0],
    //           Email_Student2: this.email[1],
    //           Email_Student3: this.email[2],
    //           Email_Student4: this.email[3],
    //           Email_Student5: this.email[4],
    //           Email_Student6: this.email[5],
    //           Email_Student7: this.email[6],
    //           Email_Student8: this.email[7],
    //           Email_Student9: this.email[8],
    //           Email_Student10: this.email[9],
    //           Group_ID: this.$store.state.group.currentUserGroup.Group_ID
    //           // Project_on_term_ID:
    //           //   this.$store.state.auth.currentUser.projectOnTerm,
    //         })
    //         console.log(res)
    //         if (res.status == 200) {
    //           this.$swal
    //             .fire('Successed', 'Group has been created.', 'success')
    //             .then((result) => {
    //               if (result.isConfirmed) window.location.reload()
    //             })
    //         } else {
    //           this.$swal.fire('Error', res.msg, 'error')
    //         }
    //       }
    //     })
    // },
    // async handleInviteResponse(response) {
    //   // Just in case, validate form to make sure that everything is filled
    //   this.$refs.form.validate()
    //   if (!this.valid) return

    //   // Request invite response api
    //   try {
    //     // Show confirm dialog
    //     this.$swal
    //       .fire({
    //         icon: 'info',
    //         title: `Confirm ${
    //           response === 1 ? 'accept' : 'decline'
    //         } group invitation ?`,
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Confirm'
    //       })
    //       .then(async (result) => {
    //         if (result.isConfirmed) {
    //           const res = await this.$axios.$post('/group/updateMemberStatus', {
    //             User_Email: this.$store.state.auth.currentUser.email,
    //             Group_Id: this.$store.state.group.currentUserGroup.Group_ID,
    //             Status: response
    //           })
    //           if (res.status !== 200) throw err
    //           // Update the UI
    //           //! Cannot use 'this.$nuxt.refresh()' because the logic for updating member status is in mounted()
    //           this.showResposeBtn = false
    //           window.location.reload()
    //           return
    //         } else {
    //           return
    //         }
    //       })
    //   } catch (err) {
    //     console.log(err)
    //     this.$swal.fire('Error')
    //   }
    // }
  }
}
</script>
<style scoped>
.content {
  padding: 40px;
}
.v-btn {
  width: 200px;
}
</style>
