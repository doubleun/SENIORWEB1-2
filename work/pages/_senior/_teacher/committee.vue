<template>
  <v-container>
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Committee</h2>
    <CoordinatorGroupDataTable :Group_Role="1" />
  </v-container>
</template>
<script>
// import groupDataTable from "@/components/coordinator/groupDataTable";
export default {
  layout: "coordinatorsidebar",
};
</script>
