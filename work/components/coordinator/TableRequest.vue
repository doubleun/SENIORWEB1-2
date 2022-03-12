<template>
  <v-data-table
    :headers="headers"
    :items="groupInfo"
    :search="searchGroup"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-col md="3">
          <v-text-field
            v-model="searchGroup"
            :rules="[(val) => handleValidateScore(val)]"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </v-col>
      </v-card-title>
      <!-- <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h6"
            >Are you sure you want to decline this group?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDelete"
              >Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="deleteItemConfirm"
              >OK</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title class="text-h5">
            Confirmation of joining the group?
          </v-card-title>

          <v-card-text>
            Once you have accepted to join the group, you cannot leave the
            group, but you can only leave if the student requests to disband the
            group.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="dialog = false">
              Disagree
            </v-btn>

            <v-btn color="green darken-1" text @click="save"> Agree </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> -->
    </template>
    <template v-slot:item.actions="{ item }">
      <v-row class="mb-6 pa-5 justify-center" no-gutters>
        <v-col md="3">
          <v-btn color="success" small @click="editItem(item)">
            <v-icon> mdi-check </v-icon>
          </v-btn>
        </v-col>
        <v-col md="4" offset-md="2">
          <v-btn color="error" small @click="deleteItem(item)">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>

<script>
import utils from "@/mixins/utils";

export default {
  mixins: [utils],
  data: () => ({
    searchGroup: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "GROUP NAME",
        align: "center",
        value: "groupName",
      },
      { text: "MEMBER", value: "member", align: "center" },
      { text: "ADVISOR", value: "advisor", align: "center" },
      { text: "COMMITTEE", value: "committee", align: "center" },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: 200,
      },
    ],
    idgroup: "",
    groupInfo: [],
    major: "",
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
  }),
  async fetch() {
    const res = await this.$axios.$post("/group/listrequestGroup", {
      User_Email: this.$store.state.auth.currentUser.email,
      Project_on_term_ID: this.$store.state.auth.currentUser.projectOnTerm,
      Group_Role: 1,
      Group_Role2: 0,
      User_Status: 0,
    });

    // set groupInfo to empty because nuxt.refect() does not reset variable
    this.groupInfo = [];

    for (let i = 0; i < res.length; i++) {
      this.groupInfo.push({
        groupName: res[i].Group_Name_Eng,
        member: res[i].Students,
        advisor: res[i].Advisor,
        committee: res[i].Committees,
        id: res[i].Group_ID,
      });
    }
    // console.log("group info", this.groupInfo);
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  methods: {
    handleValidateScore(val) {
      return this.handleValidateTextField({
        string: val,
        option: "onlyNormalCharEng",
        errorMsg: "Invalid search",
      });
    },
    async editItem(item) {
      var major = [];
      const res = await this.$axios.$post("/group/getGroupMajor", {
        Group_ID: item["id"],
      });

      var inputOptionsPromise = new Promise(function (resolve) {
        // get your data and pass it to resolve()

        for (let i = 0; i < res.length; i++) {
          major.push(res[i]["Major_Name"]);
        }
        resolve(major);
      });
      this.idgroup = item["id"];
      if (this.$store.state.auth.currentUser.name === item["advisor"] && major.length !==1) {
        this.$swal
          .fire({
            input: "select",
            inputOptions: inputOptionsPromise,
            inputValidator: (value) => {
              return !value && "You need to write something!";
            },
          })
          .then(async (result) => {
            let num = result["value"];
            this.major = major[num];
            this.$swal
              .fire({
                title: `Accept ${item.groupName} group?`,
                text: " Once you have accepted to join the group, you cannot leave the group, but you can only leave if the student requests to disband the group.",
                icon: "info",
                showCancelButton: true,
                // confirmButtonColor: "#3085d6",
                // cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
              })
              .then(async (result) => {
                if (result.isConfirmed) {
                  const res = await this.save();
                  if (res) {
                    this.$nuxt.refresh();

                    this.$swal.fire(
                      "Accepted",
                      `Your has been joined <b>${item.groupName}</b> group.`,
                      "success"
                    );
                  } else {
                    this.$swal.fire({
                      icon: "error",
                      title: "Join group Failed",
                      text: "Something went wrong!",
                    });
                  }
                }
              });
          });
      } else {
        this.$swal
          .fire({
            title: `Accept ${item.groupName} group?`,
            text: " Once you have accepted to join the group, you cannot leave the group, but you can only leave if the student requests to disband the group.",
            icon: "info",
            showCancelButton: true,
            // confirmButtonColor: "#3085d6",
            // cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          })
          .then(async (result) => {
            if (result.isConfirmed) {
              const res = await this.save();
              if (res) {
                this.$nuxt.refresh();

                this.$swal.fire(
                  "Accepted",
                  `Your has been joined <b>${item.groupName}</b> group.`,
                  "success"
                );
              } else {
                this.$swal.fire({
                  icon: "error",
                  title: "Join group Failed",
                  text: "Something went wrong!",
                });
              }
            }
          });
      }
    },
    deleteItem(item) {
      this.idgroup = item["id"];
      this.$swal
        .fire({
          title: `Decline ${item.groupName} group?`,
          text: "Confirmation of decline a group",
          icon: "info",
          showCancelButton: true,
          // confirmButtonColor: "#3085d6",
          // cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const res = await this.deleteItemConfirm();
            if (res) {
              this.$nuxt.refresh();
              this.$swal.fire(
                "Declined",
                `Your has been decline <b>${item.groupName}</b> group.`,
                "success"
              );
            } else {
              this.$swal.fire({
                icon: "error",
                title: "Decline group Failed",
                text: "Something went wrong!",
              });
            }
          }
        });
    },
    async deleteItemConfirm() {
      try {
        const res = await this.$axios.$post("/group/updateMemberStatus", {
          User_Email: this.$store.state.auth.currentUser.email,
          Group_Id: this.idgroup,
          Status: 2,
        });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },

    async save() {
      try {
        const res = await this.$axios.$post("/group/updateMemberStatus", {
          User_Email: this.$store.state.auth.currentUser.email,
          Group_Id: this.idgroup,
          Status: 1,
          Major: this.major,
        });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
</script>
