<template>
  <v-container>
    <v-card class="pa-4" max-width="600" elevation="2">
      <v-card-title>Crear nueva tarea</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit" ref="formRef" v-model="valid">
          <v-text-field
            label="Título"
            v-model="title"
            :rules="[v => !!v || 'El título es obligatorio']"
            required
          />
          <v-textarea
            label="Descripción"
            v-model="description"
            auto-grow
          />
          <v-select
            label="Estado"
            v-model="status"
            :items="['pending', 'in_progress', 'completed']"
            required
          />
          <v-select
            label="Prioridad"
            v-model="priority"
            :items="['low', 'medium', 'high']"
            required
          />
          <v-text-field
            label="Fecha de vencimiento"
            v-model="dueDate"
            type="date"
            required
          />

          <v-btn type="submit" color="primary" :loading="loading" class="mt-3" block>
            Guardar
          </v-btn>
          <v-btn text color="secondary" class="mt-2" block @click="$router.push('/')">
            Cancelar
          </v-btn>
          <v-alert v-if="error" type="error" class="mt-3">{{ error }}</v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import router from '../router'

const title = ref('')
const description = ref('')
const dueDate = ref('')
const status = ref('pending')
const priority = ref('medium')

const loading = ref(false)
const error = ref('')
const valid = ref(false)
const formRef = ref()

const user = useUserStore()

const handleSubmit = async () => {
  const isValid = await formRef.value?.validate()
  if (!isValid) return

  loading.value = true
  error.value = ''

  try {
    const response = await fetch('http://127.0.0.1:8000/api/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        title: title.value,
        description: description.value,
        due_date: dueDate.value,
        status: status.value,
        priority: priority.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
        console.error('Error:', data)
        throw new Error(data.detail || JSON.stringify(data))
    }

    // Redirigir a home después de crear la tarea
    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Error desconocido'
  } finally {
    loading.value = false
  }
}
</script>
