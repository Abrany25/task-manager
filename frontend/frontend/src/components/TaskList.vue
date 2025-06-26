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
        <v-col cols="12" md="4" class="align-end">
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
    
    <div class="masonry-grid">
      <div class="masonry-item" v-for="task in tasks" :key="task.id">
        <v-card
          class="pa-3 mb-4"
          rounded="xl"
          elevation="3"
          :class="{ 'bg-green-lighten-4': task.status === 'completed' }"
        >
          <div class="d-flex justify-space-between align-center mb-2">
            <div>
              <h3 class="text-subtitle-1 font-weight-bold">{{ task.title }}</h3>
              <div class="text-caption text-grey-darken-1">
                {{ statusLabels[task.status as keyof typeof statusLabels] }} •
                Prioridad: {{ priorityLabels[task.priority as keyof typeof priorityLabels] }}
              </div>
            </div>
            <v-btn icon color="primary" @click="$router.push(`/task/${task.id}`)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </div>

          <v-card-text class="mb-2">
            {{ task.description }}
          </v-card-text>

          <v-card-actions class="justify-space-between">
            <v-btn size="small" variant="outlined" @click="toggleStatus(task)">Estado</v-btn>
            <v-btn size="small" variant="outlined" @click="togglePriority(task)">Prioridad</v-btn>
            <v-chip color="deep-purple-lighten-3" text-color="white" size="small">
              Vence: {{ task.due_date }}
            </v-chip>
          </v-card-actions>
        </v-card>
      </div>
    </div>
    <v-row v-if="tasks.length === 0" class="mt-4">
      <v-col cols="12">
        <v-alert type="info">No hay tareas para mostrar</v-alert>
      </v-col>
    </v-row>


  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '../stores/user'
import 'vuetify/styles/main.css'
import { statusLabels, priorityLabels } from '../utils/labels'


interface Task {
  id: number
  title: string
  description: string
  due_date: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
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

//Logica para cambiar estado
const toggleStatus = async (task: Task) => {
  const nextStatus = {
    pending: 'in_progress',
    in_progress: 'completed',
    completed: 'pending'
  }[task.status]

  const updated = { ...task, status: nextStatus }

  await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`
    },
    body: JSON.stringify(updated)
  })

  fetchTasks()
}

// Logica para cambiar prioridad
const togglePriority = async (task: Task) => {
  const nextPriority = {
    low: 'medium',
    medium: 'high',
    high: 'low'
  }[task.priority]

  const updated = { ...task, priority: nextPriority }

  await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`
    },
    body: JSON.stringify(updated)
  })

  fetchTasks()
}


onMounted(fetchTasks)
</script>

<style scoped>
.masonry-grid {
  column-count: 1;
  column-gap: 16px;
}

@media (min-width: 600px) {
  .masonry-grid {
    column-count: 2;
  }
}

@media (min-width: 960px) {
  .masonry-grid {
    column-count: 3;
  }
}

@media (min-width: 1280px) {
  .masonry-grid {
    column-count: 3;
  }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 16px;
}
</style>