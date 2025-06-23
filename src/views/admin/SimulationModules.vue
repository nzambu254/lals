<template>
  <div class="admin-container">
    <h1 class="page-title">Simulation Modules</h1>
    <div class="card">
      <div class="card-header">
        <h3>Available Simulations</h3>
      </div>
      <div class="card-body">
        <div class="simulation-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id" 
            :class="{ 'active': activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
        <div class="simulation-content">
          <div v-if="activeTab === 'assignments'">
            <h4>Assignment Module</h4>
            <p>Manage corrective-based practices.</p>
          </div>
          <div v-if="activeTab === 'distance'">
            <h4>Distance Calculation</h4>
            <p>Compare spatial relationships.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const tabs = [
  { id: 'assignments', name: 'Assignment Module' },
  { id: 'distance', name: 'Distance Calculation' },
];

const activeTab = ref('assignments');
</script>

<style scoped>
.simulation-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.simulation-tabs button {
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
}

.simulation-tabs button.active {
  background: #ebf8ff;
  color: #3182ce;
  font-weight: 500;
}

.simulation-content {
  padding: 12px 0;
}

.simulation-content h4 {
  margin: 0 0 8px 0;
  color: #2d3748;
}

.simulation-content p {
  margin: 0;
  color: #718096;
}
</style>