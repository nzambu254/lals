<template>
  <div class="student-dashboard">
    <h1>Welcome Back, {{ userName }}!</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Active Assignments</h3>
        <p class="value">5</p>
      </div>
      <div class="stat-card">
        <h3>Completed Simulations</h3>
        <p class="value">12</p>
      </div>
    </div>

    <div class="upcoming-section">
      <h2>Upcoming Deadlines</h2>
      <ul class="deadline-list">
        <li v-for="item in deadlines" :key="item.id">
          <span class="task">{{ item.task }}</span>
          <span class="due-date">{{ item.dueDate }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const userName = ref('Alex Johnson')
const deadlines = ref([
  { id: 1, task: 'Distance Calculation Quiz', dueDate: 'Tomorrow' },
  { id: 2, task: 'Business Simulation', dueDate: 'Jun 30' }
])
</script>

<style scoped>
.student-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-card h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #666;
}

.stat-card .value {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}

.upcoming-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.deadline-list {
  list-style: none;
  padding: 0;
  margin: 15px 0 0 0;
}

.deadline-list li {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.deadline-list li:last-child {
  border-bottom: none;
}

.task {
  font-weight: 500;
}

.due-date {
  color: #e74c3c;
  font-weight: bold;
}
</style>