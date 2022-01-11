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
  async asyncData({ $axios, store }) {
    try {
      const announcements = await $axios.$post("/announc/major", {
        MajorID: store.state.auth.currentUser.major,
      });
      const data = await $axios.$post("/group/countMyGroup", {
        User_Email: store.state.auth.currentUser.email,
        Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
      });

      console.log(data)

      //! Fetch home info (mock)
      const teacherInfo = [
        {
          title: "My advisee",
          amount: data[0].Advisor,
          icon: "mdi-account-supervisor",
        },
        {
          title: "Committee",
          amount: data[0].Committee,
          icon: "mdi-account-multiple",
        },
        {
          title: "Group Request",
          amount: data[0].GroupRequest,
          icon: "mdi-account-multiple-plus",
        },
      ];
      return { announcements, info: teacherInfo };
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
