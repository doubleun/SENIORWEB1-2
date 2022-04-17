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
  SET_USER_SENIOR(state, payload) {
    state.currentUser.senior = payload.senior;
    if (!!payload?.academicYear && !!payload?.semester) {
      state.currentUser.academicYear = payload.academicYear;
      state.currentUser.semester = payload.semester;
    }
  },
  SET_USER_SEMESTER_DATA(state, payload) {
    state.semesterData = payload;
  },
};
