<template>
  <v-card>
    <v-card-title>
      <h3>Student Score</h3>
      <v-spacer></v-spacer>
      <v-row class="d-flex justify-end">
        <v-col md="2" class="d-flex justify-end">
          <v-dialog v-model="dialogFilter" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mt-5 mr-2"
                small
                color="primary"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon> mdi-filter-variant-plus </v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title> Filter </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col md="3">
                    <p>Year</p>
                  </v-col>

                  <v-col md="9">
                    <v-select
                      v-model="selectedYear"
                      :items="
                        !!yearNSemsters
                          ? yearNSemsters.map((itm) => itm.Academic_Year)
                          : []
                      "
                      dense
                      solo
                      hide-details
                      class="teb mb-1 mt-1 ma-2 mb-1"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="3">
                    <p>Semester</p>
                  </v-col>

                  <v-col md="9">
                    <v-select
                      v-model="selectedSemester"
                      :items="
                        !!yearNSemsters
                          ? yearNSemsters.map((itm) => itm.Academic_Term)
                          : []
                      "
                      dense
                      solo
                      hide-details
                      class="teb mb-1 mt-1 ma-2 mb-1"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="3">
                    <p>Senior</p>
                  </v-col>

                  <v-col md="9">
                    <v-select
                      v-model="selectedSenior"
                      :items="senior"
                      dense
                      solo
                      hide-details
                      class="teb mb-1 mt-1 ma-2 mb-1"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="3">
                    <p>Grade</p>
                  </v-col>

                  <v-col md="9">
                    <v-select
                      v-model="selectedGrade"
                      :items="gradeCriteria"
                      item-text="Grade_Criteria_Name"
                      item-value="Grade_Criteria_Name"
                      return-object
                      label="Grade"
                      dense
                      solo
                      hide-details
                      class="teb mb-1 mt-1 ma-2 mb-1"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogFilter = false">
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="handelChangeRenderScore"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col md="6">
          <v-text-field
            v-model="search"
            clearable
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :search="search">
      <template v-slot:item.Proposal="{ item }">
        {{ !item.Proposal && item.Proposal !== 0 ? 'NaN' : item.Proposal }}
      </template>

      <template v-slot:item.Progress1="{ item }">
        {{ !item.Progress1 && item.Progress1 !== 0 ? 'NaN' : item.Progress1 }}
      </template>

      <template v-slot:item.Progress2="{ item }">
        {{ !item.Progress2 && item.Progress2 !== 0 ? 'NaN' : item.Progress2 }}
      </template>

      <template v-slot:item.Progress3="{ item }">
        {{ !item.Progress3 && item.Progress3 !== 0 ? 'NaN' : item.Progress3 }}
      </template>

      <template v-slot:item.Progress4="{ item }">
        {{ !item.Progress4 && item.Progress4 !== 0 ? 'NaN' : item.Progress4 }}
      </template>

      <template v-slot:item.FinalPresentation="{ item }">
        {{
          !item.FinalPresentation && item.FinalPresentation !== 0
            ? 'NaN'
            : item.FinalPresentation
        }}
      </template>

      <template v-slot:item.FinalDocumentation="{ item }">
        {{
          !item.FinalDocumentation && item.FinalDocumentation !== 0
            ? 'NaN'
            : item.FinalDocumentation
        }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import utils from '@/mixins/utils'

export default {
  mixins: [utils],
  props: {
    items: Array,
    headers: Array,
    gradeCriteria: Array,
    yearNSemsters: Array
  },
  data() {
    return {
      search: '',
      dialogFilter: false,
      selectedYear: null,
      selectedSemester: null,
      selectedGrade: {},
      senior: [1, 2],
      selectedSenior: 1
    }
  },
  mounted() {
    this.selectedYear = this.$store.getters['auth/currentUser'].academicYear
    this.selectedSemester = this.$store.getters['auth/currentUser'].semester
    this.selectedSenior = this.$store.getters['auth/currentUser'].senior
    this.selectedGrade = this.gradeCriteria[0]

    this.handelChangeRenderScore()
  },
  methods: {
    handleValidateScore(val) {
      return this.handleValidateTextField({
        string: val,
        option: 'onlyNormalCharEng',
        errorMsg: 'Invalid search',
        required: false
      })
    },
    handelChangeRenderScore() {
      console.log('year', this.selectedYear)
      console.log('sem', this.selectedSemester)
      console.log('senior', this.selectedSenior)
      console.log('selectedGrade', this.selectedGrade)
      this.$emit(
        'on-filter-score',
        this.selectedYear,
        this.selectedSemester,
        this.selectedSenior,
        this.selectedGrade.Grade_Criteria_Name
      )
      this.dialogFilter = false
    }
  }
}
</script>

<style scoped>
.v-data-table {
}
</style>
