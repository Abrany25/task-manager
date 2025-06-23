<template>
  <v-container>
    <h1>Bienvenido</h1>
    <v-btn color="error" @click="logout">Cerrar sesión</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'

const { logout } = useUserStore()
</script>
