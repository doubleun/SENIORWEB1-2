<template>
  <div>
    <AdminSemesterDateFilter @filter-date="handleFilterDate" />

    <v-card>
      <template>
        <v-data-table
          :headers="headers"
          :items="allProjectOnTerms"
          hide-default-footer
        >
          <!-- Senior project name -->
          <template v-slot:item.Senior="{ item }">
            Senior Project {{ item.Senior }}
          </template>

          <!-- Semester / Academic Year -->
          <template v-slot:item.Academic_Term="{ item }">
            {{ item.Academic_Term }} / {{ item.Academic_Year }}
          </template>

          <!-- Start date -->
          <template v-slot:item.Access_Date_Start="{ item, index }">
            <!-- Date edit -->
            <div v-if="editedIndex === index">
              <v-menu
                ref="editStartDateMenu"
                v-model="item.startDateMenu"
                :close-on-content-click="false"
                :return-value.sync="editedItem.Access_Date_Start"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.Access_Date_Start"
                    prepend-icon="mdi-calendar"
                    hide-details
                    dense
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="editedItem.Access_Date_Start"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="item.startDateMenu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="
                      $refs.editStartDateMenu.save(editedItem.Access_Date_Start)
                    "
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </div>

            <!-- Date preview -->
            <div v-else>
              {{ formatDisplayDatePreview(item.Access_Date_Start) }}
            </div>
          </template>

          <!-- End date -->
          <template v-slot:item.Access_Date_End="{ item, index }">
            <!-- Date edit -->
            <div v-if="editedIndex === index">
              <v-menu
                ref="editEndDateMenu"
                v-model="item.endDateMenu"
                :close-on-content-click="false"
                :return-value.sync="editedItem.Access_Date_End"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.Access_Date_End"
                    prepend-icon="mdi-calendar"
                    hide-details
                    dense
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="editedItem.Access_Date_End"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="item.endDateMenu = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="
                      $refs.editEndDateMenu.save(editedItem.Access_Date_End)
                    "
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </div>

            <!-- Date preview -->
            <div v-else>
              {{ formatDisplayDatePreview(item.Access_Date_End) }}
            </div>
          </template>

          <!-- Edit score criteria button -->
          <template v-slot:item.action="{ item, index }">
            <div
              v-if="isEditing && index === editedIndex"
              class="flex"
              style="gap: 0.2rem"
            >
              <v-btn color="error" @click="closeEditDate" small
                ><v-icon small> mdi-close </v-icon></v-btn
              >
              <v-btn color="success" @click="handleSubmitDate" small
                ><v-icon small> mdi-check </v-icon></v-btn
              >
            </div>
            <div v-else>
              <v-btn color="primary" @click="editDate(item)" small
                ><v-icon small> mdi-pencil </v-icon> Edit</v-btn
              >
            </div>
          </template>
          <template v-slot:no-data>
            <p>No data found, please contact admin</p>
          </template>
        </v-data-table>
      </template>
    </v-card>
  </div>
</template>

<script>
import utils from "@/mixins/utils";
import dialog from "@/mixins/dialog";
export default {
  mixins: [utils, dialog],
  props: { academicYear: Number },
  data() {
    return {
      showDateDialog: false,
      editedItem: {},
      editedIndex: -1,
      isEditing: false,
      selectedSemesterFilter: { year: 0, semester: 0 },
      headers: [
        {
          text: "Name",
          align: "center",
          value: "Senior",
          // sortable: false,
        },
        {
          text: "Semester",
          align: "center",
          value: "Academic_Term",
          // sortable: false,
        },
        {
          text: "Start Date",
          align: "center",
          value: "Access_Date_Start",
          width: "24%",
          // sortable: false,
        },
        {
          text: "End Date",
          align: "center",
          value: "Access_Date_End",
          width: "24%",
          // sortable: false,
        },
        {
          text: "Action",
          value: "action",
          align: "center",
          sortable: false,
        },
      ],
      allProjectOnTerms: [],
    };
  },
  async fetch() {
    const initDate = this.$store.getters["auth/semesterData"];
    if (!!Array.isArray(initDate) && !!initDate.length > 0) {
      await this.handleFilterDate({
        year: initDate[0].Academic_Year,
        semester: initDate[0].Academic_Term,
      });
    }
  },
  methods: {
    /**
     * Format date for preview (not in edit mode)
     * @param date - date string that needs to be format
     */
    formatDisplayDatePreview(date) {
      if (!date) return;

      // Format dates to locale date string
      return this.formatLocaleDateString(date, {
        createDate: true,
        dateStyle: "medium",
        displayTime: false,
      });
    },
    editDate(item) {
      this.editedIndex = this.allProjectOnTerms.indexOf(item);
      this.isEditing = true;

      // Set editedItem object (for submitting api)
      this.editedItem = Object.assign({}, item);

      // Substring the ISO date format to use in datepicker
      this.editedItem.Access_Date_Start =
        this.editedItem.Access_Date_Start.substring(0, 10);
      this.editedItem.Access_Date_End =
        this.editedItem.Access_Date_End.substring(0, 10);
    },
    closeEditDate() {
      this.isEditing = false;
      this.$nextTick(() => {
        this.editedItem = {};
        this.editedIndex = -1;
      });
      console.log("this.editedItem", this.editedItem);
    },
    async handleSubmitDate() {
      const { Access_Date_Start, Access_Date_End, Project_on_term_ID } =
        this.editedItem;

      // Submit new semester using array for more secure ?
      const data = [Access_Date_Start, Access_Date_End, Project_on_term_ID];
      // Check if all data are there
      if (data.some((item) => !item)) {
        return;
      }

      try {
        const updateSemesterCallback = () =>
          this.$axios.post("/date/semester/update", {
            data,
          });

        // Submit data using update semester API
        const updateSemesterRes = await this.showLoading(
          updateSemesterCallback,
          { title: "Updating semester date" }
        );

        console.log("updateSemesterRes", updateSemesterRes);

        // TODO: Add error handler here ?

        this.closeEditDate();
        await this.$nuxt.refresh();
        return;
      } catch (err) {
        console.log(err);
        return;
      }
    },
    async handleFilterDate(dateFilter) {
      try {
        const fetchedProjectOnTerms = await this.$axios.post(
          "/date/getProjectOnTerm",
          {
            Academic_Year: dateFilter.year,
            Academic_Term: dateFilter.semester,
          }
        );
        // console.log("allProjectOnTerms", fetchedProjectOnTerms.data);
        this.allProjectOnTerms = fetchedProjectOnTerms.data;
        return;
      } catch (err) {
        console.log(err);
        return;
      }
    },
  },
  // computed: {
  //   isEdit,
  // },
};
</script>

<style>
.semester-date-card {
  padding: 0.4rem 1.4rem 1rem;
}
.semester-date-content p {
  margin: 0;
}
.semester-date-content {
  display: grid;
  grid-template-columns: repeat(4, auto);
  overflow-x: auto;
  margin-block-start: 1rem;
  text-align: center;
  align-items: center;
  gap: 2rem 1rem;
}
@media only screen and (max-width: 600px) {
  .semester-date-content {
    display: grid;
    grid-template-columns: auto 90px 80px 200px;
    overflow-x: auto;
    margin-block-start: 1rem;
    text-align: center;
    align-items: center;
    gap: 1rem;
    font-size: 14px;
  }
  .semester-date-content .v-btn__content {
    font-size: 12px;
  }
  .semester-date-content .v-icon {
    font-size: 16px !important;
  }
}
.semester-date-content > h4 {
  margin-block: 1rem;
}
</style>
