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
                <v-select dense filled hide-details off />
              </div>
            </div>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" text @click="close"> Cancel </v-btn>
              <v-btn color="primary"> Save </v-btn>
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
    selectedTeacher: { User_Name: "", User_Email: "" },
  }),
  methods: {
    editItem(e) {
      console.log("New e: ", e);
      this.selectedTeacher.User_Name = e.User_Name;
      this.selectedTeacher.User_Email = e.User_Email;
      this.dialog = true;
    },
    close() {
      this.selectedTeacherName = "";
      this.selectedTeacherEmail = "";
      this.dialog = false;
    },
    save() {
      this.close();
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
