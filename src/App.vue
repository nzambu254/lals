<template>
  <div id="app">
    <!-- Loading state -->
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
    </div>

    <!-- Authenticated layout -->
    <div v-else-if="isAuthenticated" class="app-layout">
      <!-- Top Navigation Bar -->
      <nav class="top-nav">
        <div class="nav-content">
          <div class="nav-left">
            <h1>GeoLearn System</h1>
          </div>
          <div class="nav-right">
            <span class="user-email">{{ currentUserEmail }}</span>
            <button @click="handleLogout" class="logout-btn">Logout</button>
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

    <!-- Unauthenticated layout -->
    <router-view v-else />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Sidebar from '@/components/Sidebar.vue';

const router = useRouter();
const loading = ref(true);
const currentUser = ref(null);

// Check authentication state
const isAuthenticated = computed(() => currentUser.value !== null);
const currentUserEmail = computed(() => currentUser.value?.email || '');
const isAdmin = computed(() => currentUserEmail.value === 'alvn4407@gmail.com');

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
    loading.value = false;
  });
});

// Logout function
const handleLogout = async () => {
  try {
    await signOut(auth);
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>

<style scoped>
/* Layout styles */
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
  margin-left: 250px; /* Same as sidebar width */
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
  max-width: 1200px;
  margin: 0 auto;
}

.nav-left h1 {
  font-size: 1.2rem;
  color: #2d3748;
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
    margin-left: 70px; /* Collapsed sidebar width */
  }
}
</style>