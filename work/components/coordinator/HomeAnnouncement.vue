<template>
  <div>
    <div class="announcement">
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
        <v-dialog v-if="userRole == 2" v-model="dialog" max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn rounded dark color="indigo" v-on="on" v-if="editable">
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
                    outlined
                  ></v-textarea>
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

                  Announced on :
                  {{
                    Number.isInteger(parseInt(announcement.Publish_Date[0]))
                      ? offsetDate(announcement.Publish_Date)
                      : announcement.Publish_Date
                  }}
                </div>

                <!-- Edit and delete announcement buttons -->
                <div
                  v-if="
                    announcement.Major_ID != 99 && userRole == 2 && editable
                  "
                  class="announceButtons"
                >
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
                          <h3>Detail Announcement</h3>
                          <v-col>
                            <v-textarea
                              v-model="bindAnnouncement[index].Text"
                              label="Text"
                              name="textEdit"
                              ref="textEdit"
                              outlined
                            ></v-textarea>
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
    Text: "",
    userRole: null,
  }),
  props: {
    dataUi: Object,
    editable: Boolean,
    bindingData: Array,
  },
  computed: {
    displayAnnounce() {
      // 4 is the maximum rows
      const startIndex = 4 * (this.page - 1);
      const endIndex = startIndex + 4;
      return this.dataUi.announcement.slice(startIndex, endIndex);
    },
    pageLength() {
      return Math.ceil(this.dataUi.announcement.length / 4);
    },
    bindAnnouncement() {
      const startIndex = 4 * (this.page - 1);
      const endIndex = startIndex + 4;
      return this.bindingData.slice(startIndex, endIndex);
    },
  },

  mounted() {
    this.userRole = this.$store.state.auth.currentUser.role;
    // console.log("role", this.role);
    // console.log("dataUi", this.dataUi);
    // console.log("bindAnnouncement", this.bindingData);
  },

  methods: {
    // test() {
    //   // console.log(this.$store.state.auth);
    //   console.log(this.dataUi);
    // },
    // === Handle add new announcement === //
    async handleAddNewAnnounce() {
      // Check if all major is selected, if it is set selected major to 99 else set selected major to what ever the number user input
      // ** changed selected major to get from state
      const selectedMajor = this.$store.state.auth.currentUser.major;
      let validateText = this.$refs.textAdd.validate("textAdd");

      // console.log("selectedMajor", selectedMajor);
      // console.log("validateText", validateText);
      if (!validateText) return;

      // Send axios request to add new announcement
      const res = await this.$axios.$post("announc/add", {
        Text: this.Text.trim(),
        MajorID: selectedMajor,
      });
      if (res.status === 200) {
        this.dialog = false;
        this.$swal.fire(
          "Successed!",
          "A announcement has been added.",
          "success"
        );

        this.$emit("on-update-announcements");

        // Clear text
        this.Text = "";
        this.$refs.textAdd.reset();
      } else {
        this.dialog = false;
        this.$swal.fire("Something wrong", res, "error");
      }
    },
    // === Handle delete announcement from database === //
    async handleDeleteAnnouncement(id) {
      // console.log("id", id);
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "Are you sure to delete this announcement.",
          icon: "warning",
          showCancelButton: true,
          // confirmButtonColor: "#d33",
          // cancelButtonColor: "#3085d6",
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
              this.dataUi.announcement = this.dataUi.announcement.filter(
                (itm) => itm.Announcement_ID !== parseInt(id)
              );
              this.bindingData = this.bindingData.filter(
                (itm) => itm.Announcement_ID !== parseInt(id)
              );
            } else {
              this.$swal.fire("Something wrong", res, "error");
            }
          }
        });
    },
    // === Handle update announcement === //
    async handleUpdateAnnouncement(announcementId, text, index) {
      // console.log(announcementId, text, index);
      // Check if all major is selected, if it is set selected major to 99 else set selected major to what ever the number user input
      // const selectedMajor = this.$store.state.auth.currentUser.major;
      // If there is no text or the selected major ID is not in the available ones stop the function
      let validateText = this.$refs.textEdit[index].validate("textEdit");
      if (!validateText) return;

      // return;

      const selectedMajor = this.$store.state.auth.currentUser.major;
      // Send axios request to edit an announcement
      const res = await this.$axios.$post("announc/edit", {
        AnnouncementID: announcementId,
        Text: text.trim(),
        MajorID: selectedMajor,
      });

      if (res.status === 200) {
        this.dataUi.announcement[index].modal = false;
        this.$emit("on-update-announcements");

        this.$swal.fire(
          "Successed!",
          "A announcement has been added.",
          "success"
        );
      } else {
        this.dataUi.announcements[index].modal = false;
        this.$swal.fire("Something wrong", res, "error");
      }
    },
    offsetDate(date) {
      // console.log("offsetdate", date);
      let offsetDate = new Date(
        new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
      ).toISOString();

      return (
        offsetDate.split("T")[0] + "\t" + offsetDate.split("T")[1].split(".")[0]
      );
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
