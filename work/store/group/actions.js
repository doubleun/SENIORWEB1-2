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
    let allProgress = [];

    // console.log(state.rootState.group?.currentUserGroup);
    try {
      // Check if current user's group info is available and fetch progress based on current user group's major
      if (!!state.rootState.group?.currentUserGroup) {
        console.log("=== Fetch progress with group major! ===");
        allProgress = await this.$axios.$post("/criteria/scoreMajor", {
          Major_ID: state.rootState.group?.currentUserGroup.Major,
          Project_on_term_ID:
            state.rootState.group?.currentUserGroup.Project_on_term_ID,
          onlyAvailable: true,
        });
      } else {
        // If not fetch available progress based on user's major
        allProgress = await this.$axios.$post("/criteria/scoreMajor", {
          Major_ID: state.rootState.auth.currentUser.major,
          Project_on_term_ID: state.rootState.auth.currentUser.projectOnTerm,
          onlyAvailable: true,
        });
      }

      console.log("All progress from state: ", allProgress);
      await state.commit("SET_AVAILABLE_PROGRESS", allProgress);
      return;
    } catch (err) {
      console.log(err);
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
