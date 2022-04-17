export default function({ store, redirect }) {
  // If the user is not authenticated, redirect to landing page
  if (
    !store.state.auth.isAuthenticated ||
    store.state.auth.currentUser === ""
  ) {
    return redirect("/");
  }
}
