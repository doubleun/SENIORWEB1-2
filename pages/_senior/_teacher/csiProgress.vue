<template>
  <section>
    <main class="coordinator-progress-main">
      <v-row>
        <v-col v-if="submitted === false" cols="12" sm="12" md="12" lg="12">
          <h1 class="white--text">
            Progress 1 (My Advisee)
            <v-alert dense type="warning" class="approval">
              Pending approval
            </v-alert>
          </h1>
        </v-col>
        <v-col v-if="submitted === true" cols="12" sm="12" md="12" lg="12">
          <h1 class="white--text">
            Progress 1 (My Advisee)
            <v-alert dense type="success" class="approval">
              Work has been approved
            </v-alert>
          </h1>
        </v-col>
      </v-row>
      <br />

      <!-- Card (Evaluation result) -->
      <GlobalProjectDetailCard />

      <v-dialog v-model="dialog" persistent max-width="600">
        <!-- submit button -->
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="indigo"
            dark
            v-bind="attrs"
            v-on="on"
            class=" mt-15 btsubmit"
          >
            SUBMIT
          </v-btn>
        </template>
        <!--announce action-->
        <v-card>
          <v-card-title class="text-h5 justify-center">
            Announce
          </v-card-title>
          <center>
            <v-card-text>
              <v-icon large color="blue">mdi-exclamation-thick</v-icon>
              <h3>Are you sure,submit score Progress 1 in</h3>
              <h3>
                "MOBILE APPLICATION FOR KAREN TRANSLATOR FOR PHYSIOTHERAPY"
              </h3>
              <h3>in summary score 20?</h3>
            </v-card-text>
          </center>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="indigo" text @click="dialog = false">
              Cancle
            </v-btn>
            <v-btn color="indigo" text @click="(dialog = false), changest()">
              SUBMIT
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <br /><br />

      <!-- Display work -->
      <GlobalDisplayWorkSection />
    </main>
  </section>
</template>

<script>
// import ProjectDetailCard from "@/components/global/projectDetailCard";
// import DisplayWorkSection from "@/components/global/csiDisplayworksection";

export default {
  data() {
    return {
      dialog: false,
      submitted: false
    };
  },
  methods: {
    changest() {
      this.submitted = true;
    }
  },
  layout: "coordinator"
};
</script>

<style>
.coordinator-progress-main {
  margin-block-end: 2rem;
}
.coordinator-progress-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
/*submit button*/
.btsubmit {
  float: right;
}
/*submit button*/
.approval {
  float: right;
}
</style>
