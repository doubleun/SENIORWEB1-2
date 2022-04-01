export default {
  // asynchronous
  async login(state) {
    const res = await this.$axios.$get("/user");
    if (res.status === 200 && res.email !== null && res.email !== "") {
      await state.commit("SET_USER", res);
    } else {
      console.log("User not found");
      await this.$axios.$get("http://localhost:3000/api/auth/logout");
      await state.commit("SET_USER", false);
    }
  },
  async logout(state) {
    const res = await this.$axios.$get("http://localhost:3000/api/auth/logout");
    await state.commit("SET_USER_INIT");
  },
  async storeProjectOnTerm(state, payload) {
    const res = await this.$axios.post("/user/getUserProjectOnTerm", {
      seniorFromRoute: payload,
    });

    if (res.status === 200 && !state.rootState.auth.currentUser?.senior) {
      await state.commit("SET_USER_SENIOR", {
        academicYear: res.data.Academic_Year,
        semester: res.data.Academic_Term,
        senior: res.data.Senior,
      });
    }
  },
};
