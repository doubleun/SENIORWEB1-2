export default {
  // asynchronous
  async storeGroupInfo(state) {
    // Fetch group info on the current user
    const currentUserGroupInfo = await this.$axios.$post(
      "/group/getGroupInfo",
      {
        User_Email: state.rootState.auth.currentUser.email,
        Project_on_term_ID: state.rootState.auth.currentUser.projectOnTerm,
      }
    );
    if (currentUserGroupInfo.length !== 0) {
      await state.commit("SET_GROUP", currentUserGroupInfo[0]);
    } else {
      await state.commit("SET_GROUP", null);
    }
  },
  async storeAvailableProgressions(state) {
    // Fetch all progress(es) in this major
    const allProgress = await this.$axios.$post("/criteria/scoreMajor", {
      Major_ID: state.rootState.auth.currentUser.major,
      Project_on_term_ID: state.rootState.auth.currentUser.projectOnTerm,
    });
    if (allProgress.length !== 0) {
      // Filter all progresses to get only the ones that have total of more than zero
      await state.commit(
        "SET_AVAILABLE_PROGRESS",
        allProgress.filter((progress) => progress.Total !== 0)
      );
    } else {
      // If no progress available set it to null
      await state.commit("SET_AVAILABLE_PROGRESS", null);
    }
  },
  async storeGroupMembers(state) {
    // Fetch group members from database, where user status not equal to 2 (2 means left the group)
    const groupMembers = await this.$axios.$post("/group/getGroupMembers", {
      Group_ID: state.rootState.group.currentUserGroup.Group_ID,
    });
    if (groupMembers.length !== 0) {
      await state.commit("SET_GROUP_MEMBERS", groupMembers);
    } else {
      await state.commit("SET_GROUP_MEMBERS", []);
    }
  },
};
