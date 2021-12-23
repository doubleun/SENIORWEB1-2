<template>
  <div>
    <CardStatus :info="info" />
    <Announcement :announcements="announcements" editable />
  </div>
</template>
<script>
import CardStatus from "@/components/Coordinator/homeCardStatus";
import Announcement from "@/components/Coordinator/homeAnnouncementAdmin";
export default {
  components: {
    CardStatus,
    Announcement
  },
  data: () => ({}),
  async asyncData(context) {
    // Get announcements
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

    // Get home info for the statistic cards
    const adminUserAmount = await context.$axios.$post(
      "http://localhost:3000/api/user/amount",
      { Project_on_term_ID: 1 }
    );
    const adminInfo = [
      {
        title: "Students",
        amount: adminUserAmount.students,
        icon: "mdi-account-supervisor"
      },
      {
        title: "Teachers",
        amount: adminUserAmount.teachers,
        icon: "mdi-account-multiple"
      },
      {
        title: "Groups",
        amount: adminUserAmount.groups,
        icon: "mdi-account-multiple-plus"
      }
    ];
    return { announcements: data, info: adminInfo };
  },
  layout: "admin"
};
</script>
