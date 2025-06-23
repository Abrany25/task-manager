import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

import { useUserStore } from '../stores/user'

router.beforeEach((to, _from, next) => {
  const user = useUserStore()

  // Rutas protegidas
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !user.isAuthenticated) {
    return next('/login')
  }

  next()
})
