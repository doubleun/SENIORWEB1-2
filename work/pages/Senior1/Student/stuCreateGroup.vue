<template>
  <div>
    <Appbar />
    <Sidebar />
    <h2 class="header-title mb-2 mt-5">Create Group</h2>
    <v-divider></v-divider>
    <CreateGroupForm />
    <!-- <GroupInvitationCard /> -->
  </div>
</template>
<script>
import Appbar from "@/components/Global/mainAppbar";
import Sidebar from "@/components/Student/stuSidebar";
import CreateGroupForm from "@/components/Student/stuCreateGroupForm";
// import GroupInvitationCard from "@/components/Student/stuGroupInvitationCard";
export default {
  components: {
    Appbar,
    Sidebar,
    CreateGroupForm
    // GroupInvitationCard
  },
};
</script>
