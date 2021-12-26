<template>
  <div>
      <h2 class="header-title mb-2 mt-5 mb-10 white--text">Committee</h2>
    <groupDataTable :Group_Role="1" />
  </div>
</template>
<script>
import groupDataTable from "@/components/Coordinator/groupDataTable";
export default {
  components: {
    groupDataTable,
  },
  layout: "coordinatorsidebar",
};
</script>