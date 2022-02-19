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
    if (!!state.auth.currentUser && state.auth?.currentUser?.role === 1) {
      // Try fetch current user's group info if user role is 1 (ie. student)
      await dispatch("group/storeGroupInfo");
      // Try fetch available progressions
      await dispatch("group/storeAvailableProgressions");
    }

    // if (!!state.auth.currentUser && state.auth?.currentUser)
  },
};
