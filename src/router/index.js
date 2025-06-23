import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import AdminLayout from '@/layouts/AdminLayout.vue'
import StudentLayout from '@/layouts/StudentLayout.vue'

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
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { 
        path: '', 
        redirect: 'dashboard' 
      },
      { 
        path: 'dashboard', 
        name: 'AdminDashboard', 
        component: AdminDashboard 
      },
      { 
        path: 'users', 
        name: 'UserManagement', 
        component: UserManagement 
      },
      { 
        path: 'content', 
        name: 'ContentCreation', 
        component: ContentCreation 
      },
      { 
        path: 'training', 
        name: 'ProgramTraining', 
        component: ProgramTraining 
      },
      { 
        path: 'simulations', 
        name: 'SimulationModules', 
        component: SimulationModules 
      },
      { 
        path: 'analytics', 
        name: 'SystemAnalytics', 
        component: SystemAnalytics 
      }
    ]
  },

  // Student Routes
  {
    path: '/student',
    component: StudentLayout,
    meta: { requiresAuth: true, role: 'student' },
    children: [
      { 
        path: '', 
        redirect: 'dashboard' 
      },
      { 
        path: 'dashboard', 
        name: 'StudentDashboard', 
        component: StudentDashboard 
      },
      { 
        path: 'simulations', 
        name: 'SimulationTasks', 
        component: SimulationTasks 
      },
      { 
        path: 'forum', 
        name: 'CollaborationForum', 
        component: CollaborationForum 
      },
      { 
        path: 'feedback', 
        name: 'FeedbackMessages', 
        component: FeedbackMessages 
      },
      { 
        path: 'settings', 
        name: 'StudentSettings', 
        component: StudentSettings 
      }
    ]
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state if not already loaded
  if (!authStore.initialized) {
    await authStore.init()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } 
  else if (to.meta.requiresAuth && to.meta.role !== (authStore.isAdmin ? 'admin' : 'student')) {
    next(authStore.isAdmin ? '/admin/dashboard' : '/student/dashboard')
  } 
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next(authStore.isAdmin ? '/admin/dashboard' : '/student/dashboard')
  }
  else {
    next()
  }
})

export default router