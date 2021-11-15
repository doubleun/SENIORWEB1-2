<template>
  <v-app dark>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import Landing from "@/pages/index";
import Senior from "@/pages/senior";

export default {
  components: {
    Landing,
    Senior
  }
};
</script>
