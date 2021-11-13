<template>
  <div>
      <h2 class="header-title mb-2 mt-5 mb-10 white--text">My Advisee</h2>
    <groupDataTable />
  </div>
</template>
<script>
import groupDataTable from "@/components/Coordinator/groupDataTable";
export default {
  components: {
    groupDataTable,
  },
  layout: "coordinator",
};
</script>