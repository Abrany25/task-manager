import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
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
      localStorage.setItem('token', data.access)
      isAuthenticated.value = true

      const payload = JSON.parse(atob(data.access.split('.')[1]))
      username.value = payload.username

      router.push('/')
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const logout = () => {
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
    router.push('/login')
  }

  return { token, isAuthenticated, username, login, logout}
})
