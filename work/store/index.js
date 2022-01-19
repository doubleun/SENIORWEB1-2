// !Before backend merge
// export const state = () => ({
//     drawer: false,
//   })

//   export const mutations = {
//     set_drawer(state, newVal) {
//       state.drawer = newVal
//     },
//   }

export const state = () => {};

export const actions = {
  async nuxtServerInit({ dispatch, commit, state }) {
    await dispatch("auth/login");
    if (state.auth.currentUser)
      // Try fetch available progressions
      await dispatch("group/storeAvailableProgressions");
  },
};
