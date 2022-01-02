<template>
  <div>
    <CardStatus :info="info" />
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
    //! Fetch home info (mock)
    const teacherInfo = [
      {
        title: "My advisee",
        amount: 0,
        icon: "mdi-account-supervisor"
      },
      {
        title: "Committee",
        amount: 0,
        icon: "mdi-account-multiple"
      },
      {
        title: "Group Request",
        amount: 0,
        icon: "mdi-account-multiple-plus"
      }
    ];
    return { announcements, info: teacherInfo };
  }
};
</script>
