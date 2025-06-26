<template>
  <div class="admin-container">
    <h1 class="page-title">Simulation Modules Overview</h1>
    <div class="card">
      <div class="card-header">
        <h3>Available Longitudes & Latitudes Simulation Tasks</h3>
      </div>
      <div class="card-body">
        <div class="simulation-list">
          <div v-for="task in simulationTasks" :key="task.id" class="simulation-card">
            <h3>{{ task.title }}</h3>
            <p>{{ task.description }}</p>
            <span class="task-category">Category: {{ categoryName(task.category) }}</span>
            <button class="btn-view-details" @click="viewTaskDetails(task)">View Details</button>
          </div>
        </div>
        <div v-if="simulationTasks.length === 0" class="no-simulations-message">
          No simulation tasks are currently defined.
        </div>
      </div>
    </div>

    <!-- Task Details Display Section -->
    <div v-if="selectedTaskDetails" class="task-details-section">
      <h2>Details for: {{ selectedTaskDetails.title }}</h2>
      <div class="details-card">
        <h4>Description:</h4>
        <p>{{ selectedTaskDetails.description }}</p>
        <h4>Category:</h4>
        <p>{{ categoryName(selectedTaskDetails.category) }}</p>
        <h4>Task ID:</h4>
        <p>{{ selectedTaskDetails.id }}</p>
        <button class="btn-close-details" @click="closeDetails">Close Details</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter for potential navigation

const router = useRouter();

// Define the simulation tasks, mirroring the list used on the student side
const simulationTasks = ref([
  { id: 101, title: 'Identify Coordinates', description: 'Practice identifying latitude and longitude for given points.', category: 'fundamental' },
  { id: 201, title: 'Distance Along a Meridian (NM)', description: 'Calculate distance in nautical miles between points on the same longitude.', category: 'great-circle' },
  { id: 203, title: 'Great Circle Distance (Haversine)', description: 'Use the Haversine formula to find the shortest distance between any two points.', category: 'great-circle' },
  { id: 301, title: 'Distance Along a Parallel (NM)', description: 'Calculate distance in nautical miles along a specific parallel of latitude.', category: 'small-circle' },
]);

// Helper for displaying category names
const categoriesMap = {
  'fundamental': 'Fundamentals',
  'great-circle': 'Great Circle Distances',
  'small-circle': 'Small Circle Distances',
  'shortest-longest': 'Shortest/Longest Paths'
};

const categoryName = (categoryId) => {
  return categoriesMap[categoryId] || 'N/A';
};

// Reactive variable to store the details of the currently selected task
const selectedTaskDetails = ref(null);

// Function to handle viewing task details
const viewTaskDetails = (task) => {
  // Set the selectedTaskDetails to the clicked task's data
  selectedTaskDetails.value = task;
  console.log(`Admin viewing details for simulation task ID: ${task.id}`);
};

// Function to close the details section
const closeDetails = () => {
  selectedTaskDetails.value = null;
};
</script>

<style scoped>
.admin-container {
  padding: 30px;
  max-width: 1200px;
  margin: 30px auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.page-title {
  font-size: 2.5em;
  margin-bottom: 30px;
  color: #2d3748;
  text-align: center;
  font-weight: 700;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f7fafc;
}

.card-header h3 {
  margin: 0;
  font-size: 1.8em;
  color: #3182ce;
  font-weight: 600;
}

.card-body {
  padding: 25px;
}

.simulation-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.simulation-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #e0e0e0;
}

.simulation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.simulation-card h3 {
  margin: 0 0 12px 0;
  color: #34495e;
  font-size: 1.4em;
  font-weight: 600;
}

.simulation-card p {
  margin: 0 0 15px 0;
  color: #6c757d;
  line-height: 1.6;
  flex-grow: 1; /* Allows description to take available space */
}

.task-category {
  display: block;
  font-size: 0.9em;
  color: #007bff;
  font-weight: 500;
  margin-bottom: 15px;
}

.btn-view-details {
  background: #6c757d; /* A neutral grey for details button */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px; /* Pill shape */
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
  align-self: flex-start; /* Align button to the start (left) */
  margin-top: 10px;
}

.btn-view-details:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.no-simulations-message {
  text-align: center;
  padding: 20px;
  color: #718096;
  font-style: italic;
}

/* New Styles for Task Details Section */
.task-details-section {
  margin-top: 40px;
  padding: 30px;
  background-color: #e6f7ff; /* Light blue background */
  border-radius: 12px;
  border: 1px solid #b3e0ff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.task-details-section h2 {
  color: #007bff;
  font-size: 2em;
  margin-bottom: 25px;
  font-weight: 700;
}

.details-card {
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: left;
}

.details-card h4 {
  color: #34495e;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.2em;
  font-weight: 600;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.details-card p {
  margin-bottom: 15px;
  font-size: 1.05em;
  line-height: 1.6;
  color: #555;
}

.btn-close-details {
  background: #ef4444; /* Red button for closing */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 20px;
}

.btn-close-details:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .admin-container {
    padding: 15px;
  }
  .page-title {
    font-size: 2em;
  }
  .card-header h3 {
    font-size: 1.5em;
  }
  .simulation-list {
    grid-template-columns: 1fr; /* Single column on small screens */
    gap: 15px;
  }
  .simulation-card {
    padding: 20px;
  }
  .btn-view-details {
    padding: 8px 16px;
    font-size: 0.9em;
  }
  .task-details-section {
    padding: 20px;
  }
  .task-details-section h2 {
    font-size: 1.8em;
  }
  .details-card {
    padding: 15px;
  }
  .details-card p, .details-card h4 {
    font-size: 0.95em;
  }
}
</style>
