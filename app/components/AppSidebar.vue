<template>
  <aside class="w-62 h-screen fixed top-0 left-0 bg-surface border-r border-border flex flex-col">
    <div class="px-4 py-4 border-b border-border">
      <NuxtLink to="/" class="text-txt font-semibold text-[15px] hover:text-primary transition-colors duration-150">
        Moodle
      </NuxtLink>
    </div>

    <nav class="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors duration-150"
        :class="route.path === '/' ? 'bg-surface-hover text-txt' : 'text-muted hover:text-txt hover:bg-surface-hover'"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        Dashboard
      </NuxtLink>
    </nav>

    <div v-if="user" class="px-3 py-3 border-t border-border">
      <div class="flex items-center gap-2 px-3 py-1.5">
        <div class="w-6 h-6 rounded-full bg-border flex items-center justify-center text-xs text-muted">
          {{ user.fullname.charAt(0).toUpperCase() }}
        </div>
        <span class="text-sm text-txt truncate flex-1">{{ user.fullname }}</span>
      </div>
      <button
        class="w-full mt-1 px-3 py-1.5 text-sm text-muted hover:text-txt hover:bg-surface-hover rounded-md text-left transition-colors duration-150"
        @click="logout"
      >
        Log out
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()
const { user, logout } = useAuth()
</script>
