<template>
  <div>
    <div v-if="loading" class="text-sm text-muted">Loading participants...</div>

    <div v-else-if="error" class="text-sm text-danger">Failed to load participants.</div>

    <div v-else-if="participants.length === 0" class="text-sm text-muted">No participants found.</div>

    <div v-else>
      <!-- Desktop table -->
      <div class="hidden md:block">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-2 px-3 text-muted font-medium">Name</th>
              <th class="text-left py-2 px-3 text-muted font-medium">Email</th>
              <th class="text-left py-2 px-3 text-muted font-medium w-32">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in participants"
              :key="p.id"
              class="border-b border-border/50 hover:bg-surface-hover transition-colors duration-150"
            >
              <td class="py-2 px-3 text-txt">{{ p.fullname }}</td>
              <td class="py-2 px-3 text-muted">{{ p.email || '—' }}</td>
              <td class="py-2 px-3 text-muted">
                {{ p.roles?.map(r => r.shortname).join(', ') || '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile list -->
      <div class="md:hidden space-y-1">
        <div
          v-for="p in participants"
          :key="p.id"
          class="px-3 py-2.5 border-b border-border/50"
        >
          <div class="text-sm text-txt">{{ p.fullname }}</div>
          <div class="flex items-center gap-3 mt-1">
            <span v-if="p.email" class="text-xs text-muted truncate">{{ p.email }}</span>
            <span class="text-xs text-muted">
              {{ p.roles?.map(r => r.shortname).join(', ') || '—' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnrolledUser } from '~/types'

const props = defineProps<{ courseId: number }>()
const { apiFetch } = useApi()

const participants = ref<EnrolledUser[]>([])
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    participants.value = await apiFetch<EnrolledUser[]>(`/api/moodle/courses/${props.courseId}/enrolled-users`)
  }
  catch {
    error.value = true
  }
  finally {
    loading.value = false
  }
})
</script>
