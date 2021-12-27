<template>
  <div>
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">My Advisee</h2>
    <groupDataTable :Group_Role="0" />
  </div>
</template>
<script>
import groupDataTable from "@/components/Coordinator/groupDataTable";
export default {
  layout: "coordinatorsidebar",
  components: {
    groupDataTable
  }
};
</script>
