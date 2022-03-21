export default async function ({ route, store, redirect }) {
  try {
    // If user is admin skip this middleware
    if (store.getters["auth/currentUser"].role === 99) return;

    // If user have no project on term, fetch one
    if (!store.getters["auth/currentUser"]?.projectOnTerm) {
      const regexSenior = /(?:\/senior)(\d)/g;
      const senior = regexSenior.exec(route.path)[1];
      console.log("middleware ran: storing project on term id...");
      await store.dispatch("auth/storeProjectOnTerm", senior);
    }

    //FIXME: This should be an enum and import in, not instantiate right here
    const roles = [
      { id: 0, name: "teacher" },
      { id: 1, name: "student" },
      { id: 2, name: "coordinator" },
      { id: 99, name: "admin" },
    ];

    // Check if there's a user still have no project on term
    if (store.getters["auth/currentUser"]?.projectOnTerm) {
      //FIXME: If there is a role (if not we should logout user and redirect to abstract page)
      let role;
      if (
        !!store.getters["auth/currentUser"]?.role ||
        store.getters["auth/currentUser"]?.role === 0
      ) {
        role = roles.filter(
          (role) => role.id === store.getters["auth/currentUser"]?.role
        )[0];
      }

      const senior = store.getters["auth/currentUser"]?.senior;
      if (!senior) {
        // TODO: Add logout ?
        throw new Error("Senior not found");
      }

      // NOTE: Maynot need '\/' at the end...
      const regexRole = new RegExp(`\/${role.name}\/`);
      const correctRole = regexRole.test(route.path);

      // If user role is incorrect redirect user
      if (!correctRole) {
        console.log("middleware ran: route blocked, unauthorized...");
        redirect(`/senior${senior}/${role.name}`);
      }

      // Store student group (if not exists)
      if (
        store.getters["auth/currentUser"]?.role === 1 &&
        !store.getters["group/currentUserGroup"]
      ) {
        // Try fetch current user's group info if user role is 1 (ie. student)
        console.log(
          "middleware ran: getting available current student group..."
        );
        await store.dispatch("group/storeGroupInfo");
      }

      // Get available progress (if not exists)
      if (
        !!store.getters["auth/currentUser"] &&
        !store.getters["group/availableProgress"]
      ) {
        console.log("middleware ran: getting available progress...");
        await store.dispatch("group/storeAvailableProgressions");
      }
    } else {
      throw new Error("User info not sufficient");
    }
  } catch (err) {
    // console.log(
    //   store.getters["auth/currentUser"]?.email,
    //   store.getters["auth/isAuth"],
    //   store.getters["auth/currentUser"]?.projectOnTerm
    // );
    console.log(err);
    redirect("/");
  }
}
