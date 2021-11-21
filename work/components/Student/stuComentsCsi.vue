<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card :loading="loading" class="mx-auto my-6 pb-5" max-width="570">
        <v-card-title>
          ADVISOR
          <v-spacer></v-spacer>
          RESULT: 10/10
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
        <div class="csi-comments-content">
          <h4>TOPIC</h4>
          <h4>SCORE</h4>
          <template v-for="data in dummyData">
            <p :key="data.topic + 1">{{ data.comment }}</p>
            <p :key="data.topic + 2">{{ data.score }}</p>
          </template>
        </div>
      </v-card>
      <v-card :loading="loading" class="mx-auto pb-5" max-width="570">
        <v-card-title>
          COMMITTEE 2
          <v-spacer></v-spacer>
          RESULT: 10/10
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
        <div class="csi-comments-content">
          <h4>TOPIC</h4>
          <h4>SCORE</h4>
          <template v-for="data in dummyData">
            <p :key="data.topic + 1">{{ data.comment }}</p>
            <p :key="data.topic + 2">{{ data.score }}</p>
          </template>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card :loading="loading" class="mx-auto my-6 pb-5" max-width="570">
        <v-card-title>
          COMMITTEE 1
          <v-spacer></v-spacer>
          RESULT: 10/10
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
        <div class="csi-comments-content">
          <h4>TOPIC</h4>
          <h4>SCORE</h4>
          <template v-for="data in dummyData">
            <p :key="data.topic + 1">{{ data.comment }}</p>
            <p :key="data.topic + 2">{{ data.score }}</p>
          </template>
        </div>
      </v-card>
      <v-card :loading="loading" class="mx-auto pb-5 result-content">
        <div class="text-center">
          <v-avatar color="#253B6E" size="130" class="mt-10">
            <span class="white--text text-h5">17/20</span>
          </v-avatar>
          <h2>SUMMARY</h2>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      date: null,
      dummyData: [
        {
          id: 1,
          comment: "There is an evident advancement from Senior Project 1",
          score: 5,
        },
        {
          id: 2,
          comment: "The students present and answer questions properly",
          score: 5,
        },
        {
          id: 3,
          comment:
            "There are good teamwork and job division (for group project) or a student plans his/her work properly (for individual project)",
          score: 5,
        },
        {
          id: 4,
          comment:
            "The students can research how to solve the problems and are able to student new or required technologies and tools by themselves",
          score: 5,
        },
        {
          id: 5,
          comment: "The current progress reaches 40%",
          score: 5,
        },
      ],
    };
  },
};
</script>


<style>
.result-content {
  max-width: 570;
  height: 255;
}
.csi-comments-content p {
  margin: 0;
}
.csi-comments-content {
  display: grid;
  grid-template-columns: 1fr 160px;
  overflow-x: auto;
  margin-block-start: 1rem;
  text-align: center;
  gap: 2rem 1rem;
  padding-left: 20px;
}
@media only screen and (max-width: 600px) {
  .csi-comments-content {
    display: grid;
    overflow-x: auto;
    margin-block-start: 1rem;
    text-align: center;
    gap: 0.8rem 0.5rem;
    font-size: 14px;
  }
}
.csi-comments-content > h4 {
  margin-block: 1rem;
}
</style>

