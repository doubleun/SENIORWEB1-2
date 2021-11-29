<template>
  <div>
    <CardStatus />
    <Announcement :announcements="announcements" />
  </div>
</template>
<script>
import CardStatus from "@/components/Coordinator/homeCardStatus";
import Announcement from "@/components/Coordinator/homeAnnouncement";
export default {
  layout: "admin",
  components: {
    CardStatus,
    Announcement
  },
  middleware: "authenticated",
  async asyncData(context) {
    const announcements = await context.$axios.$get(
      "http://localhost:3000/api/announc/all"
    );
    return { announcements };
  }
};
</script>
