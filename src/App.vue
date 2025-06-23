<template>
  <div id="app">
    <!-- Loading state -->
    <div v-if="auth.loading" class="loading-spinner">
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
          <div class="nav-left">
            <h1>GeoLearn System</h1>
          </div>
          <div class="nav-right">
            <span class="user-email">{{ auth.currentUserEmail }}</span>
            <button @click="auth.logout" class="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      <!-- Main Content with Fixed Sidebar -->
      <div class="main-container">
        <Sidebar :isAdmin="auth.isAdmin" />
        <div class="content-wrapper">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Sidebar from '@/components/Sidebar.vue';

const auth = useAuthStore();
const route = useRoute();

// Check if current route is a guest page (landing or login)
const isGuestPage = computed(() => {
  const guestRoutes = ['/', '/login', 'Home', 'Login'];
  return guestRoutes.includes(route.path) || guestRoutes.includes(route.name);
});

onMounted(async () => {
  await auth.init();
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
  margin-left: 40px; /* Same as sidebar width */
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