<template>
  <div>
    <v-row
      class="d-flex align-center"
      style="margin-top: -5%; margin-bottom: 4%"
    >
      <v-col md="2" sm="3">
        <h3 class="white--text">Senior Project</h3>
      </v-col>
      <v-col md="1" sm="2" class="mr-10">
        <v-select
          v-model="selectedSenior"
          :items="senior"
          item-text="Senior"
          item-value="senior"
          dense
          solo
          hide-details
          off
          @change="handelChangeSenior"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedSenior: 1,
      senior: [1, 2],
      loading: false,
    };
  },
  mounted() {
    this.selectedSenior = this.$store.state.auth.currentUser.senior;
  },
  methods: {
    handelChangeSenior() {
      this.loading = true;
      // console.log("selectedSenior", this.selectedSenior);
      // return;
      this.$store.commit("auth/SET_USER_SENIOR", this.selectedSenior);
      this.loading = false;
    },
  },
};
</script>
