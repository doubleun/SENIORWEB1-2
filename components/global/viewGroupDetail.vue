<template>
  <div>
    <v-card>
      <v-card-title>
        <h3>{{ title }}</h3>
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

              <!-- Action buttons -->
              <v-card>
                <v-card-title> Filter </v-card-title>
                <v-card-text>
                  <v-row v-if="majors">
                    <v-col md="3">
                      <p>Major</p>
                    </v-col>
                    <v-col md="9">
                      <v-select
                        v-model="selectedMajor"
                        :items="majors"
                        item-text="Major_Name"
                        item-value="Major_ID"
                        return-object
                        dense
                        solo
                        hide-details
                        off
                        @change="onChange"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="!isAdmin">
                    <v-col md="3">
                      <p>Year</p>
                    </v-col>
                    <v-col md="9">
                      <v-select
                        v-model="selectedYear"
                        :items="yearNSemsters.map((itm) => itm.Academic_Year)"
                        dense
                        solo
                        hide-details
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="!isAdmin">
                    <v-col md="3">
                      <p>Semester</p>
                    </v-col>
                    <v-col md="9">
                      <v-select
                        v-model="selectedSemester"
                        :items="yearNSemsters.map((itm) => itm.Academic_Term)"
                        dense
                        solo
                        hide-details
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="!isAdmin && documents">
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
                      />
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="dialogFilter = false"
                  >
                    Close
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="handleChangeRenderGroups"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col md="6"
            ><v-text-field
              v-model="searchGroup"
              clearable
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field
          ></v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="allGroups"
        item-key="Group_ID"
        :search="searchGroup"
      >
        <template v-slot:item.Group_Name_Eng="props">
          <v-row class="pa-2 justify-space-around" no-gutters>
            <div style="cursor: pointer">
              {{ props.item.Group_Name_Eng }}
            </div>
          </v-row>
        </template>

        <template v-slot:top>
          <v-dialog v-model="viewDocDialog" persistent max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h5">Final Documents</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <!-- <div > -->
                  <v-row
                    v-for="(files, index) in finalDoc"
                    :key="index"
                    class="my-3"
                  >
                    <v-col md="2" sm="2">
                      <v-icon
                        @click="download(files)"
                        x-large
                        color="blue darken-2"
                      >
                        mdi-file
                      </v-icon>
                    </v-col>
                    <v-col md="9" sm="10" class="text-left">
                      {{ files.fileName }}
                    </v-col>
                  </v-row>
                  <!-- </div> -->
                </v-container>
                <!-- <small>*indicates required field</small> -->
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="viewDocDialog = false"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <template v-slot:item.action="{ item }">
          <v-btn color="primary" dark @click="showDoc(item)">
            View document
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    majors: Array,
    yearNSemsters: Array,
    allGroups: Array,
    isAdmin: Boolean,
    manageTeacher: Boolean,
    documents: Array,
    title: String
  },
  data() {
    return {
      selectedYear: null,
      selectedSemester: null,
      dialogFilter: false,
      selectedMajor: {},
      searchGroup: '',
      viewDocDialog: false,
      finalDoc: [],
      senior: [1, 2, 3],
      selectedSenior: 1,
      headers: [
        {
          text: 'GROUP NAME',
          align: 'center',
          sortable: false,
          value: 'Group_Name_Eng'
        },
        { text: 'MEMBER', align: 'center', value: 'Students' },
        { text: 'MAJOR', align: 'center', value: 'Major_Name' },
        { text: 'ADVISOR', align: 'center', value: 'Advisor' },
        { text: 'COMMITTEE', align: 'center', value: 'Committee' }
      ]
    }
  },
  mounted() {
    if (this.documents) {
      this.headers.push({ text: 'ACTION', align: 'center', value: 'action' })
      this.majors.unshift({ Major_ID: 0, Major_Name: 'All' })
    }

    this.selectedMajor = this.documents 
      ? this.majors[0]
      : this.$store.state.auth.currentUser.major
    this.selectedYear = this.yearNSemsters[0].Academic_Year
    this.selectedSemester = this.yearNSemsters[0].Academic_Term

    this.handleChangeRenderGroups()
  },
  methods: {
    onChange(event) {
      console.log(event)
    },
    handleChangeRenderGroups() {
      this.$emit(
        'on-filtering',
        this.isAdmin
          ? this.$store.getters['auth/currentUser'].academicYear
          : this.selectedYear,
        this.isAdmin
          ? this.$store.getters['auth/currentUser'].semester
          : this.selectedSemester,
        this.isAdmin || this.documents
          ? this.selectedMajor.Major_ID
          : this.$store.state.auth.currentUser.major,
        this.isAdmin
          ? this.$store.getters['auth/currentUser'].senior
          : this.selectedSenior
      )
      this.dialogFilter = false
    },
    showDoc(item) {
      this.finalDoc = this.documents.filter(
        (el) => el.Group_ID == item.Group_ID
      )
      this.viewDocDialog = true
    },

    download(item) {
      if (item.type === 'Link') {
        window.open(item['path'])
      }
      window.open('/api/' + item['path'])
    }
  }
}
</script>
