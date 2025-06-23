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
            <router-link to="/users" class="nav-link">
              <span class="nav-icon">👥</span>
              <span>User Management</span>
            </router-link>
            <router-link to="/content" class="nav-link">
              <span class="nav-icon">📄</span>
              <span>Content Creation</span>
            </router-link>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">Training</h3>
            <router-link to="/training" class="nav-link">
              <span class="nav-icon">🎓</span>
              <span>Program Training</span>
            </router-link>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">Simulation</h3>
            <router-link to="/simulation/assignments" class="nav-link">
              <span class="nav-icon">📋</span>
              <span>Assignment Module</span>
            </router-link>
            <router-link to="/simulation/distance" class="nav-link">
              <span class="nav-icon">📏</span>
              <span>Distance Calculation</span>
            </router-link>
          </div>
        </template>

        <!-- Student Links -->
        <template v-else>
          <div class="nav-section">
            <router-link to="/dashboard" class="nav-link">
              <span class="nav-icon">🏠</span>
              <span>Dashboard</span>
            </router-link>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">Simulation</h3>
            <router-link to="/tasks/distance" class="nav-link">
              <span class="nav-icon">📏</span>
              <span>Distance Calculation</span>
            </router-link>
            <router-link to="/tasks/interaction" class="nav-link">
              <span class="nav-icon">🖱️</span>
              <span>Interaction Output</span>
            </router-link>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">Collaboration</h3>
            <router-link to="/forum" class="nav-link">
              <span class="nav-icon">💬</span>
              <span>Discussion Forum</span>
            </router-link>
          </div>
        </template>
      </nav>

      <!-- Footer (Toggle Sidebar) -->
      <div class="sidebar-footer">
        <button @click="toggleSidebar" class="toggle-button">
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

const props = defineProps({
  isAdmin: { type: Boolean, default: false },
});

const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<style scoped>

/* Sidebar */
.sidebar {
  width: 270px;
  background-color: #ffffff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
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
  justify-content: flex-end;
}

.toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.toggle-button:hover {
  background-color: #edf2f7;
}

.toggle-icon {
  width: 20px;
  height: 20px;
  color: #4a5568;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 20px;
  transition: margin-left 0.3s ease;
  margin-left: 50px;
}

.main-content.expanded {
  margin-left: 50px;
}

/* Responsive design */
@media (max-width: 600px) {
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
}
</style>