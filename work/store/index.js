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
  async nuxtServerInit(context) {
    // console.log("context: ", context);
    // console.log("con2: ", con2);
    // console.log("con2: ", con2.app.router);
    // console.log("req: ", con2.req);

    const { dispatch, commit, state } = context;
    await dispatch("auth/login");
    // if (!!state.auth.currentUser && state.auth?.currentUser?.role === 1) {
    //   // Try fetch current user's group info if user role is 1 (ie. student)
    //   await dispatch("group/storeGroupInfo");
    // }
    // if (!!state.auth.currentUser && state.auth?.currentUser)
    //   // Try fetch available progressions
    //   await dispatch("group/storeAvailableProgressions");
  },
};
