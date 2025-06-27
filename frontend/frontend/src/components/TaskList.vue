<template>
    <v-card class="mb-6 pa-4" elevation="2" rounded="lg">
      <v-row dense align="center" justify="center">
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="selectedStatus"
            :items="statusOptions"
            label="Estado"
            clearable
            density="comfortable"
            variant="outlined"
            prepend-icon="mdi-filter-outline"
          />
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="selectedPriority"
            :items="priorityOptions"
            label="Prioridad"
            clearable
            density="comfortable"
            variant="outlined"
            prepend-icon="mdi-filter-outline"
          />
        </v-col>

        <v-col cols="12" md="4" class="d-flex justify-center justify-md-end">
          <v-btn color="primary" @click="fetchTasks" size="large" rounded>
            Aplicar filtros
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

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
          class="task-card pa-3 mb-4"
          rounded="xl"
          elevation="3"
          :class="{ 'bg-green-lighten-4': task.status === 'completed' }"
          @click="openTaskDetail(task.id)"
        >
          <div class="d-flex justify-space-between align-center mb-2">
            <div class="flex-grow-1 pe-2">
              <h3 class="text-h6 font-weight-bold mb-1">{{ task.title }}</h3>
              <div class="text-body-2 text-grey-darken-1 mb-2">
                Estado: <strong>{{ statusLabels[task.status as keyof typeof statusLabels] }}</strong><br>
                Prioridad: <strong>{{ priorityLabels[task.priority as keyof typeof priorityLabels] }}</strong>
              </div>
            </div>
          </div>

          <v-card-text class="text-body-2 mb-2">
            {{ task.description }}
          </v-card-text>

          <v-card-actions class="d-flex flex-wrap justify-space-between align-center mt-2">
            <v-btn
              size="small"
              color="blue-darken-2"
              variant="tonal"
              rounded="lg"
              prepend-icon="mdi-swap-horizontal"
              @click.stop="toggleStatus(task)"
            >
              Estado
            </v-btn>

            <v-btn
              size="small"
              color="amber-darken-2"
              variant="tonal"
              rounded="lg"
              prepend-icon="mdi-arrow-up-bold"
              @click.stop="togglePriority(task)"
            >
              Prioridad
            </v-btn>

            <v-chip
              color="deep-purple-lighten-3"
              text-color="white"
              size="small"
              class="mt-2"
              label
            >
              <v-icon start icon="mdi-calendar-clock" class="me-1" />
              Vence: {{ task.due_date }}
            </v-chip>
          </v-card-actions>
        </v-card>
      </div>
    </div>

    <!--Solo mostramos TaskDetail como modal -->
    <v-dialog
      v-model="showTaskDetail"
      persistent
      max-width="600px"
      transition="dialog-transition"
    >
      <TaskDetail :task-id="editingTaskId" @close="closeTaskDetail" />
    </v-dialog>
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
//import { useRouter } from 'vue-router'
//import TaskForm from '../components/TaskForm.vue'
import TaskDetail from '../views/TaskDetail.vue'

//const showTaskForm = ref(false)
const showTaskDetail = ref(false)
const editingTaskId = ref<number | null>(null)

//const openTaskForm = (taskId: number | null = null) => {
  //editingTaskId.value = taskId
  //showTaskForm.value = true
//}

//const closeTaskForm = () => {
  //showTaskForm.value = false
  //editingTaskId.value = null
//}

const openTaskDetail = (taskId: number | null = null) => {
  editingTaskId.value = taskId
  showTaskDetail.value = true
}

const closeTaskDetail = () => {
  showTaskDetail.value = false
  editingTaskId.value = null
  fetchTasks()
}

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
//const router = useRouter()

const statusOptions = [
  { title: 'Pendiente', value: 'pending' },
  { title: 'En progreso', value: 'in_progress' },
  { title: 'Completada', value: 'completed' }
]

const priorityOptions = [
  { title: 'Baja', value: 'low' },
  { title: 'Media', value: 'medium' },
  { title: 'Alta', value: 'high' }
]

//inicializar las tareas
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

//const goToEdit = (id: number) => {
  //router.push(`/task/${id}`)
//}


onMounted(fetchTasks)
</script>

<style scoped>
.masonry-grid {
  column-count: 1;
  column-gap: 16px;
}

@media (min-width: 600px) {
  .masonry-grid {
    column-count: 1;
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

.v-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
}
.v-card-actions {
  flex-wrap: wrap;
  justify-content: space-between;
}
.task-card {
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}
::v-deep(.v-overlay__scrim) {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.9);
}
</style>