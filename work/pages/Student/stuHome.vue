<template>
  <div>
      <Appbar />
    <Sidebar />
    <h2 class="header-title mb-2 mt-5">Home</h2>
    <v-divider></v-divider>
    <v-card class="content mt-5">
      <v-alert color="indigo lighten-5">
        <h3 class="font-weight-bold">Your Progress</h3>
      </v-alert>
      <div class="stepper">
        <v-stepper alt-labels>
          <v-stepper-header>
            <v-stepper-step step="1"> Group </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="2"> Topic </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3"> Proposal </v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step step="4"> Progress 1 </v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step step="5"> Progress 2 </v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step step="6"> Progress 3 </v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step step="7"> Presentation </v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step step="8"> Documentation </v-stepper-step>
          </v-stepper-header>
        </v-stepper>
      </div>
      <div class="carousel mt-5">
        <v-alert color="indigo lighten-5">
        <h3 class="font-weight-bold">Announcement</h3>
      </v-alert>
        <v-carousel
          cycle
          height="450"
          hide-delimiter-background
          show-arrows-on-hover
        >
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-sheet :color="colors[i]" height="100%">
              <v-row class="fill-height" align="center" justify="center">
                <div class="text-h2">{{ slide }}</div>
              </v-row>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </div>
    </v-card>
  </div>
</template>
<script>
import Appbar from "@/components/Global/mainAppbar"
import Sidebar from '@/components/Student/stuSidebar'
export default {
    components:{
    Appbar,
    Sidebar
  },
  data() {
    return {
      colors: [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4",
      ],
      slides: [
        "Announcement 1",
        "Announcement 2",
        "Announcement 3",
        "Announcement 4",
        "Announcement 5",
      ],
    };
  },
};
</script>
<style scoped>
.content {
  padding: 20px;
}
</style>