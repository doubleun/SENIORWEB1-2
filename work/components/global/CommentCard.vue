<template>
  <!-- Advisor comment -->
  <div v-if="teachers.length !== 0">
    <v-card
      class="mx-auto my-6 pb-5"
      v-for="teacher in teachers"
      :key="teacher.Group_Member_ID"
    >
      <v-card-title>
        <div class="d-flex" style="gap: 6rem">
          <span>{{
            teacher.Group_Role === 0 ? "ADVISOR:" : "COMMITTEE:"
          }}</span>

          <!-- Advisor score -->
          <span v-if="progressId !== 2"
            >Score: {{ teacher.Score }} / {{ teacher.Max_Score }}</span
          >
          <!-- <v-spacer></v-spacer>
            RESULT: I -->
        </div>
      </v-card-title>
      <v-row class="pl-7">
        <p>{{ teacher.User_Name }}</p>
      </v-row>
      <v-divider class="mx-4"></v-divider>
      <v-row class="pl-5 mt-4 pr-4">
        <v-col cols="6" sm="2"> <h4>COMMENT:</h4> </v-col>
        <v-col cols="12" sm="10">
          <span>
            {{ teacher.Comment }}
          </span>
        </v-col>
      </v-row>
      <v-row class="pl-5 mt-4 pr-4" v-if="teacher.files">
        <v-col cols="6" sm="2"><h4>FILES</h4> </v-col>
        <v-col cols="12" sm="10">
          <li>
            <a
              :href="
                '/api/public_senior/uploads/assignments/' +
                teacher.files[0].File_Name
              "
              target="_blank"
              class="text-decoration-none"
              >{{ teacher.files[0].File_Name }}</a
            >
          </li>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    teachers: [],
  }),
  props: {
    advisor: {
      type: Object,
      default: () => null,
    },
    committees: {
      type: Array,
      default: () => [],
    },
    progressId: {
      type: Number,
      default: () => 2,
    },
  },
  mounted() {
    if (this.advisor) {
      this.teachers = [this.advisor, ...this.committees];
    } else {
      this.teachers = this.committees;
    }
    console.log("All Teachers: ", this.teachers);
  },
};
</script>

<style></style>
