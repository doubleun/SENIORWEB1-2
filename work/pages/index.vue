<template>
  <v-app>
    <div class="background">
      <div
        id="inspire"
        class="bg-img boxtop"
        :style="{ backgroundImage: `url(${image})` }"
      >
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6" lg="6">
              <v-row>
                <div id="element1" align="center" justify="center">
                  <img
                    src="@/static//it_logo.png"
                    href="https://itschool.mfu.ac.th/it-home.html"
                    alt="Logo"
                    class="iconit"
                  />
                </div>
                <div id="element2" align="center" justify="center">
                  <h2 style="font-size:26px;">SENIOR PROJECT</h2>
                  <h3 style="font-size:12px;">
                    SCHOOL OF INFORMATION TECHNOLOGY
                  </h3>
                </div>
              </v-row>
            </v-col>

            <v-col cols="12" sm="6" md="6" lg="6">
              <div class="btn_login" align="center" justify="center">
                <a href="/api/auth/google" style="text-decoration: none">
                  <v-btn x-large class="btnpadding"
                    ><v-icon>mdi-account</v-icon>
                    Login
                  </v-btn>
                </a>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-card-text align="center" justify="center">
              <div class="padding">
                <h1 style="font-size:40px;">
                  Welocme to Senior Project
                </h1>
                <br />
                <v-card-text align="center" justify="center">
                  <div class="myDiv2" align-center justify-center>
                    <v-text-field
                      clearable
                      hide-details
                      label="Search topic something"
                      prepend-inner-icon="mdi-magnify"
                      filled
                      rounded
                      dense
                      class="search"
                      color="#FFFFFF"
                    ></v-text-field>
                  </div>
                </v-card-text>
              </div>
            </v-card-text> </v-row
          ><br /><br />
        </v-container>
      </div>
      <v-app class="background">
        <v-container>
          <v-card-title>
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-row><h4>Categories</h4></v-row>
                <v-row>
                  <div id="element1" align="center" justify="center">
                    <v-btn align="center" justify="center">Normal</v-btn>
                    <v-btn align="center" justify="center">Normal</v-btn>
                    <v-btn align="center" justify="center">Normal</v-btn>
                  </div>
                </v-row>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <div class="login" align="center" justify="center">
                  <v-row><h4>Study Programes</h4></v-row>
                  <v-row>
                    <v-select
                      :items="items"
                      label="Solo field"
                      dense
                      solo
                    ></v-select>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-card-title>
          <br />
          <v-card>
            <v-card-title>
              <v-card-text>
                <div>Word of the Day</div>
                <p class="text-h4 text--primary">
                  el·ee·mos·y·nar·y
                </p>
                <p>adjective</p>
                <div class="text--primary">
                  relating to or dependent on charity; charitable.<br />
                  "an eleemosynary educational institution."
                </div>
              </v-card-text>
            </v-card-title>
          </v-card>
        </v-container>
      </v-app>
    </div>
  </v-app>
</template>

<script>
import itbackground from "../static/bg.png";
export default {
  data: () => ({
    image: itbackground,
    items: [
      "Computer Engineering",
      "Computer Science and inovation",
      "Digital Technology for Business Innovation",
      "Information and Communication Engineering",
      "Multimedia Technology and Animation",
      "Software Engineering"
    ]
  }),
  layout: "empty"
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Acme&display=swap");
#app {
  font-family: "Kanit", sans-serif;
}

h1 {
  font-size: 32px;
}
h2 {
  font-size: 20px;
}
h3 {
  font-size: 14px;
  color: white;
}
#element1 {
  margin-top: 3px;
  display: inline-block;
}
#element2 {
  padding-top: 1%;
  display: inline-block;
}
/*#element1 {
  padding-top: 2%;
  margin-left: 10px;
}*/

#app {
  font-family: "Kanit", sans-serif;
}
.v-application {
  background-color: #e2dcdc;
}
.box {
  height: auto;
  width: 50%;
}
.bg-img {
  background-position: center center;
  background-size: cover;
  background-color: #999;
  height: auto;
}
.boxtop {
  padding: 2%;
  margin: 0 auto;
}
.iconit {
  height: auto;
  width: 60%;
}
.floatleft {
  float: left;
}
h2,
h6,
h1 {
  color: white;
}
.background {
  background-color: #e3f2fd;
}
.floatright {
  float: right;
}
.v-card {
  margin-left: 5px;
  margin-right: 5px;
  width: auto;
  height: auto;
}
.v-card-title {
  padding: 0px 0px 0px 0px;
}
.inline {
  display: flex;
}
.btnpadding {
  width: auto;
  margin: 2%;
  border-radius: 12px;
  background-color: white; /* white */
}
.btnpadding:hover {
  background-color: #1a237e; /* blue */
  color: white;
}
.loginbutton {
  background-color: white; /* white */
}
.loginbutton:hover {
  background-color: #1a237e; /* blue */
  color: white;
}

.myDiv {
  padding: 0%;
  display: absolute;
  justify-content: center;
}
.myDiv2 {
  padding: 0 15% 0 15%;
}
.login {
  margin-top: 2px;
  width: 50%;
  float: right;
}
.btn_login {
  width: auto;
  float: right;
}
.v-select {
  height: 20px;
  margin-bottom: 10%;
}

.padding {
  padding-top: 8%;
}
.search {
  border-radius: 10px;
}
.v-text-field:hover {
  background-color: white; /* blue */
  color: black;
}
/* Portrait */
@media only screen and (max-device-width: 375px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
  .btn_login {
    float: none;
  }
  .login {
    float: none;
  }
  .floatleft {
    float: none;
  }
  #element1 {
    align-content: center;
  }
}
</style>
