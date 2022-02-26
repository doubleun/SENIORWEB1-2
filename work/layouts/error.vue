<template>
  <v-app dark>
    <section class="error-layout-container">
      <div class="error-layout-content">
        <img src="/it_logo.png" width="14%" />
        <h1>
          {{ error.statusCode === 404 ? "404" : "500" }}
        </h1>
        <h5 v-if="error.statusCode === 404">
          {{ pageNotFound }}
        </h5>
        <h5 v-else>
          {{ otherError }}
        </h5>
        <v-btn
          @click="handleGoBack"
          color="primary"
          dark
          class="error-layout-btn"
          >Go back</v-btn
        >
      </div>
    </section>
    <!-- <NuxtLink to="/"> Go back to homepage </NuxtLink> -->
  </v-app>
</template>

<script>
export default {
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "Page not found, please click the button below to go back.",
      otherError:
        "An error occurred, please click the button below to go back.",
    };
  },
  methods: {
    handleGoBack() {
      this.$router.go(-1);
    },
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
};
</script>

<style scoped>
.error-layout-container {
  height: 100%;
  background-image: url("@/static/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
}
.error-layout-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-block-start: 6%;
  width: 50%;
  gap: 1rem;
  margin-inline: auto;
}
.error-layout-content > h1 {
  font-size: 72px;
  font-family: "Montserrat", sans-serif;
  color: white;
}
.error-layout-content > h5 {
  font-size: 18px;
  color: white;
}
.error-layout-btn {
  width: 20%;
  border-radius: 10rem;
}
</style>
