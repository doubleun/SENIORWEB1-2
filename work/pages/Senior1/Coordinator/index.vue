<template>
  <div>
    <CardStatus />
    <Announcement :announcements="announcements" editable />
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
  },
  async asyncData(context) {
    const announcements = await context.$axios.$post(
      "http://localhost:3000/api/announc/major",
      {
        MajorID: context.store.state.auth.currentUser.major
      }
    );
    return { announcements };
  }
};
</script>
