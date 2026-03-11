export function useApi() {
  const { token } = useAuth()
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  async function apiFetch<T>(path: string, options: Record<string, unknown> = {}): Promise<T> {
    const headers: Record<string, string> = {}
    if (token.value) {
      headers['x-moodle-token'] = token.value
    }
    return $fetch<T>(`${apiBase}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string> || {}),
      },
    })
  }

  return { apiFetch }
}
