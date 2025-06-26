
<template>
  <v-row class="mb-4">
    <v-col cols="12" sm="4">
      <v-btn color="primary" block class="mb-2" size="large" @click="$router.push('/new')">
        <v-icon start>mdi-plus</v-icon>
          Crear nueva tarea
      </v-btn>
    </v-col>
    <v-col cols="12" sm="4">
      <v-btn color="secondary" block class="mb-4" size="large" @click="$router.push('/dashboard')">
        <v-icon start>mdi-chart-box</v-icon>
          Ver dashboard
      </v-btn>
    </v-col>
    <v-col cols="12" sm="4">
      <v-btn color="error" block class="mb-4" size="large" @click="logout">
        <v-icon start>mdi-logout</v-icon>
          Cerrar sesión
      </v-btn>
    </v-col>
  </v-row>

  <TaskList />
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import TaskList from '../components/TaskList.vue'
const { logout } = useUserStore()
</script>
