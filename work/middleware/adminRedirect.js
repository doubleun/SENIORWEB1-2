export default function({ store, redirect }) {
  // Redirect for admin in "senior" page
  if (store.state.auth.currentUser.role === 99) {
    return redirect("/Senior1/admin");
  }
}
