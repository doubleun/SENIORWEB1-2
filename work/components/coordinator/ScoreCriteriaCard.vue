<template>
  <v-card class="score-criteria-card">
    <v-card-title>
      <h4>Score Criteria</h4>
      <h4>Total: {{ allScoresTotal }}/100</h4>
    </v-card-title>

    <!-- Score criteria data table -->
    <template>
      <v-data-table
        :headers="headers"
        :items="scoreCriterias"
        sort-by="Progress_ID"
        hide-default-footer
      >
        <!-- Score criteria data table: header (committees total) -->
        <template v-slot:header.Committee_Score="{ header }">
          <v-tooltip bottom>
            <!-- Tool tip content -->
            <template v-slot:activator="{ on, attrs }">
              <div class="table-header-icon" v-bind="attrs" v-on="on">
                <p>{{ header.text }}</p>
                <v-icon small color="primary">mdi-information</v-icon>
              </div>
            </template>
            <!-- Tool tip text -->
            <span>The score will be divide in half for each committee</span>
          </v-tooltip>
        </template>

        <!-- Score criteria data table: header (toggle) -->
        <template v-slot:header.toggle="{ header }">
          <v-tooltip bottom>
            <!-- Tool tip content -->
            <template v-slot:activator="{ on, attrs }">
              <div class="table-header-icon" v-bind="attrs" v-on="on">
                <p>{{ header.text }}</p>
                <v-icon small color="primary">mdi-information</v-icon>
              </div>
            </template>
            <!-- Tool tip text -->
            <span>Progress needs to be add first to unlock toggle</span>
          </v-tooltip>
        </template>

        <!-- Score criteria data table: Dialog edit score criteria card -->
        <template v-slot:top>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5"
                  >Edit progress: {{ editedItem.Progress_Name }}</span
                >
              </v-card-title>

              <!-- Edit progress card modal -->
              <v-card-text style="padding: 0 24px 0 24px">
                <v-container>
                  <!-- Edit card: progress due date row -->
                  <v-row>
                    <v-col cols="12" lg="6">
                      <DatePicker
                        dateLabel="Begin date"
                        :date="editedItem.DueDate_Start"
                        @update-date="
                          (newDate) =>
                            handleUpdateDate('DueDate_Start', newDate)
                        "
                      />
                    </v-col>
                    <v-col cols="12" lg="6">
                      <DatePicker
                        dateLabel="End date"
                        :date="editedItem.DueDate_End"
                        :minDate="editedItem.DueDate_Start"
                        @update-date="
                          (newDate) => handleUpdateDate('DueDate_End', newDate)
                        "
                      />
                    </v-col>
                  </v-row>
                  <!-- Edit card: progress name -->
                  <v-form ref="form">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.Advisor_Score"
                          prepend-icon="mdi-account-check"
                          label="Advisor score"
                          :rules="[
                            () => handleValidateScore(editedItem.Advisor_Score),
                          ]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.Committee_Score"
                          prepend-icon="mdi-account-multiple-check"
                          hint="The score will be divide in half for each committee"
                          label="Comittees total score"
                          :rules="[
                            () =>
                              handleValidateScore(editedItem.Committee_Score),
                          ]"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions style="padding: 8px 16px 16px 16px">
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="close"> Cancel </v-btn>
                <v-btn color="primary" dark @click="handleEditScoreCriteria">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <!-- Score criteria data table: content data templates -->
        <!-- Currently active -->
        <template v-slot:item.Status="{ item }">
          <div class="score-criteria-status-container">
            <h4 v-if="item.Status" class="success--text">
              <v-icon small color="success darken-1">mdi-circle</v-icon> Active
            </h4>
            <h4 v-else class="error--text">
              <v-icon small color="error darken-1">mdi-circle</v-icon> Inactive
            </h4>
          </div>
        </template>
        <!-- Due date start and end (DueDate_Start - DueDate_End) -->
        <template v-slot:item.DueDate_Start="{ item }">
          <div>
            {{
              !!item.Score_criteria_ID
                ? formatDisplayDate([item.DueDate_Start, item.DueDate_End])
                : "NaN"
            }}
          </div>
        </template>
        <!-- Due-date end (DueDate_End)
        <template v-slot:item.DueDate_End="{ item }">
          <div>
            {{ !!item.Score_criteria_ID ? item.DueDate_End : "NaN" }}
          </div>
        </template> -->
        <!-- Switch toggle -->
        <template v-slot:item.toggle="{ item }">
          <div style="display: flex; justify-content: center">
            <v-switch
              v-model="item.Status"
              :false-value="0"
              :true-value="1"
              :data-criteria-id="item.Score_criteria_ID"
              @click="handleToggleStatus($event, item.Status)"
              hide-details
              :ripple="false"
              :disabled="!item.Score_criteria_ID || isAdmin"
              inset
              style="margin: 0"
            />
          </div>
        </template>
        <!-- Edit score criteria button -->
        <template v-slot:item.edit="{ item }">
          <v-btn color="primary" @click="editItem(item)" :disabled="isAdmin"
            ><v-icon small>
              {{ !!item.Score_criteria_ID ? "mdi-pencil" : "mdi-plus-circle" }}
            </v-icon>
            {{ !!item.Score_criteria_ID ? "Edit" : "Add" }}</v-btn
          >
        </template>
        <template v-slot:no-data>
          <p>No data found, please contact admin</p>
        </template>
      </v-data-table>
    </template>
  </v-card>
</template>

<script>
import utils from "@/mixins/utils";
import dialog from "@/mixins/dialog";
import DatePicker from "../common/DataPicker.vue";

export default {
  mixins: [utils, dialog],
  components: {
    DatePicker,
  },
  props: {
    scoreCriterias: {
      type: Array,
      default: () => [],
    },
    dataUI: {
      type: Object,
      default: () => {
        scoreCriterias: [];
      },
    },
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      testBool: false,
      dialog: false,
      headers: [
        {
          text: "Status",
          align: "center",
          value: "Status",
          sortable: false,
        },
        {
          text: "Name",
          align: "center",
          value: "Progress_Name",
          sortable: false,
        },
        {
          text: "Due-date",
          align: "center",
          value: "DueDate_Start",
          sortable: false,
        },
        {
          text: "Advisor Score",
          align: "center",
          value: "Advisor_Score",
          sortable: false,
        },
        {
          text: "Committees Total",
          align: "center",
          value: "Committee_Score",
          sortable: false,
        },
        { text: "Toggle", value: "toggle", align: "center", sortable: false },
        { text: "Edit", value: "edit", align: "center", sortable: false },
      ],
      editedIndex: -1,
      editedItem: {},
      // Initial score on edit modal popup shows
      initialEditTotalScore: 0,
    };
  },
  mounted() {
    console.log("dataUI: ", this.dataUI);
    console.log("scoreCriterias: ", this.scoreCriterias);
  },
  methods: {
    testLog() {
      console.log(this.testBool);
    },
    formatDatePickerProp(date) {
      console.log(date);
      const newDate = new Date(date);
      console.log(newDate);
      return newDate;
    },
    formatDisplayDate(dates) {
      if (!dates || typeof dates !== "object" || dates?.length < 2)
        return "NaN";

      // Format dates to locale date string
      dates = dates.map((date) => {
        return this.formatLocaleDateString(date, {
          createDate: true,
          dateStyle: "medium",
          displayTime: false,
        });
      });

      // Concat string
      return `${dates[0]} - ${dates[1]}`;
    },
    /**
     * Transform date into timestamp and add up time to 11:59 (used for due date)
     * @param {string} date - Date timestamp as a string format (2022-03-13T00:00:00.000Z)
     * @returns timestamp with the time added up to 11:59
     */
    handleConvertDueDate(date) {
      const returnDate = new Date(date);
      returnDate.setMinutes(returnDate.getMinutes() + 1439);
      return returnDate.toISOString().slice(0, 19).replace("T", " ");
    },
    handleUpdateDate(date, newDate) {
      this.editedItem[date] = newDate;
    },
    async handleEditScoreCriteria() {
      console.log("this.editedItem: ", this.editedItem);
      const criteriaItem = this.editedItem;
      const startDate = this.handleConvertDueDate(criteriaItem.DueDate_Start);
      const endDate = this.handleConvertDueDate(criteriaItem.DueDate_End);

      // console.log("startDate: ", startDate);
      // return;

      try {
        // Check if there's score at all
        if (
          (!criteriaItem?.Advisor_Score && criteriaItem?.Advisor_Score !== 0) ||
          (!criteriaItem?.Committee_Score &&
            criteriaItem?.Committee_Score !== 0)
        ) {
          this.$swal.fire("Invalid score input", "", "warning");
          return;
        }

        // Calculate new score total
        const newScoreTotal =
          parseInt(criteriaItem.Advisor_Score) +
          parseInt(criteriaItem.Committee_Score);
        const isValid = this.$refs.form.validate();

        // Check if the form is valid and check if total goes higher than 100, if it dose return
        if (!isValid || newScoreTotal + this.initialEditTotalScore > 100) {
          this.$swal.fire(
            "There is an error, please check your score input",
            "",
            "warning"
          );
          return;
        }

        // Check if end date is less than begin date
        if (startDate > endDate) {
          this.$swal.fire("Invalid date input", "", "warning");
          return;
        }

        // POST API for updating score criteria
        const res = await this.$axios.$post("/criteria/scoreEdit", {
          ...criteriaItem,
          DueDate_Start: startDate,
          DueDate_End: endDate,
        });

        if (res.status !== 200)
          throw new Error("Score failed to update, please try again later");

        // Update total
        this.scoreCriterias[this.editedIndex].Total =
          parseInt(criteriaItem.Advisor_Score) +
          parseInt(criteriaItem.Committee_Score);

        // Show success popup
        this.$swal.fire(
          "Success",
          "Update score criterias successfully",
          "success"
        );

        // Refresh nuxt to re-fetch score criterias
        this.$emit("score-updated");
        // Close edit score criteria dialog
        this.dialog = false;
        return;
      } catch (err) {
        console.log(err);
        this.$swal.fire("Something went wrong", "", "warning");
        return;
      }
    },

    async handleToggleStatus(e, status) {
      const criteriaId = e.target.getAttribute("data-criteria-id");
      const projectOnTermId =
        this.$store.getters["auth/currentUser"].projectOnTerm;
      // If no criteria id or projectOnTermId, shows alert and return
      if (!criteriaId || !projectOnTermId) {
        this.$swal
          .fire("An error has occured", "", "warning")
          .then((res) => window.location.reload());
        return;
      }

      // Fetch api to toggle progress status
      const updateToggle = () => {
        return this.$axios.$post("/criteria/toggleScoreCriteriaStatus", {
          Status: status,
          Score_criteria_ID: criteriaId,
          Project_on_term_ID:
            this.$store.getters["auth/currentUser"].projectOnTerm,
        });
      };
      await this.showLoading(updateToggle);

      // Dispatch store available progressions too if this is the first progress (to unlock import student)
      await this.$store.dispatch("group/storeAvailableProgressions");
      return;
    },
    handleValidateScore(val) {
      return this.handleValidateTextField(
        {
          string: val,
          option: "onlyNumber",
          errorMsg: "Invalid score",
        },
        parseInt(val) > 100,
        parseInt(val) < 0
      );
    },

    editItem(item) {
      this.editedIndex = this.scoreCriterias.indexOf(item);

      // Set initial total score
      this.initialEditTotalScore = this.allScoresTotal - item.Total;

      // Set editedItem object (for submitting api)
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = {};
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.scoreCriterias[this.editedIndex], this.editedItem);
      } else {
        this.scoreCriterias.push(this.editedItem);
      }
      this.close();
    },
  },
  computed: {
    // TODO: It's working, probably...
    allScoresTotal() {
      const total = this.scoreCriterias.reduce(
        (prev, current) => prev + current.Total,
        0
      );
      return total;
    },
  },
};
</script>

<style>
.score-criteria-card {
  padding: 0.4rem 1.4rem 1rem;
}
.score-criteria-card .v-card__title {
  display: flex;
  padding: 1rem;
}
.score-criteria-card .v-card__title h4:first-child {
  flex: 1;
}

/* Score criteria content (table) */
.score-criteria-content p {
  margin: 0;
}
.score-criteria-content {
  display: grid;
  grid-template-columns: repeat(5, auto);
  overflow-x: auto;
  text-align: center;
  align-items: center;
  gap: 2rem 1rem;
}
@media only screen and (max-width: 600px) {
  .score-criteria-card .v-card__title {
    display: flex;
    padding: 0;
  }
  .score-criteria-card .v-card__title h4 {
    font-size: 18px;
  }
  .score-criteria-content {
    display: grid;
    grid-template-columns: repeat(5, auto);
    overflow-x: auto;
    margin-block-start: 1rem;
    text-align: center;
    align-items: center;
    gap: 0.8rem 0.5rem;
    font-size: 14px;
  }
  .score-criteria-content .v-btn__content {
    font-size: 12px;
  }
  .score-criteria-content .v-icon {
    font-size: 16px !important;
  }
}
.score-criteria-content > h4 {
  margin-block: 1rem;
}

/* Edit score card */
.score-criteria-dialog-card {
  padding: 1rem;
}
.score-criteria-input-flex {
  display: flex;
  flex-wrap: wrap;
  margin-inline: auto;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1.4rem;
}
.score-criteria-input-flex .v-subheader {
  padding: 0 !important;
}
.score-criteria-input-flex p {
  font-size: 20px;
  height: 40px;
  margin: 0;
}
.score-criteria-input-flex > div {
  width: 46%;
}

.table-header-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1px;
}
.table-header-icon > p {
  margin: 0;
}
.score-criteria-dialog-card hr {
  margin-block: 1rem;
}
.score-criteria-status-container > p {
  margin: 0;
}
</style>
