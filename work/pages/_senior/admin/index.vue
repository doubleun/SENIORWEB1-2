<template>
  <v-container>
    <CoordinatorHomeCardStatus :info="info" />
    <CoordinatorHomeAnnouncementAdmin
      :dataUi="dataUi"
      :majors="majors"
      @on-update-announcements="handelRenderData"
      isAdmin
    />
  </v-container>
</template>
<script>
// import CardStatus from "@/components/coordinator/homeCardStatus";
// import Announcement from "@/components/coordinator/homeAnnouncementAdmin";
import utils from "@/mixins/utils";

export default {
  data: () => ({
    dataUi: { announcements: [] },
    info: [],
  }),
  mixins: [utils],

  async asyncData({ $axios, store }) {
    let majors;
    try {
      // Get all major
      majors = await $axios.$get("/major/getAllActiveMajors");
    } catch (error) {
      console.log(error);
    }

    return { majors };
  },

  async fetch() {
    this.handelRenderData();
  },

  methods: {
    async handelRenderData() {
      try {
        // Get announcements
        let announcements;
        if (this.$store.state.auth.currentUser.role !== 99) {
          announcements = await this.$axios.$post("/announc/major", {
            MajorID: this.$store.state.auth.currentUser.major,
          });
        }

        announcements = await this.$axios.$post("/announc/all", {
          Academic_Year: this.$store.getters["auth/currentUser"].academicYear,
          Academic_Term: this.$store.getters["auth/currentUser"].semester,
          Senior: this.$store.getters["auth/currentUser"].senior,
        });

        // Add modal and allMajor (true, false to the object announcements)
        let mapData = announcements.map(
          (itm) => (
            (itm.major = {
              Major_ID: itm.Major_ID,
              Major_Name: itm.Major_Name,
            }),
            delete itm.Major_ID,
            delete itm.Major_Name,
            {
              ...itm,
              modal: false,
              allMajor: itm.major.Major_ID == 99 ? true : false,
            }
          )
        );

        this.dataUi = {
          announcements: this.handleCloneDeep(mapData),
        };

        // Get home info for the statistic cards
        const adminUserAmount = await this.$axios.$post("/user/amount", {
          Academic_Year: this.$store.getters["auth/currentUser"].academicYear,
          Academic_Term: this.$store.getters["auth/currentUser"].semester,
          Senior: this.$store.getters["auth/currentUser"].senior,
        });
        this.info = [
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
        // console.log("info", this.info);
      } catch (error) {
        console.log(error);
      }
    },
  },
  layout: "admin",
};
</script>
