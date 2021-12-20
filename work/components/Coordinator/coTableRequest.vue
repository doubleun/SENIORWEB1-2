<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    :search="search"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
        <v-card-title>    
        <v-spacer></v-spacer>
        <v-col md ="3">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </v-col>
        </v-card-title>
        <v-dialog v-model="dialogDelete" max-width="500px">
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
          Once you have accepted to join the group, you cannot leave the group, but you can only leave if the student requests to disband the group.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Disagree
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-row class="mb-6 pa-5 justify-center" no-gutters>
        <v-col md="3">
            <v-btn color="success" small @click.stop="dialog = true">
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
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "GROUP NAME",
        align: "center",
        value: "groupName",
      },
      { text: "MEMBER", value: "member", align: "center",},
      { text: "ADVISOR", value: "advisor", align: "center" },
      { text: "COMMITTEE", value: "committee", align: "center" ,},
      { text: "Actions", value: "actions", sortable: false, align: "center",width: 200  },
    ],
    desserts: [],
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
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.desserts = [
        {
          groupName: "Mobile Application for Karen ",
          member: "Anuthep Tayngam, Pipat Massri,",
          advisor: "Surapong Uttama",
          committee: "Khwunta Kirimasthong, Tossapon Boongeon",
        },
        {
          groupName:
            "Mobile Application for Karen Translator for Translator for Physiotherapy",
          member:
            "Anuthep Tayngam, Pipat Massri, Maneeya Soungpho, Surathat Chinarat, Sasreen Abdunsomad",
          advisor: "Surapong Uttama",
          committee: "Khwunta Kirimasthong, Tossapon Boongeon",
        },
      ];
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>