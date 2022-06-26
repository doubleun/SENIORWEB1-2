<template>
  <v-card class="grade-criteria-card">
    <v-card-title>
      <h4>Grade Criteria</h4>
    </v-card-title>

    <!-- Grade criteria table -->
    <!-- If there are grade criterias, show them  -->
    <div class="grade-criteria-content" v-if="!noGradeCriterias">
      <!-- Table attr -->
      <h4>GRADE</h4>
      <h4>PASS</h4>
      <!-- <h4>HIGH</h4> -->
      <!-- <h4>TOTAL</h4> -->

      <!-- Table records -->
      <template v-for="(grade, index) in dataUI.gradeCriterias">
        <p :key="grade.Grade_Criteria_Name + 1">
          {{ grade.Grade_Criteria_Name }}
        </p>
        <p :key="grade.Grade_Criteria_Name + 2">
          {{
            index === gradeCriterias.length - 1
              ? '0 - ' +
                (dataUI.gradeCriterias[dataUI.gradeCriterias.length - 2]
                  .Grade_Criteria_Pass -
                  1)
              : grade.Grade_Criteria_Pass
          }}
        </p>
      </template>
    </div>

    <!-- Else, show add grade criterias dialog -->
    <div class="d-flex justify-center pb-5" v-else>
      <v-dialog v-model="addGradeDialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary darken-2" v-on="on" v-bind="attrs"
            >Add grade criterias</v-btn
          >
        </template>

        <!-- Add new grade criterias pop up card -->
        <v-card class="grade-criteria-dialog-card">
          <v-card-title class="text-h5"> Add grade criterias </v-card-title>

          <!-- Select grade criterias template -->
          <div class="d-flex mx-auto" style="width: 80%">
            <v-select
              :items="options"
              v-model="selectedGradeOption"
              label="Select criteria template"
              hide-details
              dense
              outlined
            ></v-select>
          </div>

          <!-- Display grade and pass score section -->
          <section class="d-flex flex-column" style="gap: 0.6rem">
            <v-form ref="form" v-model="valid">
              <div
                class="grade-criteria-input-flex"
                v-for="(grade, index) in criteriasTemplate"
                :key="index"
              >
                <div style="width: 12%">
                  <v-subheader v-if="index === 0">Grade</v-subheader>
                  <p>{{ grade.Grade_Criteria_Name }}</p>
                </div>
                <div style="width: 60%">
                  <v-subheader v-if="index === 0">Pass Score</v-subheader>
                  <p v-if="index === criteriasTemplate.length - 1"></p>
                  <v-text-field
                    v-model="grade.Grade_Criteria_Pass"
                    :rules="[
                      !!grade.Grade_Criteria_Pass || 'This field is required',
                      (val) => handleCheckValidScore(val)
                    ]"
                    v-else
                    outlined
                    dense
                    hide-details
                  ></v-text-field>
                </div>
              </div>
            </v-form>
          </section>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="addGradeDialog = false">
              Cancel
            </v-btn>
            <v-btn color="primary" @click="handleAddGradeCriterias">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
import utils from '@/mixins/utils'

export default {
  mixins: [utils],
  props: {
    dataUI: {
      type: Object,
      default: { gradeCriterias: [] }
    },
    gradeCriterias: {
      type: Array,
      default: []
    },
    noGradeCriteriasProp: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    // Available option, used only for showing user in v-select
    options: ['S/U', 'A-F'],
    // Keep track of selected option, default is options[0]
    selectedGradeOption: 'S/U',
    // Grade criteria option A and B
    criteriasOptionA: ['S', 'U'],
    criteriasOptionB: ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'],
    addGradeDialog: false,
    noGradeCriterias: false,
    valid: true
  }),
  computed: {
    // Return criterias option (S/U or A-F) based on the 'selectedGradeOption'
    criteriasTemplate() {
      if (this.selectedGradeOption === this.options[0]) {
        return this.criteriasOptionA
      } else {
        return this.criteriasOptionB
      }
    }
  },
  mounted() {
    // ! This could be improve by using array of objects ([optionA, optionB]) and loop through when adding the template to each option object
    // Avoid overriding the prop value Vue suggest using data and assign prop value to the data instead
    // 'noGradeCriterias' is used for checking if coordinator has set the criteria yet
    this.noGradeCriterias = this.noGradeCriteriasProp

    // Set criteria option to the object template that we can use to send to database
    // Criterias option A which are S and U
    this.criteriasOptionA = this.criteriasOptionA.map((criteria) => ({
      Grade_Criteria_Name: criteria,
      Grade_Criteria_Pass: 0,
      Major_ID: this.$store.state.auth.currentUser.major,
    }))

    // Criterias option B which are A to F
    this.criteriasOptionB = this.criteriasOptionB.map((criteria) => ({
      Grade_Criteria_Name: criteria,
      Grade_Criteria_Pass: 0,
      Major_ID: this.$store.state.auth.currentUser.major,
    }))
  },
  methods: {
    // Handle adding grade criterias to the database
    async handleAddGradeCriterias() {
      // Check if there's a criterias template to send, and if the grade criterias have already been fetched
      // Validate form
      this.$refs.form.validate()
      console.log('Valid form: ', this.valid)
      if (
        !this.criteriasTemplate ||
        this.noGradeCriterias === false ||
        !this.valid
      )
        return

      try {
        this.$swal
          .fire({
            title: 'Please, confirm your choice.',
            text: 'You cannot change grade criterias template after save',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm'
          })
          .then(async (result) => {
            try {
              if (result.isConfirmed) {
                // Post new grade criterias
                const addGradeCriteriaRes = await this.$axios.$post(
                  '/criteria/gradeAdd',
                  {
                    data: this.criteriasTemplate
                  }
                )
                if (addGradeCriteriaRes.status !== 200)
                  throw new Error(
                    'Failed to add grade criterias, please try again later'
                  )
                // Update UI
                // Emit event for refresh and update UI
                this.$emit('add-grade-criterias')
                this.noGradeCriterias = false
                this.$swal.fire(
                  'Grade criterias saved',
                  'You can edit the score of each grade criteria',
                  'success'
                )
                return
              }
              return
            } catch (err) {
              console.log(err)
              return
            }
          })
        return
      } catch (err) {
        console.log(err)
        return
      }
    },
    handleCheckValidScore(val) {
      return this.handleValidateTextField(
        {
          string: val,
          option: 'onlyNumberFloat',
          errorMsg: 'Invalid score'
        },
        parseFloat(val) > 100,
        parseFloat(val) < 1,
        val?.length > 4
      )
    }
  }
}
</script>

<style>
.grade-criteria-card {
  padding: 0.4rem 1.4rem 1rem;
}
.grade-criteria-card .v-card__title {
  display: flex;
  padding: 1rem;
}
.grade-criteria-card .v-card__title h4:first-child {
  flex: 1;
}

/* Grade criteria content (table) */
.grade-criteria-content p {
  margin: 0;
}
.grade-criteria-content {
  display: grid;
  grid-template-columns: repeat(2, auto);
  overflow-x: auto;
  text-align: center;
  align-items: center;
  padding: 1rem 1rem 2rem;
  gap: 2rem 1rem;
}
.grade-criteria-search {
  max-width: 300px;
}

@media only screen and (max-width: 600px) {
  .grade-criteria-card .v-card__title {
    display: flex;
    padding: 0;
  }
  .grade-criteria-card .v-card__title h4 {
    font-size: 18px;
  }
  .grade-criteria-content {
    display: grid;
    grid-template-columns: repeat(2, auto);
    overflow-x: auto;
    margin-block-start: 1rem;
    text-align: center;
    align-items: center;
    gap: 0.8rem 0.5rem;
    font-size: 14px;
  }
  .grade-criteria-content .v-btn__content {
    font-size: 12px;
  }
  .grade-criteria-search {
    max-width: 120px;
  }
}
</style>
