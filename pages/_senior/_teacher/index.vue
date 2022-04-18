<template>
  <v-container>
    <CoordinatorHomeCardStatus :info="info" :isAdmin="false" />
    <CoordinatorHomeAnnouncementAdmin
      :dataUi="dataUi"
      @on-update-announcements="handelRenderData"
      editable
    />
  </v-container>
</template>
<script>
// import CardStatus from "@/components/coordinator/homeCardStatus";
// import Announcement from "@/components/coordinator/homeAnnouncement";
import utils from "@/mixins/utils";

export default {
  layout: "coordinatorsidebar",
  data() {
    return {
      dataUi: { announcements: [] },
      info: [],
    };
  },
  mixins: [utils],

  async fetch() {
    this.handelRenderData();
  },

  methods: {
    async handelRenderData() {
      try {
        let announcements = await this.$axios.$post("/announc/major", {
          MajorID: this.$store.state.auth.currentUser.major,
        });

        // Add modal (true, false to the object announcements)
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
        const data = await this.$axios.$post("/group/countMyGroup", {
          User_Email: this.$store.state.auth.currentUser.email,
        });

        this.info = [
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
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
