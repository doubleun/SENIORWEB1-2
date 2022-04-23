export default function ({ route, store, redirect }) {
  // If it's login page don't check for authentication
  const isLoginPage = route.fullPath === '/'
  if (isLoginPage) return

  // If the user is not authenticated, redirect to landing page
  if (
    !store.state.auth.isAuthenticated ||
    store.state.auth.currentUser === ''
  ) {
    // TODO: Log this only when DEV mode is on
    console.log('authenticated: redirecting ...')
    return redirect('/')
  }
}
