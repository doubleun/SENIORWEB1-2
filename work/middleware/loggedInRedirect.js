export default function({ store, redirect }) {
  // TODO: HERE!!
  // If user is already logged in, and is in the home page redirect them based on thir roles
  if (
    !store.state.auth.isAuthenticated ||
    store.state.auth.currentUser === ""
  ) {
    return redirect("/");
  }
}
