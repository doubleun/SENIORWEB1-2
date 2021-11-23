<template>
<div>
  <!-- Final Presentation -->
      <div class="coordinator-edit-grade-criteria">
      <v-dialog v-model="dialog" persistent max-width="1000px" class=" mb-2 mt-1 mb-0 ">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="indigo" dark v-bind="attrs" v-on="on" class="btEdit">
            EDIT
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Final Presentation</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6" sm="6" md="6" lg="6">
                    <v-subheader>Topic</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Advisor</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Committee 1</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Committee 2</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>

                <!--Topic 2 -->
                <v-col cols="6" sm="6" md="6" lg="6">
                    <v-subheader>Topic</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Advisor</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Committee 1</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Committee 2</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <!-- Topic 3-->
                <v-col cols="6" sm="6" md="6" lg="6">
                    <v-subheader>Topic</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Advisor</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Committee 1</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Committee 2</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <!-- Topic 4 -->
                <v-col cols="6" sm="6" md="6" lg="6">
                    <v-subheader>Topic</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Advisor</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Committee 1</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Committee 2</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <!-- Topic 5 -->
                <v-col cols="6" sm="6" md="6" lg="6">
                    <v-subheader>Topic</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Advisor</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Committee 1</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2">
                    <v-subheader>Committee 2</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <!-- sum advisor and committee-->
                <v-col cols="6" sm="6" md="6" lg="6">
                    <v-subheader>Sum multiply Advisor</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="6" lg="6">
                    <v-subheader>Sum multiply Committee</v-subheader>
                  <v-text-field outlined dense hide-details required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      </div>
  <v-card class="progress-criteria-card">
    <v-card-title>
      <h4>Final Presentation</h4>
    </v-card-title>
     
    <!-- Grade criteria table -->
    <div class="progress-criteria-content">
      <!-- Table attr -->
      <h4 >TOPIC</h4>
      <h4 >ADVISOR</h4>
      <h4 >COMMITTEE1</h4>
      <h4 >COMMITTEE2</h4>

      <!-- Table records -->
      <template v-for="progress in progressCriteriaArr">
        <p :key="progress.progress + 1" align="left">{{ progress.progress }}</p>
        <p :key="progress.progress + 2" align="left">{{ progress.advisor }}</p>
        <p :key="progress.progress + 3" align="left">{{ progress.committee1 }}</p>
        <p :key="progress.progress + 4" align="left">{{ progress.committee2 }}</p>
      </template>
    </div>
  </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progressCriteriaArr: [
        {
          progress: "There is an evident advancement from Senior Project 1",
          advisor: 5,
          committee1: 5,
          committee2: 5
        },
        {
          progress: "The student present and answer questions properly",
          advisor: 5,
          committee1: 5,
          committee2: 5
        },
        {
          progress: "There are good teamwork and job division(for group project) or a student  plans his/her work properly (for individual project)",
          advisor: 5,
          committee1: 5,
          committee2: 5
        },
        {
          progress: "The student can research how to solve the problems and are able to student new or required technnologies and tools by themselves",
          advisor: 5,
          committee1: 5,
          committee2: 5
        },
        {
          progress: "The current progress reaches 40%",
          advisor: 5,
          committee1: 5,
          committee2: 5
        },
      ]
    };
  }
};
</script>

<style>
.progress-criteria-card {
  padding: 0.4rem 1.4rem 1rem;
}
.progress-criteria-card .v-card__title {
  display: flex;
  padding: 1rem;
}
.progress-criteria-card .v-card__title h4:first-child {
  flex: 1;
}

/* progress criteria content (table) */
.progress-criteria-content p {
  margin: 0;
}
.progress-criteria-content {
  display: grid;
  grid-template-columns: repeat(4, auto);
  overflow-x: auto;
  text-align: center;
  align-items: center;
  padding: 1rem 1rem 2rem;
  gap: 2rem 1rem;
}
.progress-criteria-search {
  max-width: 300px;
}

@media only screen and (max-width: 600px) {
  .progress-criteria-card .v-card__title {
    display: flex;
    padding: 0;
  }
  .progress-criteria-card > h4 {
    font-size: 18px;
    float: left;
  }
  .progress-criteria-content {
    display: grid;
    grid-template-columns: repeat(4, auto);
    overflow-x: auto;
    margin-block-start: 1rem;
    text-align: center;
    align-items: center;
    gap: 0.8rem 0.5rem;
    font-size: 14px;
  }
  .progress-criteria-content .v-btn__content {
    font-size: 12px;
  }
  .progress-criteria-search {
    max-width: 120px;
  }
}
</style>
