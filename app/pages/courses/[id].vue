<template>
  <div>
    <div class="mb-4">
      <NuxtLink to="/" class="text-sm text-muted hover:text-txt transition-colors duration-150">
        &larr; Back to courses
      </NuxtLink>
    </div>

    <div v-if="loadingCourse" class="text-sm text-muted">Loading...</div>

    <template v-else>
      <h1 class="text-lg font-semibold text-txt mb-4">{{ courseName }}</h1>

      <div class="border-b border-border mb-4">
        <nav class="flex gap-0 -mb-px">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="px-3 py-2 text-sm border-b-2 transition-colors duration-150"
            :class="activeTab === tab.key
              ? 'border-primary text-txt'
              : 'border-transparent text-muted hover:text-txt'"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <CourseContents v-if="activeTab === 'contents'" :course-id="courseId" />
      <CourseAssignments v-else-if="activeTab === 'assignments'" :course-id="courseId" />
      <CourseEvents v-else-if="activeTab === 'events'" :course-id="courseId" />
      <CourseGrades v-else-if="activeTab === 'grades'" :course-id="courseId" />
      <CourseParticipants v-else-if="activeTab === 'participants'" :course-id="courseId" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Course } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const { user } = useAuth()
const { apiFetch } = useApi()

const courseId = Number(route.params.id)
const courseName = ref('')
const loadingCourse = ref(true)
const activeTab = ref('contents')

const tabs = [
  { key: 'contents', label: 'Contents' },
  { key: 'assignments', label: 'Assignments' },
  { key: 'events', label: 'Events' },
  { key: 'grades', label: 'Grades' },
  { key: 'participants', label: 'Participants' },
]

onMounted(async () => {
  if (!user.value) return
  try {
    const courses = await apiFetch<Course[]>(`/api/moodle/users/${user.value.userid}/courses`)
    const found = courses.find(c => c.id === courseId)
    courseName.value = found?.fullname || `Course ${courseId}`
  }
  catch {
    courseName.value = `Course ${courseId}`
  }
  finally {
    loadingCourse.value = false
  }
})
</script>
