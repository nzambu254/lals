<template>
  <div class="admin-container">
    <h1 class="page-title">Admin Dashboard</h1>
    
    <!-- Summary Cards -->
    <div class="dashboard-summary">
      <div class="summary-card">
        <div class="summary-icon users-icon">
          <span class="icon">👥</span>
        </div>
        <div class="summary-content">
          <h3>Total Users</h3>
          <p>1,024</p>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon content-icon">
          <span class="icon">📄</span>
        </div>
        <div class="summary-content">
          <h3>Content Items</h3>
          <p>256</p>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon training-icon">
          <span class="icon">🎓</span>
        </div>
        <div class="summary-content">
          <h3>Active Programs</h3>
          <p>18</p>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon simulation-icon">
          <span class="icon">🎮</span>
        </div>
        <div class="summary-content">
          <h3>Simulations</h3>
          <p>42</p>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="dashboard-section">
      <h2 class="section-title">Recent Activity</h2>
      <div class="activity-list">
        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
          <div class="activity-icon">
            <span class="icon">{{ getActivityIcon(activity.type) }}</span>
          </div>
          <div class="activity-details">
            <p class="activity-message">{{ activity.message }}</p>
            <p class="activity-time">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="dashboard-section">
      <h2 class="section-title">Quick Actions</h2>
      <div class="quick-actions">
        <button class="action-btn" @click="navigateTo('users')">
          <span class="action-icon">👥</span>
          <span>Manage Users</span>
        </button>
        <button class="action-btn" @click="navigateTo('content')">
          <span class="action-icon">📄</span>
          <span>Create Content</span>
        </button>
        <button class="action-btn" @click="navigateTo('training')">
          <span class="action-icon">🎓</span>
          <span>Add Program</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const recentActivities = [
  { id: 1, type: 'user', message: 'New user "Alex Johnson" registered', time: '10 mins ago' },
  { id: 2, type: 'content', message: '"Business Fundamentals" content updated', time: '25 mins ago' },
  { id: 3, type: 'training', message: 'New program "Digital Innovation 101" added', time: '1 hour ago' },
  { id: 4, type: 'simulation', message: 'Distance calculation simulation completed', time: '2 hours ago' }
];

const getActivityIcon = (type) => {
  const icons = {
    user: '👤',
    content: '📝',
    training: '🎓',
    simulation: '🎮',
    analytics: '📊'
  };
  return icons[type] || '📄';
};

const navigateTo = (route) => {
  router.push(`/admin/${route}`);
};
</script>

<style scoped>
.admin-container {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #2d3748;
}

/* Summary Cards */
.dashboard-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.summary-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.summary-icon .icon {
  font-size: 24px;
}

.users-icon {
  background-color: #ebf8ff;
  color: #3182ce;
}

.content-icon {
  background-color: #fff5f5;
  color: #f56565;
}

.training-icon {
  background-color: #fefcbf;
  color: #d69e2e;
}

.simulation-icon {
  background-color: #ebfaf1;
  color: #38a169;
}

.summary-content h3 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #718096;
}

.summary-content p {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
}

/* Dashboard Sections */
.dashboard-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  margin: 0 0 15px 0;
  color: #2d3748;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.activity-icon .icon {
  font-size: 18px;
  color: #4a5568;
}

.activity-details {
  flex: 1;
}

.activity-message {
  margin: 0 0 3px 0;
  font-size: 14px;
  color: #2d3748;
}

.activity-time {
  margin: 0;
  font-size: 12px;
  color: #718096;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.action-btn {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #ebf8ff;
  border-color: #bee3f8;
}

.action-btn span:last-child {
  margin-top: 8px;
  font-size: 13px;
  color: #4a5568;
}

.action-icon {
  font-size: 20px;
  color: #3182ce;
}
</style>