export default {
  // asynchronous
  async login(state) {
    const user = await this.$axios.$get("http://localhost:3000/api/user");
    if (user.email && user.email !== "") {
      await state.commit("SET_USER", user);
    } else {
      await state.commit("SET_USER", false);
    }
  },
  async logout(state) {
    const res = await this.$axios.$get("http://localhost:3000/api/auth/logout");
    if (res.status === 200) {
      await state.commit("SET_USER", false);
    }
  },
  test() {
    console.log("test");
  }
};
