<template>
  <v-container>
    <CoordinatorHomeCardStatus :info="info" :isAdmin="false" />
    <CoordinatorHomeAnnouncement
      :dataUi="dataUi"
      :bindingData="announcements"
      @on-update-announcements="refresh"
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
      dataUi: { announcement: [] },
    };
  },
  mixins: [utils],

  async asyncData({ $axios, store }) {
    try {
      const announcements = await $axios.$post("/announc/major", {
        MajorID: store.state.auth.currentUser.major,
      });
      const data = await $axios.$post("/group/countMyGroup", {
        User_Email: store.state.auth.currentUser.email,
        // Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
      });

      console.log(data);

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
  mounted() {
    this.dataUi = {
      announcement: this.handleCloneDeep(this.announcements),
    };
  },
  methods: {
    async refresh() {
      await this.$nuxt.refresh();
      this.dataUi = {
        announcement: this.handleCloneDeep(this.announcements),
      };
    },
  },
};
</script>
