<template>
  <v-container>
    <h2 class="text-h5 mb-4">Mis Tareas</h2>

    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <v-list v-else>
      <v-list-item
        v-for="task in tasks"
        :key="task.id"
        :title="task.title"
        :subtitle="`${task.status} | Prioridad: ${task.priority}`"
      >
        <template #append>
          <span>{{ task.due_date }}</span>
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '../stores/user'

interface Task {
  id: number
  title: string
  description: string
  due_date: string
  status: string
  priority: string
}

const tasks = ref<Task[]>([])
const loading = ref(true)
const error = ref('')
const user = useUserStore()

const fetchTasks = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/tasks/', {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })

    if (!response.ok) {
      throw new Error('Error al cargar las tareas')
    }

    const data = await response.json()
    tasks.value = data
  } catch (err: any) {
    error.value = err.message || 'Error desconocido'
  } finally {
    loading.value = false
  }
}

onMounted(fetchTasks)
</script>
