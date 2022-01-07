export default {
  // synchronous
  SET_GROUP(state, payload) {
    state.currentUserGroup = payload;
  },
  SET_AVAILABLE_PROGRESS(state, payload) {
    state.availableProgress = payload;
  },
};
