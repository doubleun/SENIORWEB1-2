export default function({ store, redirect }) {
  // Redirect for admin in "senior" page
  if (
    !store.state.auth.isAuthenticated ||
    store.state.auth.currentUser === ""
  ) {
    return redirect("/");
  }

  return redirect("/Senior1/admin");
}
