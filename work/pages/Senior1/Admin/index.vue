<template>
  <div>
    <CardStatus />
    <Announcement :announcements="announcements" editable />
  </div>
</template>
<script>
import CardStatus from "@/components/Coordinator/homeCardStatus";
import Announcement from "@/components/Coordinator/homeAnnouncementAdmin";
export default {
  layout: "admin",
  components: {
    CardStatus,
    Announcement
  },
  async asyncData(context) {
    const announcements = await context.$axios.$get(
      "http://localhost:3000/api/announc/all"
    );
    // TODO: Add modal(true, false) and allMajor(true, false) in the database. OR just checked and set major id to 99 (think about it)
    // Add modal (true, false to the object announcements)
    const data = announcements.map(itm => ({
      ...itm,
      modal: false,
      allMajor: false
    }));
    return { announcements: data };
  }
};
</script>
