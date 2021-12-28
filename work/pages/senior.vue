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
            <v-btn
              text
              style="width:300px;height:100px"
              class="buttonsenior1and2"
              @click="() => route(1)"
            >
              <v-card-text class="text--primary">
                <center>
                  <div><h3>SENIOR PROJECT 1</h3></div>
                  <div><h4>SEM 1/2564</h4></div>
                </center>
              </v-card-text>
            </v-btn>
            <!-- </nuxt-link> -->
            <br />
            <!-- <div class="buttonsenior1and2"> -->
            <v-btn
              text
              style="width:300px;height:100px"
              class="buttonsenior1and2"
              @click="testAsync"
            >
              <v-card-text class="text--primary">
                <center>
                  <div><h3>SENIOR PROJECT 2</h3></div>
                  <div><h4>SEM 2/2564</h4></div>
                </center>
              </v-card-text>
            </v-btn>
            <!-- </div> -->
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
    image: itbackground
  }),
  methods: {
    test() {
      console.log(this.$store.state.auth);
    },
    // TODO: Delete this!
    async testAsync() {
      console.log(this.$store.state);
      // const res = await this.$axios.$get("http://localhost:3000/api/user");
      // console.log(res);
    },
    route(semester) {
      this.$store.state.auth.currentUser.role === 1
        ? this.$router.push(`/Senior${semester}/student/`)
        : this.$router.push(`/Senior${semester}/coordinator/`);
      // switch (this.$store.state.auth.currentUser.role) {
      //   case 0: {
      //     this.$router.push(`/Senior${semester}/coordinator/`);
      //     break;
      //   }
      //   case 1: {
      //     this.$router.push(`/Senior${semester}/advisor/`);
      //     break;
      //   }
      //   case 2: {
      //     this.$router.push(`/Senior${semester}/committee/`);
      //     break;
      //   }
      //   case 3: {
      //     this.$router.push(`/Senior${semester}/student/`);
      //     break;
      //   }
      //   case 99: {
      //     this.$router.push(`/Senior${semester}/admin/`);
      //     break;
      //   }
      // }
    }
  },
  middleware: ["adminRedirect"],
  layout: "empty"
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
</style>
