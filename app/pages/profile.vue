<template>
  <div>
    <div class="mb-4">
      <NuxtLink to="/" class="text-sm text-muted hover:text-txt transition-colors duration-150">
        &larr; Back to courses
      </NuxtLink>
    </div>

    <h1 class="text-lg font-semibold text-txt mb-4">Profile</h1>

    <div v-if="loading" class="text-sm text-muted">Loading profile...</div>

    <div v-else-if="error" class="text-sm text-danger">Failed to load profile.</div>

    <div v-else-if="profile" class="space-y-5">
      <!-- Header -->
      <div class="flex items-start gap-4">
        <img
          v-if="profile.profileimageurl"
          :src="profile.profileimageurl"
          :alt="profile.fullname"
          class="w-16 h-16 rounded-full border border-border shrink-0"
        >
        <div v-else class="w-16 h-16 rounded-full bg-surface-hover border border-border flex items-center justify-center text-xl text-muted shrink-0">
          {{ profile.fullname.charAt(0).toUpperCase() }}
        </div>
        <div class="min-w-0">
          <h2 class="text-base font-semibold text-txt">{{ profile.fullname }}</h2>
          <p v-if="profile.username" class="text-sm text-muted mt-0.5">{{ profile.username }}</p>
        </div>
      </div>

      <!-- Account info -->
      <div>
        <h3 class="text-xs font-medium text-muted uppercase tracking-wide mb-2">Account</h3>
        <div class="border border-border rounded-md divide-y divide-border">
          <div v-if="profile.email" class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-2.5 gap-0.5">
            <span class="text-sm text-muted">Email</span>
            <span class="text-sm text-txt">{{ profile.email }}</span>
          </div>
          <div v-if="profile.firstname && profile.lastname" class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-2.5 gap-0.5">
            <span class="text-sm text-muted">Name</span>
            <span class="text-sm text-txt">{{ profile.firstname }} {{ profile.lastname }}</span>
          </div>
          <div v-if="profile.idnumber" class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-2.5 gap-0.5">
            <span class="text-sm text-muted">Student ID</span>
            <span class="text-sm text-txt">{{ profile.idnumber }}</span>
          </div>
          <div v-if="profile.lang" class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-2.5 gap-0.5">
            <span class="text-sm text-muted">Language</span>
            <span class="text-sm text-txt">{{ profile.lang }}</span>
          </div>
        </div>
      </div>

      <!-- Education -->
      <div v-if="profile.department || profile.institution">
        <h3 class="text-xs font-medium text-muted uppercase tracking-wide mb-2">Education</h3>
        <div class="border border-border rounded-md divide-y divide-border">
          <div v-if="profile.institution" class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-2.5 gap-0.5">
            <span class="text-sm text-muted">Faculty</span>
            <span class="text-sm text-txt">{{ profile.institution }}</span>
          </div>
          <div v-if="profile.department" class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-2.5 gap-0.5">
            <span class="text-sm text-muted">Group</span>
            <span class="text-sm text-txt">{{ profile.department }}</span>
          </div>
        </div>
      </div>

      <!-- Location -->
      <div v-if="profile.city || profile.country">
        <h3 class="text-xs font-medium text-muted uppercase tracking-wide mb-2">Location</h3>
        <div class="border border-border rounded-md divide-y divide-border">
          <div v-if="profile.city" class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-2.5 gap-0.5">
            <span class="text-sm text-muted">City</span>
            <span class="text-sm text-txt">{{ profile.city }}</span>
          </div>
          <div v-if="profile.country" class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-2.5 gap-0.5">
            <span class="text-sm text-muted">Country</span>
            <span class="text-sm text-txt">{{ profile.country }}</span>
          </div>
        </div>
      </div>

      <!-- Activity -->
      <div v-if="profile.firstaccess || profile.lastaccess">
        <h3 class="text-xs font-medium text-muted uppercase tracking-wide mb-2">Activity</h3>
        <div class="border border-border rounded-md divide-y divide-border">
          <div v-if="profile.firstaccess" class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-2.5 gap-0.5">
            <span class="text-sm text-muted">First access</span>
            <span class="text-sm text-txt">{{ formatDate(profile.firstaccess) }}</span>
          </div>
          <div v-if="profile.lastaccess" class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-2.5 gap-0.5">
            <span class="text-sm text-muted">Last access</span>
            <span class="text-sm text-txt">{{ formatDate(profile.lastaccess) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserDetail } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const { user } = useAuth()
const { apiFetch } = useApi()

const profile = ref<UserDetail | null>(null)
const loading = ref(true)
const error = ref(false)

function formatDate(ts?: number): string {
  if (!ts) return '—'
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  if (!user.value) return
  try {
    const data = await apiFetch<UserDetail[]>(`/api/moodle/users/${user.value.userid}`)
    profile.value = data?.[0] ?? null
  }
  catch {
    error.value = true
  }
  finally {
    loading.value = false
  }
})
</script>
