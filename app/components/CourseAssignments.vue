<template>
  <div>
    <div v-if="loading" class="text-sm text-muted">Loading assignments...</div>

    <div v-else-if="error" class="text-sm text-danger">Failed to load assignments.</div>

    <div v-else-if="assignments.length === 0" class="text-sm text-muted">No assignments.</div>

    <div v-else>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border">
            <th class="text-left py-2 px-3 text-muted font-medium">Name</th>
            <th class="text-left py-2 px-3 text-muted font-medium w-40">Due date</th>
            <th class="text-right py-2 px-3 text-muted font-medium w-28">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="a in assignments"
            :key="a.id"
            class="border-b border-border/50 hover:bg-surface-hover transition-colors duration-150"
          >
            <td class="py-2 px-3 text-txt">{{ a.name }}</td>
            <td class="py-2 px-3 text-muted">{{ formatDate(a.duedate) }}</td>
            <td class="py-2 px-3 text-right">
              <button
                class="text-xs text-primary hover:underline mr-3"
                @click="submitAssignment(a.id)"
              >
                Submit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="submitMsg" class="mt-3 text-sm" :class="submitError ? 'text-danger' : 'text-success'">
      {{ submitMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Assignment, AssignmentsResponse } from '~/types'

const props = defineProps<{ courseId: number }>()
const { user } = useAuth()
const { apiFetch } = useApi()

const assignments = ref<Assignment[]>([])
const loading = ref(true)
const error = ref(false)
const submitMsg = ref('')
const submitError = ref(false)

function formatDate(ts: number): string {
  if (!ts) return 'No due date'
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function submitAssignment(assignmentId: number) {
  submitMsg.value = ''
  submitError.value = false
  try {
    await apiFetch(`/api/moodle/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: { userId: user.value?.userid },
    })
    submitMsg.value = 'Submitted successfully.'
  }
  catch {
    submitError.value = true
    submitMsg.value = 'Failed to submit.'
  }
}

onMounted(async () => {
  try {
    const data = await apiFetch<AssignmentsResponse>(`/api/moodle/courses/${props.courseId}/assignments`)
    if (data.courses?.length) {
      assignments.value = data.courses.flatMap(c => c.assignments || [])
    }
  }
  catch {
    error.value = true
  }
  finally {
    loading.value = false
  }
})
</script>
