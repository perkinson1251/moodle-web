<template>
  <div>
    <h1 class="text-lg font-semibold text-txt mb-4">Courses</h1>

    <div v-if="loading" class="text-sm text-muted">Loading courses...</div>

    <div v-else-if="error" class="text-sm text-danger">
      Failed to load courses. Please try again.
    </div>

    <div v-else-if="courses.length === 0" class="text-sm text-muted">
      No courses found.
    </div>

    <div v-else class="space-y-1">
      <NuxtLink
        v-for="course in courses"
        :key="course.id"
        :to="`/courses/${course.id}`"
        class="flex items-center justify-between px-3 py-2.5 rounded-md border border-border hover:bg-surface-hover transition-colors duration-150 group"
      >
        <div class="min-w-0">
          <div class="text-sm text-txt group-hover:text-primary transition-colors duration-150 truncate">
            {{ course.fullname }}
          </div>
          <div class="text-xs text-muted mt-0.5">{{ course.shortname }}</div>
        </div>
        <svg class="w-4 h-4 text-muted shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const { user } = useAuth()
const { apiFetch } = useApi()

const courses = ref<Course[]>([])
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  if (!user.value) return
  try {
    courses.value = await apiFetch<Course[]>(`/api/moodle/users/${user.value.userid}/courses`)
  }
  catch {
    error.value = true
  }
  finally {
    loading.value = false
  }
})
</script>
