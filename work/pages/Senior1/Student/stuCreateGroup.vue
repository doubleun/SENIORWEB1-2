<template>
  <div>
    <h2 class="header-title mb-2 mt-5">Create Group</h2>
    <v-divider></v-divider>
    <CreateGroupForm />
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
  }
};
</script>
