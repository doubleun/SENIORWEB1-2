<template>
  <div>
    <CoordinatorHomeCardStatus :info="info" />
    <CoordinatorHomeAnnouncementAdmin
      :dataUi="dataUi"
      :majors="majors"
      :bindAnnouncement="bindAnnouncement"
      @on-update-announcements="refresh"
      editable
    />
  </div>
</template>
<script>
// import CardStatus from "@/components/coordinator/homeCardStatus";
// import Announcement from "@/components/coordinator/homeAnnouncementAdmin";
import utils from "@/mixins/utils";

export default {
  data: () => ({
    dataUi: { announcements: [] },
  }),
  mixins: [utils],
  async asyncData(context) {
    // Get announcements
    const announcements = await context.$axios.$get("announc/all");

    // Get all major
    const majors = await context.$axios.$get("/user/getAllMajors");

    // TODO: Add modal(true, false) and allMajor(true, false) in the database. OR just checked and set major id to 99 (think about it)
    // Add modal (true, false to the object announcements)
    const data = announcements.map(
      (itm) => (
        (itm.major = { Major_ID: itm.Major_ID, Major_Name: itm.Major_Name }),
        delete itm.Major_ID,
        delete itm.Major_Name,
        {
          ...itm,
          modal: false,
          allMajor: itm.major.Major_ID == 99 ? true : false,
        }
      )
    );

    console.log(data);

    // Get home info for the statistic cards
    const adminUserAmount = await context.$axios.$post("user/amount", {
      Project_on_term_ID: 1,
    });
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

    return {
      info: adminInfo,
      majors: majors,
      bindAnnouncement: data,
    };
  },

  mounted() {
    this.dataUi = {
      announcements: this.handleCloneDeep(this.bindAnnouncement),
    };
  },
  methods: {
    async refresh() {
      // Fetch new data (foruce to run asyncData and fetch api)
      await this.$nuxt.refresh();
      // Update UI
      this.dataUi = {
        announcements: this.handleCloneDeep(this.bindAnnouncement),
      };
    },
  },
  layout: "admin",
};
</script>
