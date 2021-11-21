export default function({ store, redirect }) {
  // TODO: add to nuxt.config
  // If the user is not authenticated, redirect to landing page
  if (!store.state.auth.authenticated) {
    return redirect("/");
  }
}
