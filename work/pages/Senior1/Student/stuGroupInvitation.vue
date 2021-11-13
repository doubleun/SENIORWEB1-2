<template>
  <div>
    <h2 class="header-title mb-2 mt-5">Group Invitation</h2>
    <v-divider></v-divider>
    <GroupInvitationCard />
  </div>
</template>
<script>
import GroupInvitationCard from "@/components/Student/stuGroupInvitationCard";
export default {
  components: {
    Appbar,
    Sidebar,
    GroupInvitationCard
  }
};
</script>
