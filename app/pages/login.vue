<template>
  <div class="w-full max-w-90">
    <h1 class="text-xl font-semibold text-txt mb-6">Sign in</h1>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <div>
        <label for="username" class="block text-sm text-muted mb-1.5">Username</label>
        <input
          id="username"
          v-model="username"
          type="text"
          autocomplete="username"
          placeholder="user@nure.ua"
          required
          class="w-full px-3 py-2 bg-bg border border-border rounded-md text-sm text-txt placeholder-muted/50 focus:outline-none focus:border-primary transition-colors duration-150"
        />
      </div>

      <div>
        <label for="password" class="block text-sm text-muted mb-1.5">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          class="w-full px-3 py-2 bg-bg border border-border rounded-md text-sm text-txt placeholder-muted/50 focus:outline-none focus:border-primary transition-colors duration-150"
        />
      </div>

      <div v-if="error" class="text-sm text-danger">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full px-3 py-2 bg-primary text-bg font-medium text-sm rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity duration-150"
      >
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { login, isAuthenticated } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo('/')
  }
})

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await login(username.value, password.value)
    await navigateTo('/')
  }
  catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    error.value = err?.data?.message || 'Invalid credentials. Please try again.'
  }
  finally {
    loading.value = false
  }
}
</script>
