export default {
  // asynchronous
  async login(state) {
    const user = await this.$axios.$get("http://localhost:3000/api/user");
    await state.commit("SET_USER", user);
  },
  async logout(state) {
    await this.$axios.$get("http://localhost:3000/api/auth/logout");
    await state.commit("SET_USER", false);
  }
};
