<template>
  <div>
    <h2 class="header-title mb-2 mt-5">Create Group</h2>
    <v-divider></v-divider>
    <CreateGroupForm :groupMembers="groupMembers" />
    <!-- <GroupInvitationCard /> -->
  </div>
</template>
<script>
import CreateGroupForm from "@/components/Student/stuCreateGroupForm";
// import GroupInvitationCard from "@/components/Student/stuGroupInvitationCard";
export default {
  components: {
    CreateGroupForm
    // GroupInvitationCard
  },
  async asyncData({ $axios, store }) {
    // If currentUserGroup is missing, fetch it first
    if (store.state.group.currentUserGroup === null)
      // Dispatch event to store current user group info
      await store.dispatch("group/storeGroupInfo");
    let groupMembers;
    try {
      groupMembers = await $axios.$post("/group/getGroupMembers", {
        Group_ID: store.state.group.currentUserGroup.Group_ID
      });
      // TODO: Delete this
      console.log("Group members: ", groupMembers);
    } catch (err) {
      console.log(err);
    }
    return { groupMembers };
  }
};
</script>
