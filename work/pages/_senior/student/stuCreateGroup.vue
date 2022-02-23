<template>
  <div>
    <!-- <h2 class="header-title mb-2 mt-5">Create Group</h2> 
    <v-divider></v-divider> -->
    <StudentCreateGroupForm :groupMembers="groupMembers" />
    <!-- <GroupInvitationCard /> -->
  </div>
</template>
<script>
// import CreateGroupForm from "@/components/student/stuCreateGroupForm";
// // import GroupInvitationCard from "@/components/student/stuGroupInvitationCard";
export default {
  async asyncData({ store }) {
    // If currentUserGroup is missing, fetch it first
    if (store.state.group.currentUserGroup === null)
      // Dispatch event to store current user group info
      await store.dispatch("group/storeGroupInfo");
    // If there are no group yet, groupMembers will be empty array, because we check if the groupMembers.length === 0 later
    if (!store.state.group.currentUserGroup) {
      return { groupMembers: [] };
    } else {
      // Else dispatch event to fetch group members from database
      await store.dispatch("group/storeGroupMembers");
      // We actually don't have to return here anymore but, the logic before this require groupMembers as props
      return { groupMembers: store.state.group.currentUserGroupMembers };
    }
  },
};
</script>
