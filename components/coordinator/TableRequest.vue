<template>
  <v-card>
    <v-card-title>
      <h3>Group</h3>
      <v-spacer></v-spacer>
      <v-row class="d-flex justify-end">
        <v-col md="2"></v-col>

        <v-col md="6">
          <v-text-field
            v-model="searchGroup"
            clearable
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="groupInfo"
      :search="searchGroup"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top> </template>
      <template v-slot:item.actions="{ item }">
        <v-row class="mb-6 pa-5 justify-center" no-gutters>
          <v-col md="3">
            <v-btn color="success" small @click="acceptGroup(item)">
              <v-icon> mdi-check </v-icon>
            </v-btn>
          </v-col>
          <v-col md="4" offset-md="2">
            <v-btn color="error" small @click="declineGroup(item)">
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import utils from '@/mixins/utils'

export default {
  mixins: [utils],
  data: () => ({
    searchGroup: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'GROUP NAME',
        align: 'center',
        value: 'groupName'
      },
      { text: 'MEMBER', value: 'member', align: 'center' },
      { text: 'ADVISOR', value: 'advisor', align: 'center' },
      { text: 'COMMITTEE', value: 'committee', align: 'center' },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: 200
      }
    ],
    idgroup: '',
    groupInfo: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    }
  }),
  async fetch() {
    const res = await this.$axios.$post('/group/listrequestGroup', {
      User_Email: this.$store.state.auth.currentUser.email,
      // Project_on_term_ID: this.$store.state.auth.currentUser.projectOnTerm,
      Group_Role: 1,
      Group_Role2: 0,
      User_Status: 0
    })

    // set groupInfo to empty because nuxt.refect() does not reset variable
    this.groupInfo = []

    for (let i = 0; i < res.length; i++) {
      this.groupInfo.push({
        groupName: res[i].Group_Name_Eng,
        member: res[i].Students,
        advisor: res[i].Advisor,
        committee: res[i].Committees,
        id: res[i].Group_ID
      })
    }
    // console.log("group info", this.groupInfo);
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    }
  },
  methods: {
    handleValidateScore(val) {
      return this.handleValidateTextField({
        string: val,
        option: 'onlyNormalCharEng',
        errorMsg: 'Invalid search'
      })
    },
    async acceptGroup(item) {
      // let major = []
      let allGroupMajor = await this.$axios.$post('/group/getGroupMajor', {
        Group_ID: item.id
      })

      allGroupMajor = new Map(
        allGroupMajor.map((el) => [el.Major_ID, el.Major_Name])
      )

      this.$swal
        .fire({
          title: `Accept ${item.groupName} group?`,
          text: ' Once you have accepted to join the group, you cannot leave the group, but you can only leave if the student requests to disband the group.',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Yes'
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            if (
              this.$store.state.auth.currentUser.name === item['advisor'] &&
              allGroupMajor.size > 1
            ) {
              this.$swal
                .fire({
                  title: 'Confirm Group Major',
                  input: 'select',
                  showCancelButton: true,
                  // inputLabel: "Majors",
                  inputOptions: allGroupMajor,
                  inputValidator: (value) => {
                    return !value && 'You need to select some major!'
                  }
                })
                .then(async (result) => {
                  if (result.isConfirmed) {
                    let majorID = result['value']
                    this.save(item, 1, majorID)
                  }
                })
            } else {
              await this.save(item, 1)
            }
          }
        })
    },
    async declineGroup(item) {
      this.$swal
        .fire({
          title: `Decline ${item.groupName} group?`,
          text: 'Confirmation of decline a group',
          icon: 'info',
          showCancelButton: true,
          // confirmButtonColor: "#3085d6",
          // cancelButtonColor: "#d33",
          confirmButtonText: 'Yes'
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            this.save(item, 2)
          }
        })
    },

    /**
     * @param status - status = 1 is join, status = 2 is left
     */
    async save(item, status, majorID) {
      try {
        await this.$axios.$post('/group/updateMemberStatus', {
          User_Email: this.$store.state.auth.currentUser.email,
          Group_Id: item.id,
          Status: status,
          Major: majorID || null
        })
        // if (res) {
        this.$nuxt.refresh()
        this.$swal.fire(
          'Accepted',
          `Your has been ${status === 1 ? 'accept' : 'decline'} <b>${
            item.groupName
          }</b> group.`,
          'success'
        )
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
