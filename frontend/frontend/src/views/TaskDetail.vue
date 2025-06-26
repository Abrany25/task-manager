<template>
  <v-container>
    <v-card class="pa-4" max-width="600" elevation="2" v-if="task">
      <v-card-title>Editar Tarea</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSave" ref="formRef" v-model="valid">
          <v-text-field label="Título" v-model="task.title" required />
          <v-textarea label="Descripción" v-model="task.description" />
          <v-select
            label="Estado"
            v-model="task.status"
            :items="['pending', 'in_progress', 'completed']"
          />
          <v-select
            label="Prioridad"
            v-model="task.priority"
            :items="['low', 'medium', 'high']"
          />
          <v-text-field label="Fecha de vencimiento" v-model="task.due_date" type="date" />

          <v-btn type="submit" color="primary" class="mt-3" :loading="loading">Guardar</v-btn>
          <v-btn color="error" class="mt-3 ml-2" @click="handleDelete">Eliminar</v-btn>
          <v-btn text color="secondary" class="mt-3" block @click="$router.push('/')">Cancelar</v-btn>
          <v-alert v-if="error" type="error" class="mt-3">{{ error }}</v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const user = useUserStore()

const task = ref<any>(null)
const error = ref('')
const loading = ref(false)
const valid = ref(false)
const formRef = ref()

const fetchTask = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/tasks/${route.params.id}/`, {
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
    const response = await fetch(`http://127.0.0.1:8000/api/tasks/${route.params.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(task.value)
    })

    if (!response.ok) throw new Error('Error al guardar cambios')
    router.push('/')
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
    const response = await fetch(`http://127.0.0.1:8000/api/tasks/${route.params.id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })

    if (!response.ok) throw new Error('Error al eliminar tarea')
    router.push('/')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchTask)

</script>
