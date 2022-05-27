<template>
  <div>
    <v-dialog v-model="dialogFilter" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="mt-5 mr-2" small color="primary" v-bind="attrs" v-on="on">
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
              />
            </v-col>
          </v-row>
          <v-row v-if="roles">
            <v-col md="3">
              <p>Role</p>
            </v-col>
            <v-col md="9">
              <v-select
                v-model="selectedRole"
                :items="roles"
                item-text="Role_Name"
                item-value="Role_ID"
                return-object
                dense
                solo
                hide-details
              />
            </v-col>
          </v-row>
          <v-row>
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
          <v-row>
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
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogFilter = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="handelchangeRender">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    coutnGroup: Array,
    majors: Array,
    yearNSemsters: Array,
    roles: Array,
  },
  data() {
    return {
      dialogFilter: false,
      selectedMajor: {},
      selectedYear: null,
      selectedSemester: null,
      selectedRole: null,
    };
  },

  mounted() {
    this.majors ? (this.selectedMajor = this.majors[0]) : null;
    this.selectedYear = this.yearNSemsters[0].Academic_Year;
    this.selectedSemester = this.yearNSemsters[0].Academic_Term;
    this.roles ? (this.selectedRole = this.roles[0]) : null;
  },

  methods: {
    handelchangeRender() {
      this.$emit(
        "on-filtering",
        this.selectedYear,
        this.selectedSemester,
        this.majors ? this.selectedMajor.Major_ID : null,
        this.roles ? this.selectedRole : null
      );
      this.dialogFilter = false;
    },
  },
};
</script>
