<template>
  <v-card class="long-table-card">
    <v-card-title>
      <h4>{{ tableTitle }}</h4>
      <v-text-field
        placeholder="Search"
        prepend-inner-icon="mdi-magnify"
        outlined
        hide-details
        dense
      ></v-text-field>
    </v-card-title>

    <!-- Grid table -->
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="itemPerPage"
      :item-key="itemKey"
      class="elevation-1"
    >
      <template v-slot:top>
        <!-- Edit teacher dialog -->
        <v-dialog v-model="dialog" max-width="500px" v-if="manageTeacher">
          <v-card class="edit-teacher-dialog-card">
            <v-card-title class="text-h5"> Edit teacher role </v-card-title>

            <div class="edit-teacher-input-flex">
              <div v-for="(attr, index) in teacherEditAttrs" :key="index">
                <v-subheader>{{ attr.lable }}</v-subheader>
                <v-text-field
                  v-model="selectedTeacher[attr.value]"
                  outlined
                  dense
                  hide-details
                  disabled
                ></v-text-field>
              </div>
              <div>
                <v-subheader>ROLE</v-subheader>
                <v-select
                  :items="availableRoles"
                  item-text="label"
                  item-value="value"
                  return-object
                  v-model="selectedTeacher.User_Role"
                  dense
                  outlined
                  hide-details
                  off
                />
              </div>
            </div>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" text @click="close"> Cancel </v-btn>
              <v-btn color="primary" @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <!-- <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>

      <!-- Conflict here -->
        <!-- <template v-slot:item.User_Role="{ item }">
        {{ (item.User_Role = handelTextRole(item.User_Role)) }} -->
        <!-- Conflict ends -->
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: {
    tableTitle: String,
    headers: Array,
    itemKey: String,
    itemPerPage: Number,
    items: Array,
    manageTeacher: Boolean,
    teacherEditAttrs: Array,
  },
  data: () => ({
    dialog: false,
    selectedTeacher: {
      User_Name: "",
      User_Email: "",
      User_Role: { label: "", value: 0 },
      Project_on_term_ID: 0,
    },
    availableRoles: [
      { label: "Teacher", value: 0 },
      { label: "Coordinator", value: 2 },
    ],
  }),
  mounted() {
    console.log(this.items);
  },
  methods: {
    editItem(e) {
      console.log("New e: ", e);
      this.selectedTeacher.User_Name = e.User_Name;
      this.selectedTeacher.User_Email = e.User_Email;
      this.selectedTeacher.User_Role = {
        label: e.User_Role === 0 ? "Teacher" : "Coordinator",
        value: e.User_Role,
      };
      this.selectedTeacher.Project_on_term_ID = e.Project_on_term_ID;
      this.dialog = true;
      console.log("Selected teacher: ", this.selectedTeacher);
    },
    close() {
      this.selectedTeacherName = "";
      this.selectedTeacherEmail = "";
      this.selectedTeacher.User_Role = { label: "", value: 0 };
      this.dialog = false;
    },
    async save() {
      try {
        this.$swal
          .fire({
            title: "Are you sure?",
            text: `${this.selectedTeacher.User_Name} will becomes ${this.selectedTeacher.User_Role.label}`,
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
          })
          .then(async (result) => {
            try {
              if (result.isConfirmed) {
                const res = await this.$axios.$post("/user/updateUserRole", {
                  User_Role: this.selectedTeacher.User_Role.value,
                  User_Email: this.selectedTeacher.User_Email,
                  Project_on_term_ID: this.selectedTeacher.Project_on_term_ID,
                });
                this.$swal.fire(
                  "Success",
                  `Update teacher role to ${this.selectedTeacher.User_Role.label}`,
                  "success"
                );
                // Update UI
                //FIXME: Can't use this because the dropdown role won't change, one way to change this is to emit an event to the parent, so the "selectedRole" can be change
                //FIXME: this.$nuxt.refresh();
                window.location.reload();
                this.close();
                return;
              }
            } catch (err) {
              console.log(err);
              this.close();
              return;
            }
          });
      } catch (err) {
        console.log(err);
        this.close();
        return;
      }
    },
    // handelTextRole(role) {
    //   console.log("handel text role");
    //   console.log(role);
    //   if (role == 0) {
    //     return "Teacher";
    //   } else if (role == 1) {
    //     return "Student";
    //   } else if (role == 2) {
    //     return "Coordinator";
    //   } else {
    //     return role;
    //   }
    // }
  },
};
</script>

<style scoped>
.long-table-card {
  padding: 0;
}
</style>
