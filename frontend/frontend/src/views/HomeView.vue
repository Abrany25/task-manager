<template>
  <v-container>
    <h1>Bienvenido</h1>
    <v-btn color="error" @click="logout">Cerrar sesión</v-btn>
  </v-container>
  <TaskList />
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import TaskList from '../components/TaskList.vue'
const { logout } = useUserStore()
</script>
