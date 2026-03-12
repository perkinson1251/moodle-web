<template>
  <div>
    <div v-if="loading" class="text-sm text-muted">Loading grades...</div>

    <div v-else-if="error" class="text-sm text-danger">Failed to load grades.</div>

    <div v-else-if="grades.length === 0" class="text-sm text-muted">No grades available.</div>

    <div v-else>
      <!-- Desktop table -->
      <div class="hidden md:block">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-2 px-3 text-muted font-medium">Item</th>
              <th class="text-left py-2 px-3 text-muted font-medium w-24">Grade</th>
              <th class="text-left py-2 px-3 text-muted font-medium w-24">Range</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="g in grades"
              :key="g.id"
              class="border-b border-border/50 hover:bg-surface-hover transition-colors duration-150"
            >
              <td class="py-2 px-3 text-txt">{{ g.itemname || '—' }}</td>
              <td class="py-2 px-3 text-txt">{{ g.gradeformatted || '—' }}</td>
              <td class="py-2 px-3 text-muted">
                <template v-if="g.grademin !== undefined && g.grademax !== undefined">
                  {{ g.grademin }}–{{ g.grademax }}
                </template>
                <template v-else>—</template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile list -->
      <div class="md:hidden space-y-1">
        <div
          v-for="g in grades"
          :key="g.id"
          class="px-3 py-2.5 border-b border-border/50"
        >
          <div class="text-sm text-txt">{{ g.itemname || '—' }}</div>
          <div class="flex items-center gap-3 mt-1">
            <span class="text-xs text-txt">{{ g.gradeformatted || '—' }}</span>
            <span class="text-xs text-muted">
              <template v-if="g.grademin !== undefined && g.grademax !== undefined">
                {{ g.grademin }}–{{ g.grademax }}
              </template>
              <template v-else>—</template>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GradeItem, UserGrade } from '~/types'

const props = defineProps<{ courseId: number }>()
const { user } = useAuth()
const { apiFetch } = useApi()

const grades = ref<GradeItem[]>([])
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  if (!user.value) return
  try {
    const data = await apiFetch<{ usergrades: UserGrade[] }>(
      `/api/moodle/courses/${props.courseId}/grades?userId=${user.value.userid}`,
    )
    if (data.usergrades?.length) {
      grades.value = data.usergrades[0]!.gradeitems || []
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
