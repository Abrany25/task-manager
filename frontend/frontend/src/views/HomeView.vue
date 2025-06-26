
<template>
  <v-row class="mb-4">
    <v-col cols="12" sm="4">
      <v-btn color="primary" block @click="$router.push('/new')">Nueva tarea</v-btn>
    </v-col>
    <v-col cols="12" sm="4">
      <v-btn color="secondary" block @click="$router.push('/dashboard')">Dashboard</v-btn>
    </v-col>
    <v-col cols="12" sm="4">
      <v-btn color="error" @click="logout, $router.push('/login')">Cerrar sesión</v-btn>
    </v-col>
  </v-row>

  <TaskList />
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import TaskList from '../components/TaskList.vue'
const { logout } = useUserStore()
</script>
