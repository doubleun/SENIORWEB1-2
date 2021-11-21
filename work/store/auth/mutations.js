export default {
  // synchronous
  SET_USER(state, payload) {
    if (payload === false) {
      state.currentUser = null;
      state.isAuthenticated = false;
    } else {
      state.currentUser = payload;
      state.isAuthenticated = true;
    }
  }
};
