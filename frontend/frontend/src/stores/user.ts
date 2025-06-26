import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const isAuthenticated = ref<boolean>(!!token.value)
  const username = ref<string | null>(null)

  if (token.value) {
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      username.value = payload.username
    } catch {
      username.value = null
    }
  }

  const login = async (usernameInput: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password })
      })

      if (!response.ok) {
        throw new Error('Credenciales inválidas')
      }

      const data = await response.json()
      token.value = data.access
      refreshToken.value = data.refresh

      localStorage.setItem('token', data.access)
      localStorage.setItem('refreshToken', data.refresh)

      isAuthenticated.value = true

      const payload = JSON.parse(atob(data.access.split('.')[1]))
      username.value = payload.username

      router.push('/')
    } catch (error) {
      console.error(error)
      throw error
    }
  }

// Función para refrescar el access token
  const refreshAccessToken = async () => {
    if (!refreshToken.value) {
      logout()
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken.value })
      })

      if (!response.ok) {
        throw new Error('Refresh token inválido')
      }

      const data = await response.json()
      token.value = data.access
      localStorage.setItem('token', data.access)

      const payload = JSON.parse(atob(data.access.split('.')[1]))
      username.value = payload.username
    } catch (error) {
      console.error('Error al refrescar token:', error)
      logout()
    }
  }

  const logout = () => {
    token.value = null
    refreshToken.value = null
    isAuthenticated.value = false
    username.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    router.push('/login')
  }

  setInterval(() => {
    if (isAuthenticated.value) {
      refreshAccessToken()
    }
  }, 4 * 60 * 1000)

  return { token, refreshToken, isAuthenticated, username, login, logout }
})
