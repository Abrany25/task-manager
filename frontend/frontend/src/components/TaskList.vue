<template>
    <v-row class="mb-4">
        <v-col cols="12" md="4">
            <v-select
            v-model="selectedStatus"
            :items="statusOptions"
            label="Estado"
            clearable
            />
        </v-col>
        <v-col cols="12" md="4">
            <v-select
            v-model="selectedPriority"
            :items="priorityOptions"
            label="Prioridad"
            clearable
            />
        </v-col>
        <v-col cols="12" md="4" class="d-flex align-end">
            <v-btn color="primary" @click="fetchTasks">Aplicar filtros</v-btn>
        </v-col>
    </v-row>

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
            <v-btn icon @click="$router.push(`/task/${task.id}`)">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '../stores/user'
import 'vuetify/styles/main.css'

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
const selectedStatus = ref<string | null>(null)
const selectedPriority = ref<string | null>(null)

const statusOptions = ['pending', 'in_progress', 'completed']
const priorityOptions = ['low', 'medium', 'high']


const fetchTasks = async () => {
  loading.value = true
  error.value = ''

  try {
    const queryParams = new URLSearchParams()

    if (selectedStatus.value) queryParams.append('status', selectedStatus.value)
    if (selectedPriority.value) queryParams.append('priority', selectedPriority.value)

    const url = `http://127.0.0.1:8000/api/tasks/?${queryParams.toString()}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })

    if (!response.ok) {
      throw new Error('Error al cargar las tareas')
    }

    tasks.value = await response.json()
  } catch (err: any) {
    error.value = err.message || 'Error desconocido'
  } finally {
    loading.value = false
  }
}

onMounted(fetchTasks)
</script>
