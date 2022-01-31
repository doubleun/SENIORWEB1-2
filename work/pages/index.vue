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
                  <h2 style="font-size: 26px">SENIOR PROJECT</h2>
                  <h3 style="font-size: 12px">
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
              <v-form ref="entryForm" @submit.prevent="handelSearch">
                <div class="padding">
                  <h1 style="font-size: 40px">Welocme to Senior Project</h1>
                  <br />
                  <v-card-text align="center" justify="center">
                    <div class="myDiv2" align-center justify-center>
                      <v-text-field
                        v-model="search"
                        label="Search topic something"
                        prepend-inner-icon="mdi-magnify"
                        filled
                        rounded
                        dense
                        class="search"
                        color="#000000"
                        clearable
                        @input="hancelChangeClearSearch"
                        @click:clear="hancelClearSearch"
                        :rules="textRule"
                        required
                      ></v-text-field>
                    </div>
                  </v-card-text>
                </div>
              </v-form>
            </v-card-text>
          </v-row>
          <br /><br />
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
                    <v-btn
                      :color="filterBtnActive[0] ? 'primary' : 'white'"
                      type="submit"
                      align="center"
                      justify="center"
                      @click="handelSearch(0)"
                      >Title</v-btn
                    >
                    <v-btn
                      :color="filterBtnActive[1] ? 'primary' : 'white'"
                      type="submit"
                      align="center"
                      justify="center"
                      @click="handelSearch(1)"
                      >Authors</v-btn
                    >
                    <v-btn
                      :color="filterBtnActive[2] ? 'primary' : 'white'"
                      type="submit"
                      align="center"
                      justify="center"
                      @click="handelSearch(2)"
                      >Advisor</v-btn
                    >
                  </div>
                </v-row>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <div class="login" align="center" justify="center">
                  <v-row><h4>Study Programes</h4></v-row>
                  <v-row>
                    <v-select
                      v-model="selectedMajor"
                      :items="majors"
                      item-text="Major_Name"
                      item-value="Major_ID"
                      return-object
                      label="Solo field"
                      dense
                      solo
                      @change="handelChangeMajor"
                    ></v-select>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-card-title>
          <br />
          <v-card>
            <!-- <v-card-title>
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
            </v-card-title> -->

            <v-data-table
              :headers="headers"
              :items="abstracts"
              :hide-default-header="true"
              class="elevation-1"
            >
              <template v-slot:item.Abstract_Name="{ item }">
                <v-icon large color="blue darken-2"> mdi-file </v-icon>
              </template>

              <template v-slot:item.content="{ item }">
                <div class="pa-6">
                  <h2 class="black--text">{{ item.Group_Name_Eng }}</h2>
                  <span class="grey--text text--darken-1">{{
                    item.Students
                  }}</span>
                  <div class="grey--text text--darken-1">
                    <strong>Published:</strong>&nbsp;{{
                      item.Submit_Date.substring(0, 10)
                    }}
                  </div>
                  <!-- <div>{{ item.Advisor }}</div> -->
                </div>
              </template>
            </v-data-table>
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
    selectedMajor: {},
    textRule: [],
    search: "",
    isLoad: false,
    filterBtnActive: [false, false, false], // [0]=title button, [1]=authors button, [2]=advisor button,
    valid: true,
    headers: [
      {
        text: "FILE",
        value: "Abstract_Name",
        align: "center",
        width: "20%",
      },
      { text: "CONTENT", value: "content", width: "80%" },
    ],
  }),
  async asyncData({ $axios }) {
    // Get all major
    var majors, abstracts;
    try {
      majors = await $axios.$get("/user/getAllMajors");
      abstracts = await $axios.$get("/assignment/abstracts");
      console.log("abstarct", abstracts);
    } catch (error) {
      console.log(error);
    }
    majors.unshift({ Major_ID: 0, Major_Name: "All" });
    const rawAbstracts = abstracts;
    return { majors, abstracts, rawAbstracts };
  },
  mounted() {
    this.selectedMajor = this.majors[0];
  },
  methods: {
    hancelClearSearch() {
      console.log("reset");
      this.textRule = [];
      this.$refs.entryForm.reset();
    },
    hancelChangeClearSearch() {
      // console.log("reset change", this.search == "", this.search == null);
      if (this.search == "") {
        this.textRule = [];
        this.$refs.entryForm.reset();
        return;
      }
    },

    handelChangeMajor() {
      // this.$refs.entryForm.reset();
      // this.filterBtnActive = [false, false, false];
      // console.log(this.selectedMajor.Major_ID);
      if (this.selectedMajor.Major_ID == 0) {
        return (this.abstracts = this.rawAbstracts);
      }
      this.abstracts = this.rawAbstracts.filter(
        (el) => el.Major == this.selectedMajor.Major_ID
      );
      console.log(this.rawAbstracts);
    },

    handelSearch(event) {
      this.textRule = [(v) => !!v || "This field is required"];
      let self = this;

      setTimeout(function () {
        if (self.$refs.entryForm.validate()) {
          // (event click)filter by click buton(Title, Authors, Advisor)
          if (typeof event == "number") {
            self.filterBtnActive = self.filterBtnActive.map((el) => false);
            self.filterBtnActive[event] = true;
          } else {
            // (event press enter)filter by press Enter key

            // whitout click button(Title, Authors, Advisor)
            if (self.filterBtnActive.every((el) => !el)) {
              return (self.abstracts = self.rawAbstracts.filter(
                (el) =>
                  (el.Group_Name_Eng.toLowerCase().includes(
                    self.search.toLowerCase()
                  ) ||
                    el.Students.toLowerCase().includes(
                      self.search.toLowerCase()
                    ) ||
                    el.Advisor.toLowerCase().includes(
                      self.search.toLowerCase()
                    )) &&
                  (self.selectedMajor.Major_ID == 0
                    ? true
                    : el.Major == self.selectedMajor.Major_ID)
              ));
            }

            // press Enter and cilck button before
            self.abstracts = self.rawAbstracts.filter(
              (el) =>
                ((self.filterBtnActive[0]
                  ? el.Group_Name_Eng.toLowerCase().includes(
                      self.search.toLowerCase()
                    )
                  : false) ||
                  (self.filterBtnActive[1]
                    ? el.Students.toLowerCase().includes(
                        self.search.toLowerCase()
                      )
                    : false) ||
                  (self.filterBtnActive[2]
                    ? el.Advisor.toLowerCase().includes(
                        self.search.toLowerCase()
                      )
                    : false)) &&
                (self.selectedMajor.Major_ID == 0
                  ? true
                  : el.Major == self.selectedMajor.Major_ID)
            );
            return;
          }

          // ==== (event click button)
          const index = self.filterBtnActive.indexOf(true);

          // filter title (group name)
          if (index == 0) {
            return (self.abstracts = self.rawAbstracts.filter(
              (el) =>
                el.Group_Name_Eng.toLowerCase().includes(
                  self.search.toLowerCase()
                ) &&
                (self.selectedMajor.Major_ID == 0
                  ? true
                  : el.Major == self.selectedMajor.Major_ID)
            ));
          }

          // filter student
          if (index == 1) {
            return (self.abstracts = self.rawAbstracts.filter(
              (el) =>
                el.Students.toLowerCase().includes(self.search.toLowerCase()) &&
                (self.selectedMajor.Major_ID == 0
                  ? true
                  : el.Major == self.selectedMajor.Major_ID)
            ));
          }

          // filter advisor
          if (index == 2) {
            return (self.abstracts = self.rawAbstracts.filter(
              (el) =>
                el.Advisor.toLowerCase().includes(self.search.toLowerCase()) &&
                (self.selectedMajor.Major_ID == 0
                  ? true
                  : el.Major == self.selectedMajor.Major_ID)
            ));
          }
          // }
        }
      });
    },
  },
  layout: "empty",
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
