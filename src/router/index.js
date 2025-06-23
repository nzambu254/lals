 import { createRouter, createWebHistory } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

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

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Landing,
    meta: { hideSidebar: true, requiresGuest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { hideSidebar: true, requiresGuest: true }
  },

  // Admin
  {
    path: '/admin',
    component: Sidebar,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'users', name: 'UserManagement', component: UserManagement },
      { path: 'content', name: 'ContentCreation', component: ContentCreation },
      { path: 'training', name: 'ProgramTraining', component: ProgramTraining },
      { path: 'simulations', name: 'SimulationModules', component: SimulationModules },
      { path: 'analytics', name: 'SystemAnalytics', component: SystemAnalytics }
    ]
  },

  // Student
  {
    path: '/student',
    component: Sidebar,
    meta: { requiresAuth: true, role: 'student' },
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', name: 'StudentDashboard', component: StudentDashboard },
      { path: 'simulations', name: 'SimulationTasks', component: SimulationTasks },
      { path: 'forum', name: 'CollaborationForum', component: CollaborationForum },
      { path: 'feedback', name: 'FeedbackMessages', component: FeedbackMessages },
      { path: 'settings', name: 'StudentSettings', component: StudentSettings }
    ]
  },

  // Default redirect
  {
    path: '/',
    redirect: '/login'
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

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken')
  const userRole = localStorage.getItem('userRole')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAuth && to.meta.role !== userRole) {
    next(userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard')
  } else {
    next()
  }
})

export default router