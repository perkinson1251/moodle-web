<template>
  <div>
    <div v-if="loading" class="text-sm text-muted">Loading events...</div>

    <div v-else-if="error" class="text-sm text-danger">Failed to load events.</div>

    <div v-else-if="events.length === 0" class="text-sm text-muted">No events.</div>

    <div v-else class="space-y-0.5">
      <div
        v-for="ev in events"
        :key="ev.id"
        class="flex items-start gap-3 px-3 py-2 rounded-md hover:bg-surface-hover transition-colors duration-150"
      >
        <div class="w-32 shrink-0 text-xs text-muted pt-0.5">
          {{ formatDate(ev.timestart) }}
        </div>
        <div class="min-w-0">
          <div class="text-sm text-txt">{{ ev.name }}</div>
          <div v-if="ev.eventtype" class="text-xs text-muted mt-0.5">{{ ev.eventtype }}</div>
        </div>
        <div v-if="ev.timeduration" class="text-xs text-muted shrink-0 ml-auto">
          {{ formatDuration(ev.timeduration) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CalendarEvent } from '~/types'

const props = defineProps<{ courseId: number }>()
const { apiFetch } = useApi()

const events = ref<CalendarEvent[]>([])
const loading = ref(true)
const error = ref(false)

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(secs: number): string {
  if (secs < 60) return `${secs}s`
  if (secs < 3600) return `${Math.round(secs / 60)}min`
  return `${Math.round(secs / 3600)}h`
}

onMounted(async () => {
  try {
    const data = await apiFetch<{ events: CalendarEvent[] }>(`/api/moodle/courses/${props.courseId}/events`)
    events.value = (data.events || []).sort((a, b) => a.timestart - b.timestart)
  }
  catch {
    error.value = true
  }
  finally {
    loading.value = false
  }
})
</script>
