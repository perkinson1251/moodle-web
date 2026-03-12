<template>
  <div>
    <div v-if="loading" class="text-sm text-muted">Loading files...</div>

    <div v-else-if="error" class="text-sm text-danger">Failed to load files.</div>

    <div v-else-if="files.length === 0" class="text-sm text-muted">No files found.</div>

    <div v-else>
      <!-- Desktop table -->
      <div class="hidden md:block">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-2 px-3 text-muted font-medium">Name</th>
              <th class="text-left py-2 px-3 text-muted font-medium w-28">Size</th>
              <th class="text-left py-2 px-3 text-muted font-medium w-40">Modified</th>
              <th class="text-right py-2 px-3 text-muted font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="f in files"
              :key="f.fileurl"
              class="border-b border-border/50 hover:bg-surface-hover transition-colors duration-150"
            >
              <td class="py-2 px-3 text-txt">
                <div class="flex items-center gap-2">
                  <svg v-if="f.type === 'folder'" class="w-4 h-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span class="truncate">{{ f.filename }}</span>
                </div>
              </td>
              <td class="py-2 px-3 text-muted">{{ f.type === 'folder' ? '—' : formatSize(f.filesize) }}</td>
              <td class="py-2 px-3 text-muted">{{ formatDate(f.timemodified) }}</td>
              <td class="py-2 px-3 text-right">
                <a
                  v-if="f.type !== 'folder' && f.fileurl"
                  :href="f.fileurl"
                  target="_blank"
                  class="text-xs text-primary hover:underline"
                >
                  Download
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile list -->
      <div class="md:hidden space-y-1">
        <div
          v-for="f in files"
          :key="f.fileurl"
          class="px-3 py-2.5 border-b border-border/50"
        >
          <div class="flex items-center gap-2">
            <svg v-if="f.type === 'folder'" class="w-4 h-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
            <svg v-else class="w-4 h-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span class="text-sm text-txt truncate">{{ f.filename }}</span>
          </div>
          <div class="flex items-center justify-between mt-1 pl-6">
            <span class="text-xs text-muted">
              {{ f.type === 'folder' ? 'Folder' : formatSize(f.filesize) }}
              · {{ formatDate(f.timemodified) }}
            </span>
            <a
              v-if="f.type !== 'folder' && f.fileurl"
              :href="f.fileurl"
              target="_blank"
              class="text-xs text-primary hover:underline"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MoodleFile } from '~/types'

interface CourseContextItem {
  id: number
  shortname?: string
  fullname?: string
  contextid?: number
  [key: string]: unknown
}

interface FilesResponse {
  files: MoodleFile[]
}

const props = defineProps<{ courseId: number }>()
const { apiFetch } = useApi()

const files = ref<MoodleFile[]>([])
const loading = ref(true)
const error = ref(false)

function formatSize(bytes?: number): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(ts?: number): string {
  if (!ts) return '—'
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

onMounted(async () => {
  try {
    const contextData = await apiFetch<CourseContextItem[]>(
      `/api/moodle/courses/${props.courseId}/context`,
    )
    const contextId = contextData?.[0]?.contextid
    if (!contextId) {
      loading.value = false
      return
    }

    const data = await apiFetch<FilesResponse>(
      `/api/moodle/files?contextid=${contextId}`,
    )
    files.value = (data.files || []).filter(f => f.filename && f.filename !== '.')
  }
  catch {
    error.value = true
  }
  finally {
    loading.value = false
  }
})
</script>
