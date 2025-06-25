import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'

// Admin Components
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import UserManagement from '@/views/admin/UserManagement.vue'
import ContentCreation from '@/views/admin/ContentCreation.vue'
import SimulationModules from '@/views/admin/SimulationModules.vue'

// Student Components
import StudentDashboard from '@/views/student/StudentDashboard.vue'
import SimulationTasks from '@/views/student/SimulationTasks.vue'
import VisualizationModule from '@/views/student/VisualizationModule.vue'
import DistanceCalculation from '@/views/student/DistanceCalculation.vue'
import InteractiveQuizzes from '@/views/student/InteractiveQuizzes.vue'

// Shared Components
import Login from '@/views/auth/Login.vue'
import NotFound from '@/views/NotFound.vue'
import Landing from '@/views/Landing.vue'

// Helper function to get user role from Firestore
const getUserRole = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().role : 'student';
  } catch (err) {
    console.error("Error getting user role:", err);
    return 'student';
  }
};

// Promise to wait for auth state
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

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
    path: '/admin/simulations',
    name: 'SimulationModules',
    component: SimulationModules,
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
    path: '/student/visualization',
    name: 'VisualizationModule',
    component: VisualizationModule,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/distance-calculation',
    name: 'DistanceCalculation',
    component: DistanceCalculation,
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/interactive-quizzes',
    name: 'InteractiveQuizzes',
    component: InteractiveQuizzes,
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

// Enhanced route guard with proper Firebase auth checking
router.beforeEach(async (to, from, next) => {
  try {
    // Wait for Firebase auth to initialize
    const currentUser = await getCurrentUser();
    
    if (to.meta.requiresAuth) {
      // Route requires authentication
      if (!currentUser) {
        console.log('No authenticated user, redirecting to login');
        return next('/login');
      }
      
      // Check role-based access
      if (to.meta.role) {
        const userRole = await getUserRole(currentUser.uid);
        
        if (to.meta.role !== userRole) {
          console.log(`Role mismatch. Required: ${to.meta.role}, User: ${userRole}`);
          // Redirect to appropriate dashboard based on user's actual role
          const redirectPath = userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard';
          return next(redirectPath);
        }
      }
    } else if (to.meta.requiresGuest) {
      // Route requires no authentication (login, landing page)
      if (currentUser) {
        console.log('User already authenticated, redirecting to dashboard');
        const userRole = await getUserRole(currentUser.uid);
        const redirectPath = userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard';
        return next(redirectPath);
      }
    }
    
    next();
  } catch (error) {
    console.error('Router guard error:', error);
    // If there's an error with auth, redirect to login for protected routes
    if (to.meta.requiresAuth) {
      next('/login');
    } else {
      next();
    }
  }
});

export default router