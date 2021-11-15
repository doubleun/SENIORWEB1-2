<template>
  <div>
    <CardStatus />
    <Announcement />
  </div>
</template>
<script>
import CardStatus from "@/components/Coordinator/homeCardStatus";
import Announcement from "@/components/Coordinator/homeAnnouncement";
export default {
  layout: "coordinatorsidebar",
  components: {
    CardStatus,
    Announcement
  }
};
</script>
