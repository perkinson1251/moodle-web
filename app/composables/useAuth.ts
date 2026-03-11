import type { SiteInfo } from '~/types'

export function useAuth() {
  const token = useCookie<string | null>('moodle_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })

  const user = useState<SiteInfo | null>('auth_user', () => null)
  const isAuthenticated = computed(() => !!token.value)

  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  async function login(username: string, password: string) {
    const data = await $fetch<{ token: string; privatetoken?: string }>(`${apiBase}/api/moodle/auth/login`, {
      method: 'POST',
      body: { username, password },
    })
    token.value = data.token
    await fetchSiteInfo()
  }

  async function fetchSiteInfo() {
    if (!token.value) return
    try {
      const data = await $fetch<SiteInfo>(`${apiBase}/api/moodle/auth/site-info`, {
        headers: { 'x-moodle-token': token.value },
      })
      user.value = data
    }
    catch {
      token.value = null
      user.value = null
    }
  }

  function logout() {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    fetchSiteInfo,
  }
}
