<template>
  <v-container class="">
    <v-card class="pa-4" max-width="600" elevation="2">
      <v-card-title>Crear nueva tarea</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit" ref="formRef" v-model="valid">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                label="Título"
                prepend-inner-icon="mdi-pencil"
                density="comfortable"
                variant="outlined"
                v-model="title"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Descripción"
                prepend-inner-icon="mdi-pencil"
                density="comfortable"
                variant="outlined"
                v-model="description"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-select label="Estado" :items="['pending','in_progress','completed']" v-model="status" required density="comfortable"
                variant="outlined"/>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select label="Prioridad" :items="['low','medium','high']" v-model="priority" required density="comfortable"
                variant="outlined"/>
            </v-col>

            <v-col cols="12">
              <v-text-field label="Fecha límite" v-model="dueDate" type="date" required density="comfortable"
                variant="outlined"/>
            </v-col>
          </v-row>

          <v-btn color="primary" type="submit" block>Guardar</v-btn>
          <v-btn text color="secondary" class="mt-2" block @click="$router.push('/')">Cancelar</v-btn>
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
