import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/',
    name: 'Home',
    component: TaskList,
    meta: { requiresAuth: true }
  },
  {
  path: '/new',
  name: 'NewTask',
  component: TaskForm
  },
  {
  path: '/task/:id',
  name: 'TaskDetail',
  component: TaskDetail
  },
  {
  path: '/dashboard',
  name: 'Dashboard',
  component: DashboardView,
  },
  {
  path: '/register',
  name: 'Register',
  component: RegisterView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

import { useUserStore } from '../stores/user'
import TaskList from '../components/TaskList.vue'
import LoginView from '../views/LoginView.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskDetail from '../views/TaskDetail.vue'
import DashboardView from '../views/DashboardView.vue'
import RegisterView from '../views/RegisterView.vue'

router.beforeEach((to, _from, next) => {
  const user = useUserStore()

  // Rutas protegidas
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !user.isAuthenticated) {
    return next('/login')
  }

  if (to.path === '/login' && user.isAuthenticated) {
    return next('/')
  }
  next()
})
