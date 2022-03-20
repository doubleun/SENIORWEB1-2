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
    const res = await this.$axios.$post("/user/getUserProjectOnTerm", {
      User_Email: state.rootState.auth.currentUser.email,
      Major_ID: state.rootState.auth.currentUser.major,
      senior: payload,
    });

    if (res.length !== 0) {
      await state.commit("SET_USER_SENIOR", {
        senior: res[0].Senior,
        projectOnTermId: res[0].Project_on_term_ID,
      });
    }
  },
};
