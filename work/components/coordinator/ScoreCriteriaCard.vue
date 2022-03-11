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
        sort-by="calories"
        hide-default-footer
      >
        <template v-slot:top>
          <v-dialog v-model="dialog" max-width="500px">
            <!-- Dialog edit score criteria card -->
            <v-card>
              <v-card-title>
                <span class="text-h5"
                  >Edit progress: {{ editedItem.Progress_Name }}</span
                >
              </v-card-title>

              <!-- Edit progress card modal -->
              <v-card-text>
                <v-container>
                  <!-- Edit card: progress name -->
                  <v-row>
                    <v-text-field
                      v-model="editedItem.Progress_Name"
                      dense
                      disabled
                      filled
                      hide-details
                    ></v-text-field>
                  </v-row>
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

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text> Cancel </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="handleEditScoreCriteria"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <!-- Currently active -->
        <template v-slot:item.Status="{ item }">
          <div class="score-criteria-status-container">
            <h4 v-if="item.Status" class="success--text">
              <v-icon small color="success darken-1">mdi-circle</v-icon> Active
            </h4>
            <h4 v-else class="error--text">
              <v-icon small color="error darken-1">mdi-circle</v-icon> Not
              Active
            </h4>
          </div>
        </template>
        <!-- Switch toggle -->
        <template v-slot:item.toggle="{ item }">
          <v-switch
            v-model="item.Status"
            @click="testLog"
            hide-details
            style="justify-content: center; margin: 0"
          />
        </template>
        <!-- Edit button -->
        <template v-slot:item.edit="{ item }">
          <v-btn color="primary" @click="editItem(item)"
            ><v-icon small> mdi-pencil </v-icon> Edit</v-btn
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
import DatePicker from "../common/DataPicker.vue";

export default {
  mixins: [utils],
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
    admin: {
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
        { text: "Name", align: "center", value: "Progress_Name" },
        { text: "Advisor Score", align: "center", value: "Advisor_Score" },
        { text: "Committees Total", align: "center", value: "Committee_Score" },
        { text: "Toggle", value: "toggle", align: "center", sortable: false },
        { text: "Edit", value: "edit", align: "center", sortable: false },
      ],
      editedIndex: -1,
      editedItem: {},
      // editScoreDialog: false,
      // editScoreRoles: [
      //   { id: 1, name: "Advisor Score", score: 0, value: "Advisor_Score" },
      //   {
      //     id: 2,
      //     name: "Committees Total Score",
      //     score: 0,
      //     value: "Committee_Score",
      //   },
      // ],
      // // Initial score on edit modal popup shows
      // initialEditTotalScore: 0,
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
    handleUpdateDate(date, newDate) {
      this.editedItem[date] = newDate;
    },
    async handleEditScoreCriteria() {
      console.log("this.editedItem: ", this.editedItem);
      const criteriaItem = this.editedItem;
      const startDate = new Date(criteriaItem.DueDate_Start);
      const endDate = new Date(criteriaItem.DueDate_End);
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
      } catch (err) {
        console.log(err);
        this.$swal.fire("Something went wrong", "", "warning");
        return;
      }
    },

    //     console.log("criteriaItem: ", criteriaItem);
    //     const res = await this.$axios.$post("/criteria/scoreEdit", {
    //       ...criteriaItem,
    //     });
    //     if (res.status !== 200)
    //       throw new Error("Score failed to update, please try again later");
    //     // Update total
    //     criteriaItem.Total =
    //       parseInt(criteriaItem.Advisor_Score) +
    //       parseInt(criteriaItem.Committee_Score);
    //     // Show success popup
    //     this.$swal.fire(
    //       "Success",
    //       "Update score criterias successfully",
    //       "success"
    //     );
    //     // Refresh nuxt to re-fetch score criterias
    //     this.$emit("score-updated");
    //     // Dispatch store available progressions too if this is the first progress (to unlock import student)
    //     if (this.$store.getters["group/availableProgress"]?.length === 0)
    //       await this.$store.dispatch("group/storeAvailableProgressions");
    //     criteriaItem.editDialog = false;
    //     return;
    //   } catch (err) {
    //     console.log(err);
    //     this.$swal.fire("Something went wrong", "", "warning");
    //     return;
    //   }
    // },
    // handleSetInitModalScore(criteria) {
    //   this.initialEditTotalScore = this.allScoresTotal - criteria.Total;
    //   // console.log(
    //   //   "Total score - this progress's total: ",
    //   //   this.initialEditTotalScore
    //   // );
    // },
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
.score-criteria-dialog-card hr {
  margin-block: 1rem;
}
.score-criteria-status-container > p {
  margin: 0;
}
</style>
