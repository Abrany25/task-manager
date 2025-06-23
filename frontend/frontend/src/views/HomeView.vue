<template>
  <v-container>
    <h1>Bienvenido</h1>
    <v-btn color="error" @click="logout">Cerrar sesión</v-btn>
    <v-btn color="primary" class="mb-4" @click="$router.push('/new')">Crear nueva tarea</v-btn>
    <TaskList />
  </v-container>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import TaskList from '../components/TaskList.vue'
const { logout } = useUserStore()
</script>
