<template>
  <div>
    <v-app
      id="inspire"
      class="bg-img"
      :style="{ backgroundImage: `url(${image})` }"
    >
      <div class="out_box">
        <!--body-->

        <v-main>
          <v-card class="mx-auto">
            <v-row>
              <v-col
                align="center"
                justify="center"
                class="iconit"
                cols="12"
                sm="12"
                md="12"
                lg="12"
              >
                <div class="logo">
                  <img
                    src="@/static//it_logo.png"
                    href="https://itschool.mfu.ac.th/it-home.html"
                    alt="Logo"
                    class="iconit"
                  />
                </div>
              </v-col>
              <br /><br /><br />
            </v-row>
            <v-card-text class="text--primary">
              <center>
                <div><h2>SENIOR PROJECT</h2></div>
                <div><h5>SCHOOL OF INFORMATION TECHNOLOGY</h5></div>
              </center>
            </v-card-text>
            <v-card-text class="text--primary">
              <center>
                <div><h3>Please select Your Course</h3></div>
              </center>
            </v-card-text>

            <!-- <nuxt-link
              to="/api/auth/google"
              tag="div"
              class="buttonsenior1and2"
            > -->
            <section class="select-senior-buttons-container">
              <div v-for="(senior, index) in availableSeniors" :key="index">
                <v-btn
                  text
                  style="width: 300px; height: 100px"
                  class="buttonsenior1and2"
                  :disabled="!senior"
                  @click="
                    () =>
                      route({
                        year: senior.year,
                        semester: senior.semester,
                        senior: senior.Senior,
                      })
                  "
                >
                  <v-card-text class="text--primary">
                    <center>
                      <div>
                        <h3>
                          SENIOR PROJECT
                          {{ !!senior ? senior.Senior : index + 1 }}
                        </h3>
                      </div>
                      <div v-if="!!senior">
                        <h4>SEM {{ senior.semester }}/{{ senior.year }}</h4>
                      </div>
                    </center>
                  </v-card-text>
                </v-btn>
              </div>
            </section>
          </v-card>
        </v-main>
      </div>
    </v-app>
  </div>
</template>

<script>
import itbackground from "../static/bg.png";
export default {
  data: () => ({
    image: itbackground,
  }),
  async asyncData({ $axios, store, redirect }) {
    try {
      // Fetch available seniors
      const res = await $axios.get("/user/getUserAvailableSeniors");
      console.log("available seniors data: ", res.data);
      if (res.status === 200) {
        const availableSeniors = new Array(2);
        if (res.data?.length > 0) {
          // If the result has 1 or more element, replace it in the previous array
          const spliceArgs = [0, res.data.length].concat(res.data);
          Array.prototype.splice.apply(availableSeniors, spliceArgs);
        }
        // console.log("new availableSeniors", availableSeniors);
        return { availableSeniors };
      } else {
        throw new Error("Fail to fetch available seniors");
      }
    } catch (err) {
      console.log(err);
      redirect("/");
      return;
    }
  },
  methods: {
    // TODO: Delte this test()
    test() {
      console.log(this.$store.state.auth);
    },
    async route({ year, semester, senior }) {
      this.$store.commit("auth/SET_USER_SENIOR", {
        academicYear: year,
        semester: semester,
        senior: senior,
      });

      switch (this.$store.getters["auth/currentUser"].role) {
        case 0: {
          this.$router.replace(`/senior${senior}/teacher/`);
          break;
        }
        case 1: {
          this.$router.replace(`/senior${senior}/student/`);
          break;
        }
        case 2: {
          this.$router.replace(`/senior${senior}/coordinator/`);
          break;
        }
      }
    },
  },
  middleware: ["adminRedirect", "authenticated"],
  layout: "empty",
};
</script>

<style scoped>
.bg-img {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #999;
  height: 1000px;
  width: auto;
}
.out_box {
  padding-top: 10%;
  margin-inline: auto;
  width: fit-content;
}
.iconit {
  padding-left: 26%;
  padding-right: 26%;
}
.mx-auto {
  width: 500px;
  height: 600px;
  padding-top: 3%;
}
.v-btn {
  border: 2px solid rgb(236, 234, 234);
  border-radius: 5px;
  color: black;
  padding: 15px 32px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  height: 200px;
  width: 50%;
}
.v-btn *:hover {
  background-color: #1a237e; /* blue */
  color: white !important;
}
.v-btn--disabled {
  background-color: #ececec;
  color: red;
}
.v-btn--disabled * {
  color: #828282;
}
.buttonsenior1and2 {
  /* padding-left: 20%; */
  display: block;
  margin: auto;
}
/*
.logo {
  padding-top: 5%;
  
}*/
.sem1 {
  padding-top: 10%;
}
.select-senior-buttons-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
