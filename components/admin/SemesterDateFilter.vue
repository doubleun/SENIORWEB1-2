<template>
  <v-row justify="end" align="center" class="mb-3">
    <v-col sm="4" md="2">
      <v-select
        :items="academicData"
        v-model="selectedAcademicData.year"
        item-value="Academic_Year"
        item-text="Academic_Year"
        label="Year"
        hide-details
        @change="handleEmitChangeFilter"
        background-color="white"
        filled
        light
      ></v-select>
    </v-col>
    <v-col sm="4" md="2">
      <v-select
        :items="academicData"
        v-model="selectedAcademicData.semester"
        item-value="Academic_Term"
        item-text="Academic_Term"
        label="Semester"
        hide-details
        @change="handleEmitChangeFilter"
        background-color="white"
        filled
        light
      ></v-select>
    </v-col>

    <!-- Add new semester button -->

    <!-- Add new semester dialog -->

    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-col sm="4" md="2">
          <v-btn color="primary" v-bind="attrs" v-on="on">
            Add semester</v-btn
          >
        </v-col>
      </template>

      <v-card>
        <v-card-title>
          <span class="text-h6 text-uppercase font-weight-bold">Create a New Semester</span>
        </v-card-title>

        <!-- Add new semester card modal -->
        <v-card-text style="padding: 0 24px 0 24px">
          <v-container>
            <!-- Add new semester: senior name select -->
            <v-row>
              <v-col cols="12">
                <v-select
                  label="Senior Name"
                  item-text="text"
                  item-value="senior"
                  :items="selectableSeniors"
                  v-model="addNewSemesterData.Senior"
                ></v-select>
              </v-col>
            </v-row>
            <!-- Add new semester: year and semester select -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  label="Year"
                  :items="selectableYears"
                  v-model="addNewSemesterData.Academic_Year"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  label="Semester"
                  :items="selectableSemesters"
                  v-model="addNewSemesterData.Academic_Term"
                ></v-select>
              </v-col>
            </v-row>
            <!-- Add new semester: start and end date pickers -->
            <v-row>
              <!-- TODO: Contunue here -->
              <v-col cols="12" sm="6">
                <DatePicker
                  dateLabel="Start date"
                  @update-date="
                    (newDate) => handleUpdateDate('startDate', newDate)
                  "
                />
              </v-col>
              <v-col cols="12" sm="6">
                <DatePicker
                  dateLabel="End date"
                  @update-date="
                    (newDate) => handleUpdateDate('endDate', newDate)
                  "
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions style="padding: 8px 16px 16px 16px">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> Cancel </v-btn>
          <v-btn color="primary" dark @click="handleAddNewSemester">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import DatePicker from '../common/DataPicker.vue'
import utils from '../../mixins/utils'
import dialog from '../../mixins/dialog'
export default {
  mixins: [utils, dialog],
  components: {
    DatePicker
  },
  data: () => ({
    academicData: [],
    selectedAcademicData: { year: 0, semester: 0 },
    dialog: false,
    selectableSeniors: [
      { senior: 1, text: 'Senior Project 1' },
      { senior: 2, text: 'Senior Project 2' }
    ],
    selectableSemesters: [1, 2, 3],
    // Selectable yars will be filled in on mounted
    selectableYears: [],
    // Year initial value of year will be set on mounted
    addNewSemesterData: {
      Academic_Year: 0,
      Academic_Term: 1,
      Senior: 1
    },
    addNewSemesterDates: {
      startDate: null,
      endDate: null
    }
  }),
  mounted() {
    this.academicData = this.$store.getters['auth/semesterData']
    // console.log(this.$store.getters["auth/currentUser"].semesterData);
    const currentYear = new Date().getFullYear()

    if (!!Array.isArray(this.academicData) && !!this.academicData.length > 0) {
      // Gets all existed years from state and fill the selectableYears array
      this.selectableYears = this.academicData.map((item) => item.Academic_Year)

      // Set inital date start and date end for add new semester data
      this.addNewSemesterDates.startDate = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substring(0, 10)
      this.addNewSemesterDates.endDate = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substring(0, 10)

      // Set initial selected year in the add new semester dialog
      this.addNewSemesterData.Academic_Year = currentYear

      // Set initial selected filters
      this.selectedAcademicData.year = this.academicData[0].Academic_Year
      this.selectedAcademicData.semester = this.academicData[0].Academic_Term
    }

    // Add current year to the selectableYears
    this.selectableYears = [currentYear, ...this.selectableYears]
  },
  methods: {
    renderSeniorInText(senior) {
      return `Senior project ${senior}`
    },
    handleEmitChangeFilter() {
      if (
        !!this.selectedAcademicData.year &&
        !!this.selectedAcademicData.semester
      ) {
        this.$emit('filter-date', this.selectedAcademicData)
      }
    },
    handleOpenDialog() {
      console.log(this.dialog)
      this.dialog = true
    },
    handleUpdateDate(date, newDate) {
      this.addNewSemesterDates[date] = newDate
    },
    async handleAddNewSemester() {
      try {
        console.log('this.addNewSemesterData', this.addNewSemesterData)
        // Check if the semester is already exits
        const existingSemesters = this.$store.getters['auth/semesterData']
        if (Array.isArray(existingSemesters) && existingSemesters.length > 0) {
          const isSemesterExists = existingSemesters.some((semester) =>
            this.isEqual(semester, this.addNewSemesterData)
          )
          if (isSemesterExists) {
            this.$swal.fire('This semester is already exists', '', 'info')
            return
          }
        }

        // Combine date and new semster data together
        const combinedData = {
          ...this.addNewSemesterData,
          ...this.addNewSemesterDates
        }

        // Convert to array
        const data = Object.values(combinedData)
        console.log('dataArr', data)

        // Check if one of the adding data object is null or undefined
        if (!data.every((item) => !!item))
          throw new Error('Submitting data is insufficient')

        // Fire API to add new semester date
        const apiCallback = () =>
          this.$axios.post('/date/semester/new', {
            data
          })
        await this.showLoading(apiCallback, {
          title: 'Adding new semester date'
        })

        // Update available semsters in state
        // TODO: This is dup with the admin.vue (layout) Create action to dispatch is better !
        const allSemesters = await this.$axios.get('/date/allYearsSemester')
        await this.$store.commit(
          'auth/SET_USER_SEMESTER_DATA',
          allSemesters.data
        )

        // update available filter
        this.academicData = this.$store.getters['auth/semesterData']

        this.dialog = false
        await this.$nuxt.refresh()
        return
      } catch (err) {
        console.log(err)
        return
      }
    }
  }
}
</script>

<style></style>
