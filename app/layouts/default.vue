<template>
  <div class="min-h-screen bg-bg flex">
    <AppSidebar />
    <main class="flex-1 min-w-0 ml-62">
      <div class="max-w-300 mx-auto px-6 py-6">
        <slot />
      </div>
    </main>
  </div>
</template>
