<template>
  <div>
     <v-card
    class="content justify-center mt-5"
  
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3
            class="font-semibold text-lg"
            :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']"
          >
            Evaluation Result
          </h3>
        </div>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      class="elevation-1"
    ></v-data-table>
     </v-card>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card :loading="loading" class="mx-auto my-6 pb-5" max-width="570">
          <v-card-title>
            ADVISOR
            <v-spacer></v-spacer>
            RESULT: I
          </v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-row class="pl-5 mt-4 pr-4">
            <v-col cols="6" sm="6"> <h4>COMMENTS</h4> </v-col>
            <v-col cols="12" sm="6">
              This piece is very good but still missing a few things. Please
              pollen your face better.
            </v-col>
          </v-row>
          <v-row class="pl-5 mt-4 pr-4">
            <v-col cols="6" sm="6"><h4>FILES</h4> </v-col>
            <v-col cols="12" sm="6">
              <a href="#" class="text-decoration-none">Workprogress.pdf</a>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
        </v-card>
        <v-card :loading="loading" class="mx-auto pb-5" max-width="570">
          <v-card-title>
            COMMITTEE 2
            <v-spacer></v-spacer>
          </v-card-title>

          <v-divider class="mx-4"></v-divider>
          <v-row class="pl-5 mt-4 pr-4">
            <v-col cols="6" sm="6"> <h4>COMMENTS</h4> </v-col>
            <v-col cols="12" sm="6">
              This piece is very good but still missing a few things. Please
              pollen your face better.
            </v-col>
          </v-row>
          <v-row class="pl-5 mt-4 pr-4">
            <v-col cols="6" sm="6"><h4>FILES</h4> </v-col>
            <v-col cols="12" sm="6">
              <a href="#" class="text-decoration-none">Workprogress.pdf</a>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card :loading="loading" class="mx-auto my-6 pb-5" max-width="570">
          <v-card-title>
            COMMITTEE 1
            <v-spacer></v-spacer>
          </v-card-title>

          <v-divider class="mx-4"></v-divider>
          <v-row class="pl-5 mt-4 pr-4">
            <v-col cols="6" sm="6"> <h4>COMMENTS</h4> </v-col>
            <v-col cols="12" sm="6">
              This piece is very good but still missing a few things. Please
              pollen your face better.
            </v-col>
          </v-row>
          <v-row class="pl-5 mt-4 pr-4">
            <v-col cols="6" sm="6"><h4>FILES</h4> </v-col>
            <v-col cols="12" sm="6">
              <a href="#" class="text-decoration-none">Workprogress.pdf</a>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
        </v-card>
        <v-card
          :loading="loading"
          class="mx-auto pb-5"
          max-width="570"
          height="255"
        >
          <div class="text-center">
            <v-avatar color="#253B6E" size="130" class="mt-10">
              <span class="white--text text-h5">S</span>
            </v-avatar>
            <h2>SUMMARY</h2>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "Progress 1",
          value: "progress1",
        },
        { text: "Progress 2", value: "progress2" },
        { text: "Progress 3", value: "progress3" },
        { text: "Progress 4", value: "progress4" },
        { text: "Final Presentation", value: "finalpresentation" },
        { text: "Final Documentation", value: "finaldocumentation" },
        { text: "Total", value: "total" },
        { text: "Grade", value: "grade" },
      ],
      desserts: [
        {
          progress1: 8,
          progress2: 8,
          progress3: 8,
          progress4: 8,
          finalpresentation: 39,
          finaldocumentation: 15,
          total: 86,
          grade: "I",
        },
      ],
    };
  },
};
</script>
