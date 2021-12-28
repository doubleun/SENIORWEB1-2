<template>
  <div>
    <div class="announcement">
      <v-form>
        <!-- 
        //* Snack bar (success dialog) *//
      -->
        <v-snackbar v-model="submitSnackbar" right top light>
          {{ snackbarText }}

          <template v-slot:action="{ attrs }">
            <v-btn
              color="pink"
              text
              v-bind="attrs"
              @click="submitSnackbar = false"
            >
              Dismiss
            </v-btn>
          </template>
        </v-snackbar>
        <!-- Add announcement button -->

        <v-row class="justify-end pr-5 pt-5 pb-2">
          <!-- Dialog -->
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
              <v-btn rounded dark color="indigo" v-on="on">
                Add announcement
              </v-btn>
              <!-- <v-btn @click="test">test</v-btn> -->
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h6 font-weight-bold">Add Announcement</span>
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
                      :rules="[v => !!v || 'Text is required']"
                      required
                      outlined
                    ></v-textarea>
                    <h3>Major</h3>
                    <v-select
                      v-model="selectedMajorAdd"
                      label="Select Major"
                      name="selectAdd"
                      ref="selectAdd"
                      :items="majors"
                      :rules="[
                        v => !!v || 'Item is required',
                        v => null || 'Item is required'
                      ]"
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
                      :rules="[v => !!v || 'Item is required']"
                    ></v-checkbox>
                  </v-col>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" text @click="dialog = false"> Cancel </v-btn>
                <v-btn color="green" text @click="handleAddNewAnnounce">
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

                    announced on : {{ announcement.Publish_Date }}
                  </div>

                  <!-- Edit and delete announcement buttons -->
                  <div class="announceButtons">
                    <!-- Edit announcement dialog -->
                    <v-dialog v-model="announcement.modal" max-width="600px">
                      <template v-slot:activator="{ on }">
                        <v-icon large color="green darken-2" v-on="on">
                          mdi-square-edit-outline
                        </v-icon>
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="text-h6 font-weight-bold"
                            >Edit Announcement</span
                          >
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-col>
                              <v-textarea
                                :value="announcement.Text"
                                label="Text"
                                name="textEdit"
                                ref="textEdit"
                                :rules="[v => !!v || 'Text is required']"
                                required
                                outlined
                              ></v-textarea>
                              <h3>Major</h3>
                              <v-select
                                v-model="announcement.Major_ID"
                                label="Select Major"
                                name="selectEdit"
                                ref="selectEdit"
                                @change="
                                  handleSelectMajorEdit(index, announcement)
                                "
                                :items="majors"
                                :rules="[
                                  v => !!v || 'Item is required',
                                  v => null || 'Item is required'
                                ]"
                                item-text="Major_Name"
                                item-value="Major_ID"
                                outlined
                              >
                              </v-select>
                              <v-checkbox
                                v-model="announcement.allMajor"
                                label="All major"
                                name="checkEdit"
                                ref="checkEdit"
                                @change="
                                  handleCheckboxEdit(
                                    index,
                                    announcement.Major_ID
                                  )
                                "
                                :rules="[v => !!v || 'Item is required']"
                              ></v-checkbox>
                            </v-col>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="red"
                            text
                            @click="announcement.modal = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            color="green"
                            text
                            @click="
                              handleUpdateAnnouncement(
                                announcement.Announcement_ID,
                                announcement.Text,
                                announcement.Major_ID,
                                announcement.allMajor,
                                index
                              )
                            "
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>

                    <!-- Delete announcement -->
                    <v-icon
                      large
                      color="red darken-2"
                      :id="announcement.Announcement_ID"
                      @click="e => handleDeleteAnnouncement(e.target.id)"
                    >
                      mdi-delete-forever-outline
                    </v-icon>
                  </div>
                </v-card-text>
              </v-card>
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
export default {
  data: () => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    modal: false,
    dialog: false,
    page: 1,
    submitSnackbar: false,
    snackbarText: "Add new announcement successfully",
    allMajorAdd: false,
    allMajorEdit: false,
    selectedMajorAdd: {},
    selectedMajorEdit: {},
    Text: "",
    availableMajors: [1, 2, 3, 4, 5, 6, 7, 99]
  }),
  computed: {
    displayAnnounce() {
      console.log(this.announcements);
      // 4 is the maximum rows
      const startIndex = 4 * (this.page - 1);
      const endIndex = startIndex + 4;
      return this.announcements.slice(startIndex, endIndex);
    },
    pageLength() {
      return Math.ceil(this.announcements.length / 4);
    }
  },
  props: ["announcements", "majors"],
  methods: {
    test() {
      // console.log(this.$store.state.auth);
      console.log(this.announcements);
    },
    // === Handle add new announcement === //
    async handleAddNewAnnounce() {
      // Check if all major is selected, if it is set selected major to 99 else set selected major to what ever the number user input
      const selectedMajor = this.allMajorAdd
        ? 99
        : this.selectedMajorAdd.Major_ID;

      // If there is no text or the selected major ID is not in the available ones stop the function
      if (selectedMajor == null || !this.$refs.textAdd.validate("textAdd")) {
        this.$refs.textAdd.validate("textAdd");
        if (selectedMajor == null) {
          this.$refs.selectAdd.validate("selectAdd");
        }
        return;
      }

      // Send axios request to add new announcement
      const res = await this.$axios.$post(
        "http://localhost:3000/api/announc/add",
        {
          Text: this.Text,
          MajorID: selectedMajor
        }
      );
      if (res.status === 200) {
        this.snackbarText = "Add new announcement successfully";
        this.submitSnackbar = true;
        this.dialog = false;

        // Update UI
        this.announcements = [
          ...this.announcements,
          {
            Text: this.Text,
            Major_ID: selectedMajor,
            Publish_Date: "please refresh"
          }
        ];

        // Clear text
        this.Text = "";
        this.MajorID = 0;
      } else {
        this.snackbarText =
          "Failed to add new announcement, please try again later";
        this.submitSnackbar = true;
        this.dialog = false;
      }
    },
    // === Handle delete announcement from database === //
    async handleDeleteAnnouncement(id) {
      if (confirm("Are you sure you want to delete this announcement?")) {
        const res = await this.$axios.$delete(
          "http://localhost:3000/api/announc/delete",
          {
            data: {
              Announcement_ID: id
            }
          }
        );
        if (res.status === 200) {
          this.snackbarText = "An announcement has been deleted";
          this.submitSnackbar = true;

          // Update UI items
          this.announcements = this.announcements.filter(
            itm => itm.Announcement_ID !== parseInt(id)
          );
        } else {
          this.snackbarText =
            "Failed to add new announcement, please try again later";
          this.submitSnackbar = true;
        }
      }
    },
    // === Handle update announcement === //
    async handleUpdateAnnouncement(
      announcementId,
      text,
      majorId,
      allMajor,
      index
    ) {
      // console.log(id, text, majorId, allMajor);
      // Check if all major is selected, if it is set selected major to 99 else set selected major to what ever the number user input

      const selectedMajor = allMajor ? 99 : majorId;
      // console.log("annID", announcementId);
      // console.log("text", text);
      // console.log("major id", majorId);
      // console.log("all", allMajor);
      // console.log("index", index);
      console.log("index", this.$refs.textEdit[index].validate("textEdit"));

      // this.$refs.textEdit[0].validate()

      // If there is no text or the selected major ID is not in the available ones stop the function
      if (
        selectedMajor == null ||
        !this.$refs.textEdit[index].validate("textEdit")
      ) {
        this.$refs.textEdit[index].validate("textEdit");
        console.log("selectMajor1", selectedMajor);
        if (selectedMajor == null) {
          this.$refs.selectEdit[index].validate("selectEdit");
          console.log("selectMajor", selectedMajor);
        }
        return;
      }

      // // Send axios request to edit an announcement
      const res = await this.$axios.$post(
        "http://localhost:3000/api/announc/edit",
        {
          AnnouncementID: announcementId,
          Text: text,
          MajorID: selectedMajor
        }
      );

      if (res.status === 200) {
        this.snackbarText = "Announcement has been updated successfully";
        this.submitSnackbar = true;
        this.announcements[index].modal = false;
      } else {
        this.snackbarText =
          "Failed to update an announcement, please try again later";
        this.submitSnackbar = true;
        this.announcements[index].modal = false;
      }
    },
    handleSelectMajorAdd() {
      // this.$refs.selectAdd.reset();
      this.$refs.selectAdd.resetValidation();
      this.$refs.checkAdd.resetValidation();
      this.allMajorAdd = null;
    },
    handleCheckboxAdd() {
      if (this.selectedMajorAdd != null) {
        this.selectedMajorAdd = null;
      }
      this.$refs.selectAdd.resetValidation();
    },
    handleSelectMajorEdit(index) {
      // this.$refs.selectAdd.reset();
      // console.log("index", this.announcements);

      this.$refs.selectEdit[index].resetValidation();
      this.$refs.checkEdit[index].resetValidation();
      this.announcements[index].allMajor = false;
    },
    handleCheckboxEdit(index, major) {
      console.log("index", index);

      if (major != null) {
        this.$refs.selectEdit[index].reset();
        return;
      }
      this.$refs.selectEdit[index].resetValidation();
    }
  }
};
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
