export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, user, fetchSiteInfo } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (!user.value) {
    await fetchSiteInfo()
    if (!user.value) {
      return navigateTo('/login')
    }
  }
})
