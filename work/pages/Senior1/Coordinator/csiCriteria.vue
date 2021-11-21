<template>
  <section>
    <main class="coordinator-criteria-main">
      <h1>Criteria</h1>
      <!-- Progress 1 -->
      <div class="coordinator-edit-grade-criteria">
      <v-dialog v-model="dialog" persistent max-width="1000px" class=" mb-2 mt-1 mb-0 ">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="indigo" dark v-bind="attrs" v-on="on" class="btEdit">
            EDIT
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Progress 1</span>
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
     
      <ProgressCriteriaArr class="coordinator-criteria-grade-card" />
    
      <!-- Progress 2 -->
      <div class="coordinator-edit-grade-criteria">
      <v-dialog v-model="dialog" persistent max-width="1000px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="indigo" dark v-bind="attrs" v-on="on" class="btEdit">
            EDIT
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Progress 2</span>
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
      
      <Progress2CriteriaArr class="coordinator-criteria-grade-card" />
    
      <!-- Final Presentation -->
      <div class="coordinator-edit-grade-criteria">
      <v-dialog v-model="dialog" persistent max-width="1000px">
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
      <FinalpresentCriteriaArr class="coordinator-criteria-grade-card" />
    

      <!-- Final Document -->
      <div class="coordinator-edit-grade-criteria">
      <v-dialog v-model="dialog" persistent max-width="1000px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="indigo" dark v-bind="attrs" v-on="on" class="btEdit">
            EDIT
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Final Document</span>
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
      <FinaldocumentCriteriaArr class="coordinator-criteria-grade-card" />
    </main>
  </section>
</template>

<script>
import ProgressCriteriaArr from "@/components/Coordinator/csiDatatableprogress1";
import Progress2CriteriaArr from "@/components/Coordinator/csiDatatableprogress2";
import FinalpresentCriteriaArr from "@/components/Coordinator/csiDatatablefinalpresentation";
import FinaldocumentCriteriaArr from "@/components/Coordinator/csiDatatablefinaldocument";

export default {
  layout: "coordinatorsidebar",
  components: {
    ProgressCriteriaArr,
    Progress2CriteriaArr,
    FinalpresentCriteriaArr,
    FinaldocumentCriteriaArr
  },
  data() {
    return {
      dialog: false
    };
  }
};
</script>

<style>
.coordinator-criteria-main {
  margin-block-end: 2rem;
}
.coordinator-criteria-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.coordinator-criteria-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}

.coordinator-edit-grade-criteria {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-block: 2rem;
}
.coordinator-edit-grade-criteria > button {
  /* width: 9rem; */
}

/* Edit grade card */
.grade-criteria-dialog-card {
  padding: 1rem;
}
.grade-criteria-input-flex {
  display: flex;
  width: 80%;
  margin-inline: auto;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1.4rem;
}
.grade-criteria-input-flex .v-subheader {
  padding: 0 !important;
}
.grade-criteria-input-flex p {
  font-size: 20px;
  height: 40px;
  margin: 0;
}
.grade-criteria-dialog-card hr {
  margin-block: 1rem;
}

/* edit button*/
.btEdit {
  float: right;
}
</style>
