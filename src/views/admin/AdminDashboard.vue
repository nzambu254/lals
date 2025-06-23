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
        <button class="action-btn" @click="navigateTo('/admin/users')">
          <span class="action-icon">👥</span>
          <span>Manage Users</span>
        </button>
        <button class="action-btn" @click="navigateTo('/admin/content')">
          <span class="action-icon">📄</span>
          <span>Create Content</span>
        </button>
        <button class="action-btn" @click="navigateTo('/admin/training')">
          <span class="action-icon">🎓</span>
          <span>Add Program</span>
        </button>
        <button class="action-btn" @click="navigateTo('/admin/assignments')">
          <span class="action-icon">📋</span>
          <span>Assignments</span>
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
  router.push(route);
};
</script>

<style scoped>
.admin-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #2d3748;
  text-align: center;
}

/* Summary Cards */
.dashboard-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e2e8f0;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.summary-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.summary-icon .icon {
  font-size: 28px;
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
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-content p {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
}

/* Dashboard Sections */
.dashboard-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  margin-bottom: 30px;
  border: 1px solid #e2e8f0;
  width: 100%;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #2d3748;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f7fafc;
  transition: background-color 0.2s;
}

.activity-item:hover {
  background-color: #edf2f7;
}

.activity-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.activity-icon .icon {
  font-size: 20px;
  color: #4a5568;
}

.activity-details {
  flex: 1;
}

.activity-message {
  margin: 0 0 5px 0;
  font-size: 15px;
  font-weight: 500;
  color: #2d3748;
}

.activity-time {
  margin: 0;
  font-size: 13px;
  color: #718096;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.action-btn {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 120px;
}

.action-btn:hover {
  background: #ebf8ff;
  border-color: #3182ce;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(49, 130, 206, 0.15);
}

.action-btn span:last-child {
  margin-top: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
}

.action-icon {
  font-size: 24px;
  color: #3182ce;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-summary {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .summary-card {
    padding: 20px;
  }
  
  .dashboard-section {
    padding: 20px;
  }
  
  .page-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .quick-actions {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .action-btn {
    min-height: 100px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .dashboard-summary {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .summary-card {
    flex-direction: column;
    text-align: center;
  }
  
  .summary-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }
}
</style>