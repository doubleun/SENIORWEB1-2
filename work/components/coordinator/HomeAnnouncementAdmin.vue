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
                      :rules="[(v) => !!v || 'Text is required']"
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
                          ? "All"
                          : announcement.major.Major_Name
                      }}
                    </div>
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
                                v-model="bindAnnouncement[index].Text"
                                label="Text"
                                name="textEdit"
                                ref="textEdit"
                                :rules="[(v) => !!v || 'Text is required']"
                                required
                                outlined
                              ></v-textarea>
                              <h3>Major</h3>
                              <v-select
                                v-model="bindAnnouncement[index].major"
                                label="Select Major"
                                name="selectEdit"
                                ref="selectEdit"
                                :items="majors"
                                :rules="[
                                  (val) =>
                                    isSelectMajorEdit(
                                      val,
                                      bindAnnouncement[index].allMajor
                                    ),
                                ]"
                                @change="handleSelectMajorEdit(index)"
                                item-text="Major_Name"
                                item-value="Major_ID"
                                return-object
                                outlined
                              >
                              </v-select>
                              <v-checkbox
                                v-model="bindAnnouncement[index].allMajor"
                                label="All major"
                                name="checkEdit"
                                ref="checkEdit"
                                @change="
                                  handleCheckboxEdit(
                                    index,
                                    bindAnnouncement[index].major
                                  )
                                "
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
                                bindAnnouncement[index].Announcement_ID,
                                bindAnnouncement[index].Text,
                                bindAnnouncement[index].major,
                                bindAnnouncement[index].allMajor,
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
                      @click="(e) => handleDeleteAnnouncement(e.target.id)"
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
import utils from "@/mixins/utils";

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
    editedText: "",
  }),
  props: ["dataUi", "majors", "bindAnnouncement"],
  mixins: [utils],

  computed: {
    displayAnnounce() {
      console.log("data ui", this.dataUi.announcements);
      // console.log("bindAnnouncement", this.bindAnnouncement);
      // console.log("data ui 0", this.dataUi.announcements[0]);
      // 4 is the maximum rows
      const startIndex = 4 * (this.page - 1);
      const endIndex = startIndex + 4;
      // console.log("start", startIndex);
      // console.log("end", endIndex);
      // console.log(
      //   "slice",
      //   this.dataUi.announcements.slice(startIndex, endIndex)
      // );
      return this.dataUi.announcements.slice(startIndex, endIndex);
    },
    pageLength() {
      return Math.ceil(this.dataUi.announcements.length / 4);
    },
  },

  methods: {
    // rule of selected major add
    isSelectMajorAdd(selectedMajor, allmajor) {
      // console.log("selectedMajor id", !selectedMajor.Major_ID);
      console.log("selectedMajor ", selectedMajor);
      console.log("allmajor", allmajor);
      console.log("========================");

      if (
        (selectedMajor == null || selectedMajor.Major_ID == null) &&
        allmajor == false
      ) {
        console.log("add");
        return "Please select Major";
      }

      console.log("have selected major");
      return true;
    },
    isSelectMajorEdit(selectedMajor, allmajor) {
      // console.log("selectedMajor id", !selectedMajor.Major_ID);
      console.log("selectedMajor ", selectedMajor);
      console.log("allmajor", allmajor);
      console.log("========================");

      if (
        (selectedMajor == null || selectedMajor.Major_ID == 99) &&
        allmajor == false
      ) {
        return "Please select Major";
      }

      // console.log("have selected major");
      return true;
    },
    // offset date
    offsetDate(date) {
      // console.log("offsetdate", date);
      let offsetDate = new Date(
        new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
      ).toISOString();

      return (
        offsetDate.split("T")[0] + "\t" + offsetDate.split("T")[1].split(".")[0]
      );
    },

    // === Handle add new announcement === //
    async handleAddNewAnnounce() {
      // Check if all major is selected, if it is set selected major to 99 else set selected major to what ever the number user input

      let validateText = this.$refs.textAdd.validate("textAdd");
      let validateSelectMajor = this.$refs.selectAdd.validate("selectAdd");
      let validateCheckAllMajor = this.allMajorAdd;

      // console.log("text add", textAdd);
      // console.log("select add", selectAdd);
      // console.log("check add", checkAdd);
      // console.log("========================");

      // If there is no text or the selected major ID is not in the available ones stop the function
      if (!validateText || (!validateSelectMajor && !validateCheckAllMajor)) {
        return;
      }

      const selectedMajor = this.allMajorAdd
        ? 99
        : this.selectedMajorAdd.Major_ID;

      // Send axios request to add new announcement
      const res = await this.$axios.$post("/announc/add", {
        Text: this.Text.trim(),
        MajorID: selectedMajor,
      });
      if (res.status === 200) {
        // this.snackbarText = "Add new announcement successfully";
        // this.submitSnackbar = true;
        this.dialog = false;

        this.$swal.fire(
          "Successed!",
          "A announcement has been added.",
          "success"
        );

        // Update UI
        this.$emit("on-update-announcements");
        // this.dataUi.announcements = [
        //   {
        //     Publish_Date: "please refresh",
        //     Text: this.Text.trim(),
        //     Major_ID: selectedMajor,
        //     allMajor: selectedMajor == 99 ? true : false,
        //     major: this.selectedMajorAdd,
        //     modal: false,
        //   },
        //   ...this.dataUi.announcements,
        // ];

        //  this.bindAnnouncement = [
        //   {
        //     Publish_Date: "please refresh",
        //     Text: this.Text.trim(),
        //     Major_ID: selectedMajor,
        //     allMajor: selectedMajor == 99 ? true : false,
        //     major: this.selectedMajorAdd,
        //     modal: false,
        //   },
        //   ...this.dataUi.announcements,
        // ];

        console.log(this.dataUi.announcements);

        // Clear text
        this.Text = "";
        this.MajorID = 0;
        this.$refs.textAdd.reset();
        this.$refs.selectAdd.reset();
        this.$refs.checkAdd.reset();
      } else {
        this.snackbarText =
          "Failed to add new announcement, please try again later";
        this.submitSnackbar = true;
        this.dialog = false;
      }
    },
    // === Handle delete announcement from database === //
    async handleDeleteAnnouncement(id) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "Are you sure to delete this announcement.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const res = await this.$axios.$delete("/announc/delete", {
              data: {
                Announcement_ID: id,
              },
            });
            if (res.status === 200) {
              this.$swal.fire(
                "Deleted!",
                "A announcement has been deleted.",
                "success"
              );
              // Update UI items
              this.dataUi.announcements = this.dataUi.announcements.filter(
                (itm) => itm.Announcement_ID !== parseInt(id)
              );
            } else {
              this.$swal.fire("Something wrong", res, "error");
            }
          }
        });
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

      // console.log("text ", text);
      // console.log("majorId ", majorId);
      // console.log("allMajor ", allMajor);
      // console.log("text ", validateText);

      let validateText = this.$refs.textEdit[index].validate("textEdit");
      let validateSelectMajor =
        this.$refs.selectEdit[index].validate("selectEdit");

      // console.log("text ", validateText);
      // console.log("select ", validateSelectMajor);
      // console.log("check ", allMajor);
      // console.log("========================");

      // If there is no text or the selected major ID is not in the available ones stop the function

      if (!validateText || (!validateSelectMajor && !allMajor)) {
        return;
      }

      // console.log("pass");

      // if (selectedMajor == null || text == null || text == "") {
      //   this.$refs.textEdit[index].validate("textEdit");
      //   this.$refs.selectEdit[index].validate("selectEdit");

      // return;
      // }

      const selectedMajor = allMajor ? 99 : majorId.Major_ID;
      // console.log(selectedMajor);
      // return;

      // // Send axios request to edit an announcement
      const res = await this.$axios.$post("announc/edit", {
        AnnouncementID: announcementId,
        Text: text.trim(),
        MajorID: selectedMajor,
      });

      if (res.status === 200) {
        this.dataUi.announcements[index].modal = false;
        this.$emit("on-update-announcements");

        this.$swal.fire(
          "Successed!",
          "A announcement has been added.",
          "success"
        );
      } else {
        this.snackbarText =
          "Failed to update an announcement, please try again later";
        this.submitSnackbar = true;
        this.dataUi.announcements[index].modal = false;
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
      // console.log("index", this.announcements[index]);

      this.$refs.selectEdit[index].resetValidation();
      this.$refs.checkEdit[index].resetValidation();
      this.bindAnnouncement[index].allMajor = false;
    },
    handleCheckboxEdit(index, major) {
      // console.log("index", index);

      if (major != null) {
        // this.announcements[index].major = null;
        this.$refs.selectEdit[index].reset();
        return;
      }
      this.$refs.selectEdit[index].resetValidation();
    },
  },
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
