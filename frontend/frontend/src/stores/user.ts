import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const isAuthenticated = ref<boolean>(!!token.value)
  const username = ref<string | null>(null)

  // Decodificar token y extraer username
  const decodeToken = (access: string) => {
    try {
      const payload = JSON.parse(atob(access.split('.')[1]))
      username.value = payload.username
    } catch {
      username.value = null
    }
  }

  // Verifica si el token expiró
  const isTokenExpired = () => {
    if (!token.value) return true
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      return payload.exp < now
    } catch {
      return true
    }
  }

  // Login
  const login = async (usernameInput: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password })
      })

      if (!response.ok) throw new Error('Credenciales inválidas')

      const data = await response.json()
      token.value = data.access
      refreshToken.value = data.refresh
      localStorage.setItem('token', data.access)
      localStorage.setItem('refreshToken', data.refresh)
      isAuthenticated.value = true
      decodeToken(data.access)

      router.push('/')
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // Refrescar token si el actual expiró
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

      if (!response.ok) throw new Error('Refresh token inválido')

      const data = await response.json()
      token.value = data.access
      localStorage.setItem('token', data.access)
      decodeToken(data.access)
    } catch (error) {
      console.error('Error al refrescar token:', error)
      logout()
    }
  }

  // Cerrar sesión
  const logout = () => {
    token.value = null
    refreshToken.value = null
    isAuthenticated.value = false
    username.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    router.push('/login')
  }

  // Verificar expiración cada minuto y refrescar si es necesario
  setInterval(() => {
    if (isAuthenticated.value && isTokenExpired()) {
      refreshAccessToken()
    }
  }, 60 * 1000) // cada 1 minuto

  return {
    token,
    refreshToken,
    isAuthenticated,
    username,
    login,
    logout,
    refreshAccessToken,
    isTokenExpired
  }
})
