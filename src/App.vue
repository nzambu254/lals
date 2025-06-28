<template>
  <div id="app">
    <!-- Loading state -->
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
    </div>

    <!-- Guest pages (Landing and Login) without layout -->
    <div v-else-if="isGuestPage" class="guest-layout">
      <router-view />
    </div>

    <!-- Authenticated layout with navigation and sidebar -->
    <div v-else class="app-layout">
      <!-- Top Navigation Bar -->
      <nav class="top-nav">
        <div class="nav-content">
          <h1 class="system-title">Longitude & Latitude Learning System</h1>
          <div class="nav-right">
            <span class="user-email">{{ currentUserEmail }}</span>
            <span v-if="isAdmin" class="admin-badge">Admin</span>
            <button @click="logout" class="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      <!-- Main Content with Fixed Sidebar -->
      <div class="main-container">
        <Sidebar :isAdmin="isAdmin" />
        <div class="content-wrapper">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { auth, db } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Sidebar from '@/components/Sidebar.vue';

const router = useRouter();
const route = useRoute();

const user = ref(null);
const loading = ref(true);
const userRole = ref('user'); // Default role
const currentUserEmail = computed(() => user.value?.email || '');
const isAdmin = computed(() => userRole.value === 'admin');

const isGuestPage = computed(() => {
  const guestRoutes = ['/', '/login', 'Home', 'Login'];
  return guestRoutes.includes(route.path) || guestRoutes.includes(route.name);
});

// Get or create user profile in Firestore
const getUserProfile = async (user) => {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // User profile exists, get their role
      const userData = userDoc.data();
      return userData.role || 'user';
    } else {
      // New user, create profile with default 'user' role
      await setDoc(userDocRef, {
        email: user.email,
        role: 'user', // Default role for new users
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      
      return 'user';
    }
  } catch (error) {
    console.error('Error getting/creating user profile:', error);
    return 'user'; // Default to user role on error
  }
};

// Update last login timestamp
const updateLastLogin = async (user) => {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      lastLogin: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

const initAuth = () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      user.value = firebaseUser;
      
      if (firebaseUser) {
        // Get user role from Firestore
        userRole.value = await getUserProfile(firebaseUser);
        // Update last login
        await updateLastLogin(firebaseUser);
      } else {
        userRole.value = 'user';
      }
      
      loading.value = false;
      resolve();
    });
  });
};

const logout = async () => {
  try {
    await signOut(auth);
    user.value = null;
    userRole.value = 'user';
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

onMounted(async () => {
  await initAuth();
  if (!user.value && !isGuestPage.value) {
    router.push('/login');
  }
});
</script>

<style scoped>
/* Guest layout (full screen for landing/login) */
.guest-layout {
  min-height: 100vh;
  width: 100%;
}

/* Authenticated layout styles */
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-container {
  display: flex;
  flex: 1;
  margin-top: 60px; /* Account for top nav height */
}

.content-wrapper {
  flex: 1;
  padding: 20px;
  margin-left: 40px;
  background-color: #f5f7fa;
}

/* Top Navigation */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.system-title {
  font-size: 1.2rem;
  color: #2d3748;
  margin: 0;
  padding-left: 0;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-email {
  font-size: 0.9rem;
  color: #4a5568;
}

.admin-badge {
  background-color: #38a169;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.logout-btn {
  padding: 6px 12px;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c53030;
}

/* Loading spinner */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-wrapper {
    margin-left: 70px;
  }
}
</style>