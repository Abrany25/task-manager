<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Gestor de Tareas</v-app-bar-title>

      <!-- Mostrar controles solo si está autenticado y no en páginas públicas -->
      <template v-if="isAuthenticated && !isPublicRoute">
        <v-spacer />

        <span class="mr-4">Bienvenido, {{ username }}</span>

        <v-btn icon @click="$router.push('/')">
          <v-icon>mdi-home</v-icon>
        </v-btn>

        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { computed } from 'vue'

const route = useRoute()

const { isAuthenticated, username, logout } = useUserStore()

const isPublicRoute = computed(() =>
  ['/login', '/register'].includes(route.path)
)
</script>
