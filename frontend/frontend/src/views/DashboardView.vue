<template>
  <v-container>
    <h2 class="text-h5 mb-4">Dashboard</h2>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
            <v-card-title>Estado de tareas</v-card-title>
                <v-card-text style="height: 300px;">
                    <Bar v-if="statusData" :data="statusData" :options="chartOptions" />
                    <v-skeleton-loader v-else type="card" />
                </v-card-text>
            </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
            <v-card-title>Completadas vs Pendientes</v-card-title>
                <v-card-text style="height: 300px;">
                    <Doughnut v-if="completionData" :data="completionData" :options="chartOptions" />
                    <v-skeleton-loader v-else type="card" />
                </v-card-text>
            </v-card>
      </v-col>

      <v-col cols="12">
        <v-card>
          <v-card-title>Tareas próximas a vencer</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="task in upcomingTasks"
                :key="task.id"
                :title="task.title"
                :subtitle="`Vence el: ${task.due_date}`"
              />
              <v-alert v-if="upcomingTasks.length === 0" type="info">No hay tareas próximas</v-alert>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale)

const user = useUserStore()
const statusData = ref()
const completionData = ref()
const upcomingTasks = ref<any[]>([])

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const fetchStats = async () => {
  const headers = {
    Authorization: `Bearer ${user.token}`
  }

  // 1. Status
  const res1 = await fetch('http://127.0.0.1:8000/api/dashboard/stats/', { headers })
  const status = await res1.json()
  statusData.value = {
    labels: Object.keys(status),
    datasets: [
      {
        label: 'Tareas por estado',
        data: Object.values(status),
        backgroundColor: ['#FDD835', '#29B6F6', '#66BB6A']
      }
    ]
  }

  // 2. Completadas vs pendientes
  const res2 = await fetch('http://127.0.0.1:8000/api/dashboard/completion/', { headers })
  const completion = await res2.json()
  completionData.value = {
    labels: ['Completadas', 'Pendientes'],
    datasets: [
      {
        data: [completion.completed, completion.pending],
        backgroundColor: ['#66BB6A', '#EF5350']
      }
    ]
  }

  // 3. Tareas próximas
  const res3 = await fetch('http://127.0.0.1:8000/api/dashboard/upcoming/', { headers })
  upcomingTasks.value = await res3.json()
}

onMounted(fetchStats)
</script>
