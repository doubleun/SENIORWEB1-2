<template>
  <div>
      <cardStatus />
      <announcement />
  </div>
</template>
<script>
import cardStatus from "@/components/Coordinator/homeCardStatus";
import announcement from "@/components/Coordinator/homeAnnouncement";
export default {
  layout: "coordinator",
  components: {
    cardStatus,
    announcement,
  },
};
</script>