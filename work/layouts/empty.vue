<template>
  <div>
    <Landing v-if="$nuxt.$route.path === '/'" />
    <Senior v-if="$nuxt.$route.path === '/senior'" />
  </div>
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
