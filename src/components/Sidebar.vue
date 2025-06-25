<template>
  <div class="sidebar-container">
    <!-- Sidebar -->
    <aside 
      class="sidebar"
      :class="{ 'sidebar-collapsed': !isSidebarOpen }"
    >
      <!-- Header -->
      <div class="sidebar-header">
        <h2>{{ isAdmin ? 'Admin Panel' : 'Student Portal' }}</h2>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        <!-- Admin Links -->
        <template v-if="isAdmin">
          <div class="nav-section">
            <router-link to="/admin/dashboard" class="nav-link">
              <span class="nav-icon">📊</span>
              <span>Admin Dashboard</span>
            </router-link>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">Management</h3>
            <router-link to="/admin/users" class="nav-link">
              <span class="nav-icon">👥</span>
              <span>User Management</span>
            </router-link>
            <router-link to="/admin/content" class="nav-link">
              <span class="nav-icon">📄</span>
              <span>Content Creation</span>
            </router-link>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">Simulation</h3>
            <router-link to="/admin/simulations" class="nav-link">
              <span class="nav-icon">🔬</span>
              <span>Simulation Modules</span>
            </router-link>
          </div>
        </template>

        <!-- Student Links -->
        <template v-else>
          <div class="nav-section">
            <router-link to="/student/dashboard" class="nav-link">
              <span class="nav-icon">🏠</span>
              <span>Dashboard</span>
            </router-link>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">Learning</h3>
            <router-link to="/student/visualization" class="nav-link">
              <span class="nav-icon">📊</span>
              <span>Visualization Module</span>
            </router-link>
            <router-link to="/student/simulations" class="nav-link">
              <span class="nav-icon">🔬</span>
              <span>Simulation Tasks</span>
            </router-link>
            <router-link to="/student/distance-calculation" class="nav-link">
              <span class="nav-icon">📏</span>
              <span>Distance Calculation</span>
            </router-link>
            <router-link to="/student/interactive-quizzes" class="nav-link">
              <span class="nav-icon">🎯</span>
              <span>Interactive Quizzes</span>
            </router-link>
          </div>
        </template>
      </nav>

      <!-- Footer (Toggle Sidebar + Logout) -->
      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-button" title="Logout">
          <span class="logout-icon">🚪</span>
          <span v-if="isSidebarOpen">Logout</span>
        </button>
        <button @click="toggleSidebar" class="toggle-button" title="Toggle Sidebar">
          <span class="toggle-icon">{{ isSidebarOpen ? '◀' : '▶' }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content" :class="{ 'expanded': !isSidebarOpen }">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';

const props = defineProps({
  isAdmin: { type: Boolean, default: false },
});

const router = useRouter();
const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    // Redirect to login
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>

<style scoped>
.sidebar-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 270px;
  background-color: #ffffff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.sidebar-collapsed {
  width: 70px;
  overflow: hidden;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #2d3748;
  white-space: nowrap;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 10px 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 15px;
}

.nav-section-title {
  padding: 8px 20px;
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: #4a5568;
  text-decoration: none;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.nav-link:hover {
  background-color: #edf2f7;
}

.nav-link.router-link-active {
  background-color: #ebf8ff;
  color: #3182ce;
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  flex-shrink: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Footer */
.sidebar-footer {
  padding: 10px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.logout-button,
.toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  font-size: 0.9rem;
}

.logout-button:hover,
.toggle-button:hover {
  background-color: #edf2f7;
}

.logout-button:hover {
  color: #e53e3e;
}

.logout-icon,
.toggle-icon {
  width: 20px;
  height: 20px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 20px;
  margin-left: 270px;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
}

.main-content.expanded {
  margin-left: 70px;
}

/* Responsive design */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .main-content.expanded {
    margin-left: 0;
  }
}

/* Collapsed sidebar adjustments */
.sidebar-collapsed .nav-section-title {
  display: none;
}

.sidebar-collapsed .nav-link span:not(.nav-icon) {
  display: none;
}

.sidebar-collapsed .logout-button span:not(.logout-icon) {
  display: none;
}
</style>