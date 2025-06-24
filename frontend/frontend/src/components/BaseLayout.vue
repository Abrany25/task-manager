<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Gestor de Tareas</v-app-bar-title>

      <v-spacer />

      <v-btn icon @click="$router.push('/dashboard')">
        <v-icon>mdi-chart-bar</v-icon>
      </v-btn>

      <v-btn icon @click="$router.push('/')">
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
const { logout } = useUserStore()
</script>
