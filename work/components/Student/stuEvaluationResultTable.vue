<template>
  <div>
    <v-card class="content justify-center mt-5">
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
      <v-data-table :headers="headers" :items="score" class="elevation-1">
        <template v-slot:item.progress1="{ item }">
          {{ item.progress1 == null ? 0 : item.progress1 }}
        </template>
        <template v-slot:item.progress2="{ item }">
          {{ item.progress2 == null ? 0 : item.progress2 }}
        </template>
        <template v-slot:item.progress3="{ item }">
          {{ item.progress3 == null ? 0 : item.progress3 }}
        </template>
        <template v-slot:item.progress4="{ item }">
          {{ item.progress4 == null ? 0 : item.progress4 }}
        </template>
        <template v-slot:item.FinalPresentation="{ item }">
          {{ item.FinalPresentation == null ? 0 : item.FinalPresentation }}
        </template>
        <template v-slot:item.FinalDocumentation="{ item }">
          {{ item.FinalDocumentation == null ? 0 : item.FinalDocumentation }}
        </template>

        <template v-slot:item.total="{ item }">
          {{
            (item.total =
              item.progress1 +
              item.progress2 +
              item.progress3 +
              item.progress4 +
              item.FinalPresentation +
              item.FinalDocumentation)
          }}
        </template>
      </v-data-table>
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
              <span v-for="comment in advisorComment">
                {{ comment.Comment }}
              </span>
            </v-col>
          </v-row>
          <v-row class="pl-5 mt-4 pr-4">
            <v-col cols="6" sm="6"><h4>FILES</h4> </v-col>
            <v-col cols="12" sm="6">
              <li v-for="comment in advisorComment">
                <a
                  :href="'/uploads/' + comment.File_Name"
                  class="text-decoration-none"
                  >{{ comment.File_Name }}</a
                >
              </li>
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
              <span v-for="comment in com2Comment">
                {{ comment.Comment }}
              </span>
            </v-col>
          </v-row>
          <v-row class="pl-5 mt-4 pr-4">
            <v-col cols="6" sm="6"><h4>FILES</h4> </v-col>
            <v-col cols="12" sm="6">
              <li v-for="comment in com2Comment">
                <a
                  :href="'/uploads/' + comment.File_Name"
                  class="text-decoration-none"
                  >{{ comment.File_Name }}</a
                >
              </li>
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
              <span v-for="comment in com1Comment">
                {{ comment.Comment }}
              </span>
            </v-col>
          </v-row>
          <v-row class="pl-5 mt-4 pr-4">
            <v-col cols="6" sm="6"><h4>FILES</h4> </v-col>
            <v-col cols="12" sm="6">
              <li v-for="comment in com1Comment">
                <a
                  :href="'/uploads/' + comment.File_Name"
                  class="text-decoration-none"
                  >{{ comment.File_Name }}</a
                >
              </li>
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
      loading: false,
      score: [],
      assigment: null,
      studentFile: [],
      advisorComment: [],
      com1Comment: [],
      com2Comment: [],
      headers: [
        {
          text: "Progress 1",
          value: "progress1"
        },
        { text: "Progress 2", value: "progress2" },
        { text: "Progress 3", value: "progress3" },
        { text: "Progress 4", value: "progress4" },
        { text: "Final Presentation", value: "FinalPresentation" },
        { text: "Final Documentation", value: "FinalDocumentation" },
        { text: "Total", value: "total" }
        // { text: "Grade", value: "grade" }
      ]
      // desserts: [
      //   {
      //     progress1: 8,
      //     progress2: 8,
      //     progress3: 8,
      //     progress4: 8,
      //     finalpresentation: 39,
      //     finaldocumentation: 15,
      //     total: 86,
      //     grade: "I"
      //   }
      // ]
    };
  },

  // FIXME: use real Group_ID
  async fetch() {
    console.log("Async Data ");

    try {
      const data = await this.$axios.$post("/group/socre", {
        Group_ID: 1
      });

      this.score.push(data[0]);

      this.assigment = await this.$axios.$post("/assignment", {
        Group_ID: 1,
        Progress_ID: 1,
        Project_on_term_ID: 1
      });

      console.log("all assigment", this.assigment);

      this.assigment.comments.forEach(element => {
        if (element.Group_Role == 0) {
          this.advisorComment.push(element);
        } else {
          if (this.com1Comment.length == 0) {
            this.com1Comment.push(element);
            return;
          } else {
            const indexArr = this.com1Comment.findIndex(
              el => el.Group_Member_ID === element.Group_Member_ID
            );

            if (indexArr != -1) {
              this.com2Comment.push(element);
              return;
            }
            this.com2Comment.push(element);
          }
        }
      });
      console.log("advisor comment", this.advisorComment);
      console.log("committee 1 comment  ", this.com1Comment);
      console.log("committee 2 comment  ", this.com2Comment);

      // console.log('data 0',data[0]);
      // console.log(this.score);
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {}
};
</script>
