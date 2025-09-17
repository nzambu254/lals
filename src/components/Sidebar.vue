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
              <span>Dashboard</span>
            </router-link>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">Management</h3>
            <router-link to="/admin/users" class="nav-link">
              <span class="nav-icon">👥</span>
              <span>User Management</span>
            </router-link>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">Reports</h3>
            <router-link to="/admin/quiz-reports" class="nav-link">
              <span class="nav-icon">📝</span>
              <span>Quiz Reports</span>
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
            <router-link to="/student/interactive-quizzes" class="nav-link">
              <span class="nav-icon">🎯</span>
              <span>Interactive Quizzes</span>
            </router-link>
            <router-link to="/student/flashcards" class="nav-link">
              <span class="nav-icon">📇</span>
              <span>Flashcards</span>
            </router-link>
          </div>
        </template>

        <!-- Notifications Section (Common for both) -->
        <div class="nav-section">
          <h3 class="nav-section-title">Notifications</h3>
          <router-link 
            :to="isAdmin ? '/admin/notifications' : '/student/notifications'" 
            class="nav-link"
          >
            <span class="nav-icon">🔔</span>
            <span>Notifications</span>
            <span v-if="unreadCount > 0" class="notification-badge">
              {{ unreadCount }}
            </span>
          </router-link>
        </div>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { db } from '@/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const props = defineProps({
  isAdmin: { type: Boolean, default: false },
});

const router = useRouter();
const isSidebarOpen = ref(true);
const unreadCount = ref(0);
let unsubscribeNotifications = null;

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Fetch notifications count
onMounted(async () => {
  const user = auth.currentUser;
  if (!user) return;

  const notificationsRef = collection(db, 'notifications');
  const q = query(
    notificationsRef,
    where('recipientId', '==', user.uid),
    where('read', '==', false)
  );

  unsubscribeNotifications = onSnapshot(q, (snapshot) => {
    unreadCount.value = snapshot.size;
  });
});

onUnmounted(() => {
  if (unsubscribeNotifications) {
    unsubscribeNotifications();
  }
});
</script>

<style scoped>
.sidebar-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: linear-gradient(to bottom, #2c3e50, #3498db);
  color: white;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
}

.sidebar-collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 20px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  white-space: nowrap;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 15px 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 10px;
}

.nav-section-title {
  padding: 8px 15px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border-left-color: #fff;
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

.notification-badge {
  background-color: #e74c3c;
  color: white;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  margin-left: auto;
  padding: 0 5px;
}

/* Footer */
.sidebar-footer {
  padding: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.logout-button,
.toggle-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 0.9rem;
}

.logout-button:hover,
.toggle-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
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
  margin-left: 250px;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content.expanded {
  margin-left: 70px;
}

/* Collapsed sidebar adjustments */
.sidebar-collapsed .nav-section-title,
.sidebar-collapsed .nav-link span:not(.nav-icon),
.sidebar-collapsed .logout-button span:not(.logout-icon) {
  display: none;
}

.sidebar-collapsed .notification-badge {
  position: absolute;
  top: 5px;
  right: 5px;
}

/* Responsive design */
@media (max-width: 768px) {
  .sidebar {
    width: 250px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
    padding: 15px;
  }
  
  .main-content.expanded {
    margin-left: 0;
  }
  
  .sidebar-collapsed {
    width: 70px;
  }
}
</style>