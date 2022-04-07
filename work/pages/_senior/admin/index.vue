<template>
  <v-container>
    <CoordinatorHomeCardStatus :info="info" />
    <CoordinatorHomeAnnouncementAdmin
      :dataUi="dataUi"
      :majors="majors"
      :bindingData="bindingData"
      @on-update-announcements="handelRenderData"
      editable
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
    bindingData: [],
    info: [],
  }),
  mixins: [utils],

  async asyncData({ $axios, store }) {
    let majors;
    try {
      // Get all major
      majors = await $axios.$get("/major/getAllActiveMajors");

      // console.log(
      //   "Academic_Year",
      //   store.getters["auth/currentUser"].academicYear,
      //   "Academic_Term",
      //   store.getters["auth/currentUser"].semester,
      //   "Senior",
      //   store.getters["auth/currentUser"].senior
      // );
    } catch (error) {
      console.log(error);
    }

    return { majors };
  },

  //  return {
  //     info: adminInfo,
  //     majors: majors,
  //     bindingData: data,
  //   };

  async fetch() {
    this.handelRenderData();
  },

  // mounted() {
  //   this.dataUi = {
  //     announcements: this.handleCloneDeep(this.bindAnnouncement),
  //   };
  //   // console.log("dataUi", this.dataUi);
  // },
  methods: {
    async handelRenderData() {
      try {
        // Get announcements
        let announcements = await this.$axios.$post("/announc/all", {
          Academic_Year: this.$store.getters["auth/currentUser"].academicYear,
          Academic_Term: this.$store.getters["auth/currentUser"].semester,
          Senior: this.$store.getters["auth/currentUser"].senior,
        });

        // console.log(
        //   "Academic_Year",
        //   this.$store.getters["auth/currentUser"].academicYear,
        //   "Academic_Term",
        //   this.$store.getters["auth/currentUser"].semester,
        //   "Senior",
        //   this.$store.getters["auth/currentUser"].senior
        // );

        // TODO: Add modal(true, false) and allMajor(true, false) in the database. OR just checked and set major id to 99 (think about it)
        // Add modal (true, false to the object announcements)
        this.bindingData = announcements.map(
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
          announcements: this.handleCloneDeep(this.bindingData),
        };

        // Get home info for the statistic cards FIXME: to use real project on term
        const adminUserAmount = await this.$axios.$post("user/amount", {
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
        console.log("info", this.info);
      } catch (error) {
        console.log(error);
      }
    },

    async refresh() {
      // Fetch new data (foruce to run asyncData and fetch api)
      await this.$nuxt.refresh();
      // Update UI
      this.dataUi = {
        announcements: this.handleCloneDeep(this.bindAnnouncement),
      };
      console.log("dataUi", this.dataUi);
    },
  },
  layout: "admin",
};
</script>
