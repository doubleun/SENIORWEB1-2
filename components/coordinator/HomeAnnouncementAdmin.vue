<template>
  <div>
    <div class="announcement">
      <v-form>
        <v-row class="justify-end pr-5 pt-5 pb-2">
          <!-- Dialog -->
          <v-dialog v-if="userRole !== 0" v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
              <v-btn rounded dark color="indigo" v-on="on">
                Add announcement
              </v-btn>
              <!-- <v-btn @click="test">test</v-btn> -->
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h6 text-uppercase font-weight-bold">Add a new Announcement</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-col>
                    <h3>Detail Announcement</h3>
                    <v-textarea
                      v-model="Text"
                      label="Text"
                      name="textAdd"
                      ref="textAdd"
                      :rules="[(v) => !!v || 'Text is required']"
                      required
                      outlined
                    ></v-textarea>
                    <div v-if="isAdmin">
                      <h3>Major</h3>
                      <v-select
                        v-model="selectedMajorAdd"
                        label="Select Major"
                        name="selectAdd"
                        ref="selectAdd"
                        :items="majors"
                        :rules="[(val) => isSelectMajorAdd(val, allMajorAdd)]"
                        item-text="Major_Name"
                        item-value="Major_ID"
                        return-object
                        outlined
                        @change="handleSelectMajorAdd"
                      ></v-select>
                      <v-checkbox
                        v-model="allMajorAdd"
                        label="All major"
                        name="checkAdd"
                        ref="checkAdd"
                        @change="handleCheckboxAdd"
                      ></v-checkbox>
                    </div>
                  </v-col>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false"> Cancel </v-btn>
                <v-btn color="primary" dark @click="handleAddNewAnnounce">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-card class="content mt-5">
          <div class="carousel pa-5">
            <v-alert color="indigo lighten-5">
              <h3 class="font-weight-bold">Announcement</h3>
            </v-alert>

            <!-- Card result of announcement -->
            <div class="cardAnnouncement">
              <v-card
                v-for="(announcement, index) in displayAnnounce"
                :key="index"
                class="mb-5 elevation-0"
              >
                <v-card-text class="announcementRowContainer">
                  <!-- Announcement text and date -->
                  <div class="announceTextAndDate">
                    <h3 class="font-weight-bold">
                      <v-icon small>mdi-checkbox-blank-circle</v-icon>
                      {{ announcement.Text }}
                    </h3>

                    <div>
                      Announced on :
                      {{
                        Number.isInteger(parseInt(announcement.Publish_Date[0]))
                          ? offsetDate(announcement.Publish_Date)
                          : announcement.Publish_Date
                      }}
                    </div>
                    <div>
                      Major :
                      {{
                        announcement.allMajor == true
                          ? 'All'
                          : announcement.major.Major_Name
                      }}
                    </div>
                  </div>

                  <!-- Edit and delete announcement buttons -->
                  <div
                    v-if="
                      userRole === 0
                        ? false
                        : isAdmin
                        ? true
                        : !announcement.allMajor
                        ? true
                        : false
                    "
                    class="announceButtons"
                  >
                    <!-- Edit announcement dialog -->
                    <v-icon
                      large
                      color="blue darken-2"
                      @click="editItem(announcement)"
                    >
                      mdi-square-edit-outline
                    </v-icon>

                    <!-- Delete announcement -->
                    <v-icon
                      large
                      color="red darken-2"
                      :id="announcement.Announcement_ID"
                      @click="(e) => handleDeleteAnnouncement(e.target.id)"
                    >
                      mdi-delete-forever-outline
                    </v-icon>
                  </div>
                </v-card-text>
              </v-card>

              <!-- edit dialog -->
              <v-dialog v-model="editedItem.modal" max-width="600px">
                <!-- <template v-slot:activator="{ on }">
                  <v-icon large color="green darken-2" v-on="on">
                    mdi-square-edit-outline
                  </v-icon>
                </template> -->
                <v-card>
                  <v-card-title>
                    <span class="text-h6 font-weight-bold text-uppercase"
                      >Edit a Announcement</span
                    >
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-col>
                        <h3>Detail Announcement</h3>
                        <v-textarea
                          v-model="editedItem.Text"
                          label="Text"
                          name="textEdit"
                          ref="textEdit"
                          :rules="[(v) => !!v || 'Text is required']"
                          required
                          outlined
                        ></v-textarea>
                        <div v-if="isAdmin ? true : false">
                          <h3>Major</h3>
                          <v-select
                            v-model="editedItem.major"
                            label="Select Major"
                            name="selectEdit"
                            ref="selectEdit"
                            :items="majors"
                            :rules="[
                              (val) =>
                                isSelectMajorEdit(val, editedItem.allMajor)
                            ]"
                            @change="handleSelectMajorEdit()"
                            item-text="Major_Name"
                            item-value="Major_ID"
                            return-object
                            outlined
                          >
                          </v-select>
                          <v-checkbox
                            v-model="editedItem.allMajor"
                            label="All major"
                            name="checkEdit"
                            ref="checkEdit"
                            @change="handleCheckboxEdit(editedItem.major)"
                          ></v-checkbox>
                        </div>
                      </v-col>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="editedItem.modal = false">
                      Cancel
                    </v-btn>
                    <v-btn color="primary" dark @click="handleUpdateAnnouncement">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <div class="cardPagination">
                <v-row class="justify-end">
                  <v-pagination
                    v-model="page"
                    :length="pageLength"
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                  ></v-pagination>
                </v-row>
              </div>
            </div>
          </div>
        </v-card>
      </v-form>
    </div>
  </div>
</template>
<script>
import utils from '@/mixins/utils'

export default {
  props: {
    dataUi: Object,
    majors: Array,
    isAdmin: Boolean
  },
  data: () => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    modal: false,
    dialog: false,
    page: 1,
    submitSnackbar: false,
    snackbarText: 'Add new announcement successfully',
    allMajorAdd: false,
    allMajorEdit: false,
    selectedMajorAdd: {},
    selectedMajorEdit: {},
    Text: '',
    editedItem: {},
    userRole: null
  }),
  mixins: [utils],

  computed: {
    displayAnnounce() {
      // 4 is the maximum rows
      const startIndex = 4 * (this.page - 1)
      const endIndex = startIndex + 4
      return this.dataUi.announcements.slice(startIndex, endIndex)
    },
    pageLength() {
      return Math.ceil(this.dataUi.announcements.length / 4)
    }
  },

  mounted() {
    // console.log(this.dataUi);
    this.$emit('on-update-announcements')
    this.userRole = this.$store.state.auth.currentUser.role
  },

  methods: {
    // rule of selected major add
    isSelectMajorAdd(selectedMajor, allmajor) {
      if (
        (selectedMajor == null || selectedMajor.Major_ID == null) &&
        allmajor == false
      ) {
        return 'Please select Major'
      }

      return true
    },
    isSelectMajorEdit(selectedMajor, allmajor) {
      if (
        (selectedMajor == null || selectedMajor.Major_ID == 99) &&
        allmajor == false
      ) {
        return 'Please select Major'
      }

      return true
    },

    // offset date
    offsetDate(date) {
      // console.log("offsetdate", date);
      let offsetDate = new Date(
        new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
      ).toISOString()

      return (
        offsetDate.split('T')[0] + '\t' + offsetDate.split('T')[1].split('.')[0]
      )
    },

    // === Handle add new announcement === //
    async handleAddNewAnnounce() {
      // Check if all major is selected, if it is set selected major to 99 else set selected major to what ever the number user input

      let validateText = this.$refs.textAdd.validate('textAdd')

      // Check only admin role because other role not render ui to input
      let validateSelectMajor = true
      let validateCheckAllMajor = true
      let selectedMajor
      if (this.isAdmin) {
        validateSelectMajor = this.$refs.selectAdd.validate('selectAdd')
        validateCheckAllMajor = this.allMajorAdd

        selectedMajor = this.allMajorAdd ? 99 : this.selectedMajorAdd.Major_ID
      }

      // If there is no text or the selected major ID is not in the available ones stop the function
      if (!validateText || (!validateSelectMajor && !validateCheckAllMajor)) {
        return
      }

      // Send axios request to add new announcement
      const res = await this.$axios.$post('/announc/add', {
        Text: this.Text.trim(),
        MajorID: this.isAdmin
          ? selectedMajor
          : this.$store.state.auth.currentUser.major,
        Academic_Year: this.isAdmin
          ? this.$store.getters['auth/currentUser'].academicYear
          : null,
        Academic_Term: this.isAdmin
          ? this.$store.getters['auth/currentUser'].semester
          : null,
        Senior: this.isAdmin
          ? this.$store.getters['auth/currentUser'].senior
          : null
      })
      if (res.status === 200) {
        this.dialog = false

        this.$swal.fire(
          'Successed!',
          'A announcement has been added.',
          'success'
        )

        // Update UI
        this.$emit('on-update-announcements')

        // Clear text
        this.Text = ''
        this.MajorID = 0
        if (this.isAdmin) {
          this.$refs.textAdd.reset()
          this.$refs.selectAdd.reset()
          this.$refs.checkAdd.reset()
        }
      } else {
        this.dialog = false
        this.$swal.fire('Something wrong', res, 'error')
      }
    },

    // === Handle delete announcement from database === //
    async handleDeleteAnnouncement(id) {
      this.$swal
        .fire({
          title: 'Are you sure?',
          text: 'Are you sure to delete this announcement.',
          icon: 'warning',
          showCancelButton: true,
          // confirmButtonColor: "#d33",
          // cancelButtonColor: "#3085d6",
          confirmButtonText: 'Yes'
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const res = await this.$axios.$delete('/announc/delete', {
              data: {
                Announcement_ID: id
              }
            })
            if (res.status === 200) {
              this.$swal.fire(
                'Deleted!',
                'A announcement has been deleted.',
                'success'
              )
              // Update UI items
              this.$emit('on-update-announcements')
            } else {
              this.$swal.fire('Something wrong', res, 'error')
            }
          }
        })
    },

    // editItem
    editItem(item) {
      // this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item)
      this.editedItem.modal = true
      console.log(this.editedItem)
    },

    // === Handle update announcement === //
    async handleUpdateAnnouncement() {
      // Check if all major is selected, if it is set selected major to 99 else set selected major to what ever the number user input

      let validateText = this.$refs.textEdit.validate()

      let validateSelectMajor = true
      let selectedMajor
      if (this.isAdmin) {
        validateSelectMajor = this.$refs.selectEdit.validate()
        selectedMajor = this.editedItem.allMajor
          ? 99
          : this.editedItem.major.Major_ID
      }

      // If there is no text or the selected major ID is not in the available ones stop the function

      if (
        !validateText ||
        (!validateSelectMajor && !this.editedItem.allMajor)
      ) {
        return
      }

      // Send axios request to edit an announcement
      const res = await this.$axios.$post('announc/edit', {
        AnnouncementID: this.editedItem.Announcement_ID,
        Text: this.editedItem.Text.trim(),
        MajorID: this.isAdmin ? selectedMajor : this.editedItem.major.Major_ID
      })

      if (res.status === 200) {
        this.editedItem.modal = false
        this.$emit('on-update-announcements')

        this.$swal.fire(
          'Successed!',
          'A announcement has been added.',
          'success'
        )
      } else {
        this.editedItem.modal = false
        this.$swal.fire('Something wrong', res, 'error')
      }
    },
    handleSelectMajorAdd() {
      this.$refs.selectAdd.resetValidation()
      this.$refs.checkAdd.resetValidation()
      this.allMajorAdd = null
    },
    handleCheckboxAdd() {
      if (this.selectedMajorAdd != null) {
        this.selectedMajorAdd = null
      }
      this.$refs.selectAdd.resetValidation()
    },
    handleSelectMajorEdit() {
      this.$refs.selectEdit.resetValidation()
      this.$refs.checkEdit.resetValidation()
      this.editedItem.allMajor = false
    },
    handleCheckboxEdit(major) {
      if (major != null) {
        this.$refs.selectEdit.reset()
        return
      }
      this.$refs.selectEdit.resetValidation()
    }
  }
}
</script>
<style>
.announcementRowContainer {
  display: flex;
  flex-wrap: wrap;
}
.announcementRowContainer > .announceTextAndDate {
  flex: 1;
  min-width: 84%;
}
.announcementRowContainer > .announceButtons {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.4rem;
}
.announceButtons > button {
  font-size: 30px !important;
  cursor: pointer;
}
@media screen and (max-width: 510px) {
  .announcementRowContainer > .announceButtons {
    display: flex;
    gap: 0.4rem;
    flex-direction: row;
  }
}
</style>
