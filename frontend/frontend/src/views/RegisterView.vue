<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-card width="400" class="pa-4">
      <v-card-title class="text-h6">Crear cuenta</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleRegister">
          <v-text-field v-model="username" label="Usuario" required />
          <v-text-field v-model="email" label="Correo electrónico" />
          <v-text-field v-model="password" label="Contraseña" type="password" required />
          <v-btn type="submit" color="primary" :loading="loading" block>Registrar</v-btn>
          <v-alert v-if="error" type="error" class="mt-3">{{ error }}</v-alert>
          <v-alert v-if="success" type="success" class="mt-3">{{ success }}</v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '../router'

const username = ref('')
const password = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await fetch('http://127.0.0.1:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value, email: email.value })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(Object.values(data).join(' '))
    }

    success.value = 'Cuenta creada correctamente. Puedes iniciar sesión.'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err: any) {
    error.value = err.message || 'Error desconocido'
  } finally {
    loading.value = false
  }
}
</script>
