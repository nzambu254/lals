<template>
  <div class="simulation-tasks">
    <h1>Simulation Tasks</h1>
    
    <div class="task-categories">
      <button 
        v-for="category in categories" 
        :key="category.id"
        :class="{ active: activeCategory === category.id }"
        @click="activeCategory = category.id"
      >
        {{ category.name }}
      </button>
    </div>

    <div class="task-list">
      <div v-for="task in filteredTasks" :key="task.id" class="task-card">
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <button class="start-btn">Start Task</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeCategory = ref('all')
const categories = ref([
  { id: 'all', name: 'All Tasks' },
  { id: 'distance', name: 'Distance Calculation' },
  { id: 'business', name: 'Business Simulation' }
])

const tasks = ref([
  { id: 1, title: 'Route Optimization', description: 'Find the shortest path between points', category: 'distance' },
  { id: 2, title: 'Market Analysis', description: 'Analyze current market trends', category: 'business' }
])

const filteredTasks = computed(() => {
  return activeCategory.value === 'all' 
    ? tasks.value 
    : tasks.value.filter(task => task.category === activeCategory.value)
})
</script>

<style scoped>
.simulation-tasks {
  padding: 20px;
}

.task-categories {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.task-categories button {
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.task-categories button.active {
  background: #3498db;
  color: white;
}

.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.task-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-card h3 {
  margin: 0 0 10px 0;
}

.task-card p {
  margin: 0 0 15px 0;
  color: #666;
}

.start-btn {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>