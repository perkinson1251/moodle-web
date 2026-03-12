<template>
  <div class="min-h-screen bg-bg md:flex">
    <div class="md:hidden fixed top-0 left-0 right-0 h-12 bg-surface border-b border-border flex items-center px-3 z-30">
      <button class="p-1.5 text-muted hover:text-txt transition-colors duration-150" @click="toggle">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <NuxtLink to="/" class="ml-2 text-txt font-semibold text-[15px]" @click="close">Moodle</NuxtLink>
    </div>

    <AppSidebar />

    <main class="flex-1 min-w-0 pt-12 md:pt-0 md:ml-62">
      <div class="max-w-300 mx-auto px-4 py-4 md:px-6 md:py-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { toggle, close } = useSidebar()
</script>
