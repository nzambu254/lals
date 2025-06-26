<template>
  <div class="simulation-tasks">
    <h1>Longitudes & Latitudes Learning System: Simulation Tasks</h1>

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
        <!-- Added @click event to start the simulation -->
        <button class="start-btn" @click="startSimulation(task.id)">Start Task</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter for navigation

const router = useRouter(); // Initialize router

const activeCategory = ref('all');
const categories = ref([
  { id: 'all', name: 'All L&L Tasks' },
  { id: 'fundamental', name: 'Fundamentals' },
  { id: 'great-circle', name: 'Great Circle Distances' },
  { id: 'small-circle', name: 'Small Circle Distances' },
  { id: 'shortest-longest', name: 'Shortest/Longest Paths' }
]);

const tasks = ref([
  { id: 101, title: 'Identify Coordinates', description: 'Practice identifying latitude and longitude for given points.', category: 'fundamental' },
  // Removed: { id: 102, title: 'Calculate Angular Differences', description: 'Determine latitude and longitude differences between two points.', category: 'fundamental' },
  { id: 201, title: 'Distance Along a Meridian (NM)', description: 'Calculate distance in nautical miles between points on the same longitude.', category: 'great-circle' },
  // Removed: { id: 202, title: 'Distance Along Equator (KM)', description: 'Calculate distance in kilometers between points on the Equator.', category: 'great-circle' },
  { id: 203, title: 'Great Circle Distance (Haversine)', description: 'Use the Haversine formula to find the shortest distance between any two points.', category: 'great-circle' },
  { id: 301, title: 'Distance Along a Parallel (NM)', description: 'Calculate distance in nautical miles along a specific parallel of latitude.', category: 'small-circle' },
  // Removed: { id: 302, title: 'Distance Along a Parallel (KM)', description: 'Calculate distance in kilometers along a specific parallel of latitude.', category: 'small-circle' },
  // Removed: { id: 401, title: 'Compare Shortest vs. Parallel Paths', description: 'Analyze when a great circle path is shorter than a path along a parallel of latitude.', category: 'shortest-longest' },
  // Removed: { id: 402, title: 'Antipodal Points Distance', description: 'Calculate distance between points exactly opposite each other on the globe.', category: 'shortest-longest' }
]);

const filteredTasks = computed(() => {
  return activeCategory.value === 'all'
    ? tasks.value
    : tasks.value.filter(task => task.category === activeCategory.value);
});

// Function to start a simulation task
const startSimulation = (taskId) => {
  // Here, you would navigate to the specific simulation page
  // For example, using Vue Router:
  router.push(`/simulation/${taskId}`);
  // You might also want to display a message or load the simulation content
  console.log(`Starting simulation for task ID: ${taskId}`);
};
</script>

<style scoped>
/* Scoped CSS remains mostly the same, with minor adjustments */
.simulation-tasks {
  padding: 20px;
  max-width: 1200px; /* Adjust max-width for better layout */
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.2em;
  font-weight: 600;
}

.task-categories {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
  justify-content: center;
  gap: 12px;
  margin: 20px 0 40px;
  padding: 10px;
  background-color: #e9ecef;
  border-radius: 8px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.08);
}

.task-categories button {
  padding: 10px 20px;
  background: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 25px; /* More rounded buttons */
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  color: #495057;
  transition: all 0.3s ease;
  min-width: 150px; /* Ensure buttons have a minimum width */
}

.task-categories button:hover {
  background: #e0f7fa;
  border-color: #007bff;
  color: #0056b3;
}

.task-categories button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
  box-shadow: 0 2px 5px rgba(0, 123, 255, 0.3);
  transform: translateY(-2px); /* Slight lift effect */
}

.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); /* Slightly wider cards */
  gap: 25px; /* More space between cards */
}

.task-card {
  background: #ffffff;
  border-radius: 12px; /* More rounded card corners */
  padding: 25px; /* More padding */
  box-shadow: 0 6px 12px rgba(0,0,0,0.08); /* More pronounced shadow */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Push button to bottom */
}

.task-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.task-card h3 {
  margin: 0 0 12px 0;
  color: #34495e;
  font-size: 1.4em;
  font-weight: 600;
}

.task-card p {
  margin: 0 0 20px 0;
  color: #6c757d;
  line-height: 1.7;
  flex-grow: 1; /* Allow description to take available space */
}

.start-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 25px; /* Larger button */
  border-radius: 30px; /* Pill-shaped button */
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
  align-self: flex-start; /* Align button to the start (left) */
}

.start-btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .task-categories button {
    min-width: unset; /* Remove min-width on smaller screens */
    width: 100%; /* Make buttons full width */
  }

  .task-list {
    grid-template-columns: 1fr; /* Single column on small screens */
  }

  .simulation-tasks {
    padding: 15px;
  }
}
</style>
