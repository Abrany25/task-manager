import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref<boolean>(!!token.value)

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        throw new Error('Credenciales inválidas')
      }

      const data = await response.json()
      token.value = data.access
      localStorage.setItem('token', data.access)
      isAuthenticated.value = true

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

  return { token, isAuthenticated, login, logout }
})
