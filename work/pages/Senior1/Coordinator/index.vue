<template>
  <div>
    <CoordinatorHomeCardStatus :info="info" />
    <CoordinatorHomeAnnouncement :announcements="announcements" editable />
  </div>
</template>
<script>
// import CardStatus from "@/components/coordinator/homeCardStatus";
// import Announcement from "@/components/coordinator/homeAnnouncement";
export default {
  layout: "coordinatorsidebar",
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
