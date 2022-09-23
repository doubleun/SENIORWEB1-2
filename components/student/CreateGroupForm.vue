<template>
  <div>
    <v-row>
      <v-col>
        <h2 class="header-title mb-2 mt-5">Create Group</h2>
        <p v-if="headMember">
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
                :disabled="!headMember || isHaveAssignment"
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
                :disabled="!headMember || isHaveAssignment"
                required
                label="English Name"
                outlined
                dense
              ></v-text-field>
            </div>

            <!-- Part : project member -->
            <div class="projectMember">
              <h4 class="font-weight-bold mb-5">Project Member</h4>
              <!-- Student -->
              <!-- Loop the "projectMembers" array and render each student fields -->
              <div v-for="(member, index) in student" :key="index">
                <v-row class="container">
                  <h5 class="font-weight-bold">
                    Student {{ index + 1 }}
                    <!-- Icon indicate if teacher submiited eval comment yet -->
                    <v-chip
                      class="mx-2"
                      text-color="white"
                      :color="member.User_Status === 1 ? 'green' : 'orange'"
                      v-if="index === 0 || groupCreated || member.User_Status"
                    >
                      {{ member.User_Status === 1 ? 'Accepted' : 'Pendding' }}
                    </v-chip>
                  </h5>
                  <v-spacer></v-spacer>
                  <v-chip
                    v-if="
                      member.Group_Role !== 3 &&
                      headMember &&
                      !isHaveAssignment &&
                      member.User_Status != 1
                    "
                    color="error"
                    @click="removeMemberFields(member)"
                  >
                    <v-icon> mdi-delete </v-icon>
                  </v-chip>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      ref="stuName"
                      v-model="student[index].User_Name"
                      :rules="[
                        () =>
                          !!student[index].User_Email ||
                          'This field is required'
                      ]"
                      required
                      label="Student Name"
                      outlined
                      dense
                      disabled
                    >
                    </v-text-field>
                    <v-text-field
                      ref="stuPhoneNumber"
                      v-model="student[index].User_Phone"
                      :maxlength="10"
                      :rules="[
                        () =>
                          handleValidateTextField({
                            string: !member.User_Phone ? '' : member.User_Phone,
                            option: 'onlyNumber',
                            errorMsg:
                              'This field is required /Only number / Not allow start and end with space'
                          }),
                        () =>
                          !member.User_Phone
                            ? false
                            : member.User_Phone[0] != 0
                            ? 'Please Start with 0'
                            : member.User_Phone.length != 10
                            ? 'Only 10 digit of number'
                            : true
                      ]"
                      :disabled="!headMember || isHaveAssignment"
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
                        isHaveAssignment ||
                        member.User_Status === 1 ||
                        !headMember
                      "
                      :rules="[
                        () => selectMemberRules('student', student[index])
                      ]"
                      @input="
                        student[index] = handelAddGroupRole(
                          $event,
                          student[index],
                          'student',
                          member.Group_Member_ID
                        )
                      "
                      item-text="User_Identity_ID"
                      item-value="User_Identity_ID"
                      placeholder="Search student ID"
                      label="Student ID"
                      color="blue"
                      outlined
                      dense
                      hide-no-data
                      hide-selected
                      return-object
                      clearable
                    ></v-autocomplete>
                    <v-text-field
                      ref="stuEmail"
                      v-model="student[index].User_Email"
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
            <div
              class="d-flex justify-end"
              v-if="headMember && !isHaveAssignment"
            >
              <!-- Add member -->
              <div class="mb-5 mr-5" v-show="student.length < 10">
                <a class="text-decoration-underline" @click="addMemberFields"
                  >+ Add Member</a
                >
              </div>
            </div>
            <!-- Part : project advisor -->
            <div class="projectAdvisor">
              <h4 class="font-weight-bold">Project Advisor</h4>
              <v-row>
                <v-col>
                  <div v-for="(user, index) in advisor" :key="index">
                    <v-chip
                      class="my-5 ml-2"
                      text-color="white"
                      v-if="(!!user && groupCreated) || !headMember"
                      :color="user.User_Status == 1 ? 'green' : 'orange'"
                    >
                      {{ user.User_Status == 1 ? 'Accepted' : 'Pendding' }}
                    </v-chip>

                    <v-autocomplete
                      v-model="advisor[index]"
                      :items="allTeachersInSchool"
                      :filter="customTeacherFilter"
                      :disabled="
                        isHaveAssignment ||
                        user.User_Status === 1 ||
                        !headMember
                      "
                      :rules="[(val) => selectMemberRules('teacher', val)]"
                      @input="
                        advisor[index] = handelAddGroupRole(
                          $event,
                          advisor[index],
                          'advisor'
                        )
                      "
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
                    :disabled="isHaveAssignment || !headMember"
                    label="Co-advisor Name"
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
                      v-if="(!!user && groupCreated) || !headMember"
                      class="ma-2"
                      :color="user.User_Status == 1 ? 'green' : 'orange'"
                      text-color="white"
                    >
                      {{ user.User_Status == 1 ? 'Accepted' : 'Pendding' }}
                    </v-chip>

                    <v-autocomplete
                      v-model="committee[index]"
                      :items="allTeachersInSchool"
                      :filter="customTeacherFilter"
                      :disabled="
                        isHaveAssignment ||
                        user.User_Status === 1 ||
                        !headMember
                      "
                      :rules="[(val) => selectMemberRules('teacher', val)]"
                      @input="
                        committee[index] = handelAddGroupRole(
                          $event,
                          committee[index],
                          'committee'
                        )
                      "
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
                  v-if="this.groupMembers.length === 0"
                  @click="submitInfo"
                >
                  Create
                </v-btn>
                <v-btn
                  rounded
                  dark
                  color="indigo"
                  v-if="groupMembers.length !== 0 && !isHaveAssignment"
                  @click="submitInfo"
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

    studentLoading: false,
    // All students and teachers in major fecthed from database (see 'async fetch' down below)
    allStudentsInSchool: [],
    allTeachersInSchool: [],
    valid: true,
    coadvisorName: '',
    thaiName: '',
    engName: '',
    // email still importance or not cus email filed always disable
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) =>
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || 'E-mail must be valid'
    ],
    showResposeBtn: false,
    isHaveAssignment: false,
    student: [],
    advisor: [{}],
    committee: [{}, {}],
    deletedMember: []
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
    // console.log('Students: ', res.students)

    this.allTeachersInSchool = res.teachers
    // console.log('Teachers: ', res.teachers)

    // Sets group created to true
    if (this.groupMembers.length !== 0) this.groupCreated = true
  },
  watch: {
    // This will watch for changes in selected student (ie. run after click on auto complete student id)
    // And assign value into name and email array
    student(val) {
      // console.log(val)
    }
  },
  mounted() {
    // console.log('Group members: ', this.groupMembers)
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

      // set student user clone deep because data come from store
      this.student = this.handleCloneDeep(
        this.groupMembers.filter(
          (el) => el.Group_Role === 3 || el.Group_Role === 2
        )
      )

      // set advisor user clone deep because data come from store
      this.advisor = this.handleCloneDeep(
        this.groupMembers.filter((el) => el.Group_Role === 0)
      )
      if (this.advisor.length === 0) this.advisor = [{}]

      // set committee user clone deep because data come from store
      this.committee = this.handleCloneDeep(
        this.groupMembers.filter((el) => el.Group_Role === 1)
      )

      if (this.committee.length < 2)
        this.committee = Array(2 - this.committee.length).fill({})
    } else {
      // If no groups, set group created to false
      this.groupCreated = false
      // And insert the current user as head of the group (ie. first member)
      this.student.push({
        User_Email: this.$store.state.auth.currentUser.email,
        User_Identity_ID: this.$store.state.auth.currentUser.userId,
        User_Name: this.$store.state.auth.currentUser.name,
        User_Role: this.$store.state.auth.currentUser.role,
        Group_Role: 3,
        User_Major: this.$store.state.auth.currentUser.major,
        User_Status: 1
      })

      // console.log('inital student', this.student)
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
    // add group role when selected member
    handelAddGroupRole(event, user, role, groupMembersId) {
      if (event) {
        user = {
          ...event,
          Group_Role: role === 'student' ? 2 : role === 'advisor' ? 0 : 1,
          Group_Member_ID: groupMembersId
        }
      } else {
        user = { Group_Member_ID: groupMembersId }
      }
      return user
    },

    // student selected rules
    selectMemberRules(role, val) {
      // console.log('check duplicate member', val)
      let errorMsg = true
      if (!val || Object.keys(val).length === 0) {
        return (errorMsg = 'This field is required')
      }

      switch (role) {
        case 'student':
          this.handleDuplicateMember(val.User_Email, this.student) === true
            ? (errorMsg = 'Student has been in group')
            : (errorMsg = true)
          break

        case 'teacher':
          this.handleDuplicateMember(val.User_Email, [
            ...this.advisor,
            ...this.committee
          ]) === true
            ? (errorMsg = 'Teacher has been in group')
            : (errorMsg = true)
          break
      }

      return errorMsg
    },

    handleDuplicateMember(email, item) {
      // console.log(item)
      let count = 0
      if (!item || !email) {
        return true
      }
      for (let i = 0; i < item.length; i++) {
        if (!item[i] || Object.keys(item[i]).length === 0) continue
        if (email === item[i].User_Email) {
          count++
        }
        if (count === 2) {
          return true
        }
      }
      return false
    },

    // Add member fields
    addMemberFields() {
      // this.student = [...this.student, this.student.slice(-1)[0]]
      this.student.push({})
      // console.log('add student', this.student)
    },

    // Remove member fields
    removeMemberFields(user) {
      if (this.groupCreated) {
        this.deletedMember.push(user.Group_Member_ID)
        // console.log('deleted member', this.deletedMember)
      }

      this.student = this.student.filter((el) => el != user)
      // this.student.pop()
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
    },

    async submitInfo() {
      // Validate form to make sure that everything is filled

      if (this.$refs.form.validate() === false) return
      // let member = [...this.student, ...this.advisor, ...this.committee]
      // console.log('member', member)
      // return

      this.$swal
        .fire({
          icon: 'info',
          title: this.groupCreated ? 'Update group' : 'Create group',
          text: this.groupCreated
            ? 'Confirm update group.'
            : 'Confirm create group.',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        })
        .then(async (result) => {
          let groupId = this.$store.state.group.currentUserGroup
            ? this.$store.state.group.currentUserGroup.Group_ID
            : null
          if (result.isConfirmed) {
            try {
              const res = await this.$axios.$post('/group/createGroup', {
                Group_Name_Thai: this.thaiName,
                Group_Name_Eng: this.engName,
                Co_Advisor: this.coadvisorName || '',
                Major: this.$store.state.auth.currentUser.major,
                // member: member,
                student: this.student,
                advisor: this.advisor,
                committee: this.committee,
                groupCreated: this.groupCreated,
                deletedMember: this.deletedMember,
                Group_ID: groupId
              })

              if (res.status === 200) {
                this.$swal
                  .fire({
                    title: 'Successed!',
                    text: `Group has been ${
                      this.groupCreated ? 'updated' : 'created'
                    }.`,
                    icon: 'success',
                    // confirmButtonColor: '#3085d6',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                      // this.$emit('refresh')
                      // this.$nuxt.refresh()
                      window.location.reload()
                    }
                  })
              } else {
                throw ''
              }
            } catch (error) {
              console.log(error)
            }
          }
        })
    },

    async handleInviteResponse(response) {
      // Just in case, validate form to make sure that everything is filled
      this.$refs.form.validate()
      if (!this.valid) return

      // Request invite response api
      try {
        // Show confirm dialog
        this.$swal
          .fire({
            icon: 'info',
            title: `Confirm ${
              response === 1 ? 'accept' : 'decline'
            } group invitation ?`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm'
          })
          .then(async (result) => {
            if (result.isConfirmed) {
              const res = await this.$axios.$post('/group/updateMemberStatus', {
                User_Email: this.$store.state.auth.currentUser.email,
                Group_Id: this.$store.state.group.currentUserGroup.Group_ID,
                Status: response
              })
              // if (res.status !== 200) throw err
              // Update the UI
              //! Cannot use 'this.$nuxt.refresh()' because the logic for updating member status is in mounted()
              if (res.status === 200) {
                this.$swal
                  .fire({
                    title: 'Successed!',
                    text: `${response === 1 ? 'Join' : 'Decline'} successfully`,
                    icon: 'success',
                    // confirmButtonColor: '#3085d6',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                      // this.$emit('refresh')
                      // this.$nuxt.refresh()
                      // this.showResposeBtn = false
                      window.location.reload()
                    }
                  })
              } else {
                throw ''
              }
            }
          })
      } catch (err) {
        console.log(err)
        this.$swal.fire('Error')
      }
    }
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
