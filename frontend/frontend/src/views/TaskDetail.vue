<template>
  <v-container class="fill-height d-flex justify-center align-center pa-4" style="min-height: 100vh">
    <v-card
      class="pa-6 d-flex flex-column"
      elevation="4"
      rounded="xl"
      max-width="600"
      style="width: 100%; max-height: 95vh; overflow-y: auto"
      v-if="task"
    >
      <v-card-title class="text-h6 font-weight-bold mb-2">
        Editar tarea
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSave" ref="formRef" v-model="valid">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                label="Título"
                prepend-inner-icon="mdi-pencil"
                density="comfortable"
                variant="outlined"
                v-model="task.title"
                required
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                label="Descripción"
                prepend-inner-icon="mdi-text"
                density="comfortable"
                variant="outlined"
                v-model="task.description"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                label="Estado"
                v-model="task.status"
                :items="[
                  { title: 'Pendiente', value: 'pending' },
                  { title: 'En progreso', value: 'in_progress' },
                  { title: 'Completada', value: 'completed' }
                ]"
                item-title="title"
                item-value="value"
                density="comfortable"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                label="Prioridad"
                v-model="task.priority"
                :items="[
                  { title: 'Baja', value: 'low' },
                  { title: 'Media', value: 'medium' },
                  { title: 'Alta', value: 'high' }
                ]"
                item-title="title"
                item-value="value"
                density="comfortable"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Fecha límite"
                type="date"
                v-model="task.due_date"
                density="comfortable"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" class="d-flex flex-column gap-2 mt-2">
              <v-btn type="submit" color="primary" block size="large" rounded :loading="loading">
                Guardar
              </v-btn><br>

              <v-btn color="error" variant="tonal" block size="large" rounded @click="handleDelete">
                Eliminar
              </v-btn><br>

              <v-btn text color="secondary" block rounded @click="emit('close')">
                Cancelar
              </v-btn><br>

              <v-alert v-if="error" type="error" variant="tonal" class="mt-3">
                {{ error }}
              </v-alert>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue'
//import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const props = defineProps<{ taskId: number | null }>()
const emit = defineEmits(['close'])

//const router = useRouter()
const user = useUserStore()

const task = ref<any>(null)
const error = ref('')
const loading = ref(false)
const valid = ref(false)
const formRef = ref()

const fetchTask = async () => {
  if (!props.taskId) return
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/tasks/${props.taskId}/`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })

    if (!response.ok) throw new Error('No se pudo cargar la tarea')
    task.value = await response.json()
  } catch (err: any) {
    error.value = err.message
  }
}

const handleSave = async () => {
  loading.value = true
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/tasks/${props.taskId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(task.value)
    })

    if (!response.ok) throw new Error('Error al guardar cambios')
    emit('close')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('¿Seguro que quieres eliminar esta tarea?')) return

  loading.value = true
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/tasks/${props.taskId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })

    if (!response.ok) throw new Error('Error al eliminar tarea')
    emit('close')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

watch(() => props.taskId, () => {
  if (props.taskId) fetchTask()
}, { immediate: true })
</script>

