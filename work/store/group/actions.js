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
};
