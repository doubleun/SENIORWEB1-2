<template>
  <div>
    <CoordinatorHomeCardStatus :info="info" />
    <CoordinatorHomeAnnouncementAdmin
      :announcements="announcements"
      :majors="majors"
      editable
    />
  </div>
</template>
<script>
// import CardStatus from "@/components/coordinator/homeCardStatus";
// import Announcement from "@/components/coordinator/homeAnnouncementAdmin";
export default {
  data: () => ({}),
  async asyncData(context) {
    // Get announcements
    const announcements = await context.$axios.$get(
      "http://localhost:3000/api/announc/all"
    );

    // Get all major
    const majors = await context.$axios.$get("/user/getAllMajors");

    // TODO: Add modal(true, false) and allMajor(true, false) in the database. OR just checked and set major id to 99 (think about it)
    // Add modal (true, false to the object announcements)
    const data = announcements.map((itm) => ({
      ...itm,
      modal: false,
      allMajor: itm.Major_ID == 99 ? true : false,
    }));

    console.log(data);

    // Get home info for the statistic cards
    const adminUserAmount = await context.$axios.$post(
      "http://localhost:3000/api/user/amount",
      { Project_on_term_ID: 1 }
    );
    const adminInfo = [
      {
        title: "Students",
        amount: adminUserAmount.students,
        icon: "mdi-account-supervisor",
      },
      {
        title: "Teachers",
        amount: adminUserAmount.teachers,
        icon: "mdi-account-multiple",
      },
      {
        title: "Groups",
        amount: adminUserAmount.groups,
        icon: "mdi-account-multiple-plus",
      },
    ];
    return { announcements: data, info: adminInfo, majors: majors };
  },
  layout: "admin",
};
</script>
