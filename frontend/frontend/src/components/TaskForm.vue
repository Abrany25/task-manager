<template>
  <v-container
    class="fill-height d-flex justify-center align-center pa-4"
    style="min-height: 100vh"
  >
    <v-card
      class="pa-6 d-flex flex-column"
      elevation="4"
      rounded="xl"
      max-width="600"
      style="width: 100%; max-height: 95vh; overflow-y: auto"
    >
      <v-card-title class="text-h6 font-weight-bold mb-2">
        Crear nueva tarea
      </v-card-title>

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
                prepend-inner-icon="mdi-text"
                density="comfortable"
                variant="outlined"
                v-model="description"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                label="Estado"
                v-model="status"
                :items="[
                  { title: 'Pendiente', value: 'pending' },
                  { title: 'En progreso', value: 'in_progress' },
                  { title: 'Completada', value: 'completed' }
                ]"
                item-title="title"
                item-value="value"
                density="comfortable"
                variant="outlined"
                required
              />

            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                label="Prioridad"
                v-model="priority"
                :items="[
                  { title: 'Baja', value: 'low' },
                  { title: 'Media', value: 'medium' },
                  { title: 'Alta', value: 'high' }
                ]"
                item-title="title"
                item-value="value"
                density="comfortable"
                variant="outlined"
                required
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Fecha límite"
                type="date"
                v-model="dueDate"
                density="comfortable"
                variant="outlined"
                required
              />
            </v-col>

            <v-col cols="12" class="d-flex flex-column gap-2 mt-2">
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                rounded
              >
                Guardar
              </v-btn><br>

              <v-btn
                text
                color="secondary"
                block
                size="large"
                rounded
                @click="emit('close')"
              >
                Cancelar
              </v-btn>

              <v-alert
                v-if="error"
                type="error"
                class="mt-3"
                variant="tonal"
              >
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
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
//import router from '../router'

const title = ref('')
const description = ref('')
const dueDate = ref('')
const status = ref('pending')
const priority = ref('medium')

const loading = ref(false)
const error = ref('')
const valid = ref(false)
const formRef = ref()

const emit = defineEmits(['close'])


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

    emit('close')//cerrar el modal
  } catch (err: any) {
    error.value = err.message || 'Error desconocido'
  } finally {
    loading.value = false
  }
}

</script>
