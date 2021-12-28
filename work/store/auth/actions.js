export default {
  // asynchronous
  async login(state) {
    const res = await this.$axios.$get("http://localhost:3000/api/user");
    if (res.status === 200 && res.email !== null && res.email !== "") {
      await state.commit("SET_USER", res);
    } else {
      await this.$axios.$get("http://localhost:3000/api/auth/logout");
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
