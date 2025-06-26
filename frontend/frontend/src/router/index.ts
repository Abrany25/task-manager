import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
  path: '/new',
  name: 'NewTask',
  component: () => import('../components/TaskForm.vue')
  },
  {
  path: '/task/:id',
  name: 'TaskDetail',
  component: () => import('../views/TaskDetail.vue')
  },
  {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('../views/DashboardView.vue')
  },
  {
  path: '/register',
  name: 'Register',
  component: () => import('../views/RegisterView.vue')
  },
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
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !user.isAuthenticated) {
    return next('/login')
  }

  next()
})
