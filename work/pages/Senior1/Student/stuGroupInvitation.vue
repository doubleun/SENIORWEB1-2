<template>
  <div>
    <Appbar />
    <Sidebar />
    <h2 class="header-title mb-2 mt-5">Group Invitation</h2>
    <v-divider></v-divider>
    <GroupInvitationCard />

    
    
  </div>
</template>
<script>
import Appbar from "@/components/Global/mainAppbar";
import Sidebar from "@/components/Student/stuSidebar";
import GroupInvitationCard from "@/components/Student/stuGroupInvitationCard";
export default {
  components: {
    Appbar,
    Sidebar,
    GroupInvitationCard
  },
};
</script>