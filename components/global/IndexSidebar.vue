<template>
  <v-navigation-drawer v-model="drawer" fixed app color="white" width="310">
    <v-col class="mt-3">
      <v-row class="justify-center">
        <!-- Logo and website name -->
        <router-link to="/">
          <v-img src="/it_logo.png" max-width="85" class="mb-1"></v-img>
        </router-link>
      </v-row>
      <v-row class="justify-center"><h5>SENIOR PROJECT</h5></v-row>
      <v-row class="justify-center"
        ><h6>SCHOOL OF INFORMATION TECHNOLOGY</h6></v-row
      >
    </v-col>
    <v-col>
      <v-row class="justify-center mt-1"
        ><v-spacer></v-spacer>
        <!-- Reset filter button -->
        <v-btn text color="indigo" v-on="on">
          <h5>Reset Filters</h5>
        </v-btn></v-row
      >
    </v-col>
    <v-container class="checkboxSidebar" fluid>
      <!-- Categories checkbox -->
      <v-col>
        <v-row class="mb-1"><h5>Categories</h5></v-row>
      </v-col>
      <v-col
        ><v-row
          ><v-checkbox
            dense
            color="indigo"
            v-model="categoryCheckbox1"
            label="Title"
          ></v-checkbox></v-row
        ><v-row
          ><v-checkbox
            dense
            color="indigo"
            v-model="categoryCheckbox2"
            label="Authors"
          ></v-checkbox></v-row
        ><v-row
          ><v-checkbox
            dense
            color="indigo"
            v-model="categoryCheckbox3"
            label="Advisor"
          ></v-checkbox></v-row
      ></v-col>
      <!-- Major checkbox -->
      <v-col
        ><v-row class="mb-1"><h5>Major</h5></v-row>
      </v-col>
      <v-col
        ><v-row
          ><v-checkbox
            dense
            color="indigo"
            v-model="programCheckbox1"
            label="Computer Engineering"
          ></v-checkbox></v-row
        ><v-row
          ><v-checkbox
            dense
            color="indigo"
            v-model="programCheckbox2"
            label="Computer Science and Innovation"
          ></v-checkbox></v-row
        ><v-row
          ><v-checkbox
            dense
            color="indigo"
            v-model="programCheckbox3"
            label="Information and Communication Engineering"
          ></v-checkbox></v-row
        ><v-row
          ><v-checkbox
            dense
            color="indigo"
            v-model="programCheckbox4"
            label="Multimedia Technology and Animation"
          ></v-checkbox></v-row
        ><v-row
          ><v-checkbox
            dense
            color="indigo"
            v-model="programCheckbox5"
            label="Software Engineering"
          ></v-checkbox></v-row
      ></v-col>
    </v-container>
  </v-navigation-drawer>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(newVal) {
        this.$store.commit("set_drawer", newVal);
      },
    },
  },
};
</script>
<style scoped>
</style>