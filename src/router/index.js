import { createRouter, createWebHistory } from 'vue-router'

// Admin Components
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import UserManagement from '@/views/admin/UserManagement.vue'
import ContentCreation from '@/views/admin/ContentCreation.vue'
import ProgramTraining from '@/views/admin/ProgramTraining.vue'
import SimulationModules from '@/views/admin/SimulationModules.vue'
import SystemAnalytics from '@/views/admin/SystemAnalytics.vue'

// Student Components
import StudentDashboard from '@/views/student/StudentDashboard.vue'
import SimulationTasks from '@/views/student/SimulationTasks.vue'
import CollaborationForum from '@/views/student/CollaborationForum.vue'
import FeedbackMessages from '@/views/student/FeedbackMessages.vue'
import StudentSettings from '@/views/student/StudentSettings.vue'

// Shared Components
import Login from '@/views/auth/Login.vue'
import NotFound from '@/views/NotFound.vue'
import Landing from '@/views/Landing.vue'

// Basic route definitions
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Landing,
    meta: { requiresGuest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },

  // Admin Routes
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/content',
    name: 'ContentCreation',
    component: ContentCreation,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/training',
    name: 'ProgramTraining',
    component: ProgramTraining,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/simulations',
    name: 'SimulationModules',
    component: SimulationModules,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/analytics',
    name: 'SystemAnalytics',
    component: SystemAnalytics,
    meta: { requiresAuth: true, role: 'admin' }
  },

  // Student Routes
  {
    path: '/student',
    redirect: '/student/dashboard',
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/dashboard',
    name: 'StudentDashboard',
    component: StudentDashboard,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/simulations',
    name: 'SimulationTasks',
    component: SimulationTasks,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/forum',
    name: 'CollaborationForum',
    component: CollaborationForum,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/feedback',
    name: 'FeedbackMessages',
    component: FeedbackMessages,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/settings',
    name: 'StudentSettings',
    component: StudentSettings,
    meta: { requiresAuth: true, role: 'student' }
  },

  // Catch-all route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// TEMPORARY basic auth check logic using localStorage or hardcoded role
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user') // use Firebase in real app
  const userRole = localStorage.getItem('role') || 'student' // example fallback

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next('/login')
    }
    if (to.meta.role && to.meta.role !== userRole) {
      return next(userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard')
    }
  } else if (to.meta.requiresGuest && isAuthenticated) {
    return next(userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard')
  }

  next()
})

export default router
