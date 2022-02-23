export default {
  // synchronous
  SET_USER(state, payload) {
    if (!payload) {
      state.currentUser = null;
      state.isAuthenticated = false;
    } else {
      state.currentUser = payload;
      state.isAuthenticated = true;
    }
  },
  SET_USER_INIT(state) {
    state.currentUser = null;
    state.isAuthenticated = false;
  },
};
