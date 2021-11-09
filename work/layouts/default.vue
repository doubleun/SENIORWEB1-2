<template>
  <v-app dark>
    <Appbar />
    <Sidebar />
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Appbar from "@/components/Global/mainAppbar";
import Sidebar from "@/components/stuSidebar";

export default {
  components: {
    Appbar,
    Sidebar
  }
};
</script>
<style>
.v-main {
  background-color: #edf2f9 !important;
}
</style>
