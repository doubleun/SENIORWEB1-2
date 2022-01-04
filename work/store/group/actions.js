export default {
  // asynchronous
  async storeGroupInfo(state) {
    // Fetch group info on the current user
    const currentUserGroupInfo = await this.$axios.$post(
      "/group/getGroupInfo",
      {
        User_Email: state.rootState.auth.currentUser.email,
        Project_on_term_ID: state.rootState.auth.currentUser.projectOnTerm
      }
    );
    if (currentUserGroupInfo.length !== 0) {
      await state.commit("SET_GROUP", currentUserGroupInfo[0]);
    } else {
      await state.commit("SET_GROUP", {});
    }
  },
  async storeTeacherGroupInfo(state, groupId) {
    // Fetch group info on the current user for teacher
    const currentUserGroupInfo = await this.$axios.$post(
      "/group/getMyGroup",
      {
        Group_ID: groupId
      }
    );
    if (currentUserGroupInfo.length !== 0) {
      await state.commit("SET_GROUP", currentUserGroupInfo);
    } else {
      await state.commit("SET_GROUP", {});
    }
  }
};
