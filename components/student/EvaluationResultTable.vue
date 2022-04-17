<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card :loading="loading" class="mx-auto my-6 pb-5" max-width="570">
          <v-card-title>
            ADVISOR

            <!-- Icon indicate if teacher submiited eval comment yet -->
            <v-icon right color="success" v-if="advisor">
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon right color="orange" v-else> mdi-clock-time-four </v-icon>
          </v-card-title>
          <v-row class="pl-7">
            <p>{{ advisor ? advisor.User_Name : "" }}</p>
          </v-row>

          <v-divider class="mx-4"></v-divider>
          <v-row class="pl-5 mt-4 pr-4">
            <v-col cols="6" sm="3"> <h4>COMMENT:</h4> </v-col>
            <v-col cols="12" sm="9">
              <span>{{ advisor ? advisor.Comment : "" }}</span>
            </v-col>
          </v-row>
          <!-- <v-row class="pl-5 mt-4 pr-4">
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
          </v-row> -->
          <v-spacer></v-spacer>
        </v-card>
        <v-card :loading="loading" class="mx-auto pb-5" max-width="570">
          <v-card-title>
            COMMITTEE

            <!-- Icon indicate if teacher submiited eval comment yet -->
            <v-icon right color="success" v-if="committee2">
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon right color="orange" v-else> mdi-clock-time-four </v-icon>
          </v-card-title>
          <v-row class="pl-7">
            <p>{{ committee2 ? committee2.User_Name : "" }}</p>
          </v-row>

          <v-divider class="mx-4"></v-divider>
          <v-row class="pl-5 mt-4 pr-4">
            <v-col cols="6" sm="3"> <h4>COMMENT:</h4> </v-col>
            <v-col cols="12" sm="9">
              <span>
                {{ committee2 ? committee2.Comment : "" }}
              </span>
            </v-col>
          </v-row>
          <!-- <v-row class="pl-5 mt-4 pr-4">
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
          </v-row> -->
          <v-spacer></v-spacer>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card :loading="loading" class="mx-auto my-6 pb-5" max-width="570">
          <v-card-title>
            COMMITTEE

            <!-- Icon indicate if teacher submiited eval comment yet -->
            <v-icon right color="success" v-if="committee1">
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon right color="orange" v-else> mdi-clock-time-four </v-icon>
          </v-card-title>
          <v-row class="pl-7">
            <p>{{ committee1 ? committee1.User_Name : "" }}</p>
          </v-row>

          <v-divider class="mx-4"></v-divider>
          <v-row class="pl-5 mt-4 pr-4">
            <v-col cols="6" sm="3"> <h4>COMMENT:</h4> </v-col>
            <v-col cols="12" sm="9">
              <span>
                {{ committee1 ? committee1.Comment : "" }}
              </span>
            </v-col>
          </v-row>
          <!-- <v-row class="pl-5 mt-4 pr-4">
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
          </v-row> -->
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
              <span class="white--text text-h5">{{ totalScore }} / 100</span>
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
  props: {
    totalScore: Number,
    evalComments: Array,
  },
  data() {
    return {
      loading: false,
      score: [],
      assigment: null,
      studentFile: [],
      advisor: {},
      committee1: {},
      committee2: {},
    };
  },
  mounted() {
    // Assign advisor
    this.advisor = this.evalComments.filter(
      (teacher) => teacher?.Group_Role === 0
    )[0];
    // Create comittees array
    const tempCommitteesArr = this.evalComments.filter(
      (teacher) => teacher?.Group_Role === 1
    );
    // Assign committee 1 and 2
    this.committee1 = tempCommitteesArr[0];
    this.committee2 = tempCommitteesArr[1];

    console.log(this.committee1, this.committee2);
  },

  // FIXME: use real Group_ID
  // async fetch() {
  // console.log("Async Data ");
  // try {
  //   const data = await this.$axios.$post("/group/socre", {
  //     Group_ID: this.$store.state.group.currentUserGroup.Group_ID
  //   });
  //   this.score.push(data[0]);
  //   this.assigment = await this.$axios.$post("/assignment", {
  //     Group_ID: this.$store.state.group.currentUserGroup.Group_ID,
  //     Progress_ID: 1,
  //     Project_on_term_ID: 1
  //   });
  //   console.log("all assigment", this.assigment);
  //   this.assigment.comments.forEach(element => {
  //     if (element.Group_Role == 0) {
  //       this.advisorComment.push(element);
  //     } else {
  //       if (this.com1Comment.length == 0) {
  //         this.com1Comment.push(element);
  //         return;
  //       } else {
  //         const indexArr = this.com1Comment.findIndex(
  //           el => el.Group_Member_ID === element.Group_Member_ID
  //         );
  //         if (indexArr != -1) {
  //           this.com2Comment.push(element);
  //           return;
  //         }
  //         this.com2Comment.push(element);
  //       }
  //     }
  //   });
  //   console.log("advisor comment", this.advisorComment);
  //   console.log("committee 1 comment  ", this.com1Comment);
  //   console.log("committee 2 comment  ", this.com2Comment);
  //   // console.log('data 0',data[0]);
  //   // console.log(this.score);
  // } catch (error) {
  //   console.log(error);
  // }
  // },
};
</script>
