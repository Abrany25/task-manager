<template>
  <v-container class="fill-height d-flex justify-center align-center" style="height: 100vh">
    <v-card class="pa-4" width="100%" max-width="400">
      <v-card-title class="text-h6">Iniciar Sesión</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <v-text-field v-model="username" label="Usuario" required density="comfortable" variant="outlined"/>
          <v-text-field v-model="password" label="Contraseña" type="password" required density="comfortable" variant="outlined"/>
          <v-col>
          <v-btn type="submit" color="primary" :loading="loading" block>Entrar</v-btn><br>
          <v-btn color="secondary" @click="$router.push('/register')">¿No tienes cuenta? Regístrate</v-btn>
          </v-col>
          <v-expand-transition><v-alert v-if="error" type="error" class="mt-3">{{ error }}</v-alert></v-expand-transition>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const userStore = useUserStore()

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await userStore.login(username.value, password.value)
  } catch (err) {
    error.value = 'Usuario o contraseña incorrectos'
  } finally {
    loading.value = false
  }
}
</script>
