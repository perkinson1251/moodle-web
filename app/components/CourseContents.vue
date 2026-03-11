<template>
  <div>
    <div v-if="loading" class="text-sm text-muted">Loading contents...</div>

    <div v-else-if="error" class="text-sm text-danger">Failed to load contents.</div>

    <div v-else-if="sections.length === 0" class="text-sm text-muted">No content available.</div>

    <div v-else class="space-y-4">
      <div v-for="section in sections" :key="section.id">
        <h2 class="text-sm font-medium text-txt mb-2">{{ section.name || 'Untitled section' }}</h2>

        <div v-if="section.modules.length === 0" class="text-xs text-muted pl-3">No modules</div>

        <div v-else class="space-y-0.5">
          <div
            v-for="mod in section.modules"
            :key="mod.id"
            class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-surface-hover transition-colors duration-150"
          >
            <span class="text-muted text-xs w-16 shrink-0">{{ mod.modname || 'item' }}</span>
            <a
              v-if="mod.url"
              :href="mod.url"
              target="_blank"
              rel="noopener"
              class="text-primary hover:underline truncate"
            >{{ mod.name }}</a>
            <span v-else class="text-txt truncate">{{ mod.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CourseSection } from '~/types'

const props = defineProps<{ courseId: number }>()
const { apiFetch } = useApi()

const sections = ref<CourseSection[]>([])
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    sections.value = await apiFetch<CourseSection[]>(`/api/moodle/courses/${props.courseId}/contents`)
  }
  catch {
    error.value = true
  }
  finally {
    loading.value = false
  }
})
</script>
