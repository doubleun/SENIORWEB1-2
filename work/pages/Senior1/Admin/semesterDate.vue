<template>
  <section>
    <main>
      <div class="admin-semester-date-main">
        <h1>Semester Date</h1>

        <!-- New semester date dialog -->
        <template>
          <div class="text-center">
            <v-dialog v-model="newAcademicDialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="blue darken-4" dark v-bind="attrs" v-on="on">
                  New academic year
                </v-btn>
              </template>

              <!-- Dialog card -->
              <v-card>
                <v-card-title class="text-h5 mb-3">
                  Enter new year
                </v-card-title>
                <v-form ref="form" v-model="valid">
                  <v-text-field
                    placeholder="Ex: 2021"
                    outlined
                    class="mx-5"
                    :rules="[() => !!academicYear || 'This field is required']"
                    v-model.number="academicYear"
                  ></v-text-field>
                </v-form>
                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    depressed
                    @click="handleNewAcademicYear"
                    class="px-5 my-1"
                  >
                    Enter
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
      </div>

      <!-- Semester date card -->
      <SemesterDateCard :academicYear="academicYear" />
    </main>
  </section>
</template>

<script>
import SemesterDateCard from "@/components/Admin/semesterDateCard";

export default {
  layout: "admin",
  components: {
    SemesterDateCard,
  },
  data: () => ({
    newAcademicDialog: false,
  }),
  methods: {
    async handleNewAcademicYear() {
      this.$refs.form.validate();

      if(this.academicYear != ""){

      const res = this.$axios.$post(
        "http://localhost:3000/api/date/semester/new",
        {
          data: [
            {
              year: this.academicYear,
              term: 1,
              dateStart: new Date().toISOString().substr(0, 10),
              dateEnd: new Date().toISOString().substr(0, 10),
              senior: 1,
            },
            {
              year: this.academicYear,
              term: 2,
              dateStart: new Date().toISOString().substr(0, 10),
              dateEnd: new Date().toISOString().substr(0, 10),
              senior: 2,
            },
          ],
        }
      );
      this.newAcademicDialog = false;
      }
      
      // console.log(res);
    },
  },
  async asyncData({ $axios }) {
    let data;
    try {
      data = await $axios.$get("/date/semester/get");
      if (data.length === 0) data = "xxxx";
    } catch (err) {
      console.log(err);
    }
    return {
      academicYear: data[0].Academic_Year,
    };
  },
};
</script>

<style>
.admin-semester-date-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: 2rem;
}
.admin-semester-date-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.admin-semester-date-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}
</style>
