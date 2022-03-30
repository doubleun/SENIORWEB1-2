export default async function ({ route, store, redirect }) {
  try {
    // If user is admin skip this middleware
    if (store.getters["auth/currentUser"].role === 99) return;

    // 1.) Check if user have project on term in the token
    console.log("middleware ran: check and storing project on term id...");
    // Check if there is senior in the state, if there is then skip the regex for getting senior from route.path
    let senior = store.getters["auth/currentUser"]?.senior;
    if (!senior) {
      const regexSenior = /(?:\/senior)(\d)/g;
      // console.log(route.path);
      senior = regexSenior.exec(route.path)[1];
    }
    await store.dispatch("auth/storeProjectOnTerm", senior);

    // 2.) Check if the role is allow to access this route
    //FIXME: This should be an enum and import in, not instantiate right here
    const roles = [
      { id: 0, name: "teacher" },
      { id: 1, name: "student" },
      { id: 2, name: "coordinator" },
      { id: 99, name: "admin" },
    ];

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

    // NOTE: May not need '\/' at the end...
    const regexRole = new RegExp(`\/${role.name}\/`);
    const correctRole = regexRole.test(route.path);

    // If user role is incorrect redirect user
    if (!correctRole) {
      console.log("middleware ran: route blocked, unauthorized...");
      redirect(`/senior${senior}/${role.name}`);
    }

    // 3.) Check if user has a group ? If not try to fetch it
    // Store student group (if not exists)
    if (
      store.getters["auth/currentUser"]?.role === 1 &&
      !store.getters["group/currentUserGroup"]
    ) {
      // Try fetch current user's group info if user role is 1 (ie. student)
      console.log("middleware ran: getting available current student group...");
      await store.dispatch("group/storeGroupInfo");
    }

    // 4.) Get available proress
    // Get available progress (if not exists)
    if (
      !!store.getters["auth/currentUser"] &&
      !store.getters["group/availableProgress"]
    ) {
      console.log("middleware ran: getting available progress...");
      await store.dispatch("group/storeAvailableProgressions");
    }
  } catch (err) {
    console.log(err);
    redirect("/");
  }
}
