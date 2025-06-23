<template>
  <div class="admin-container">
    <h1 class="page-title">System Analytics</h1>
    <div class="analytics-grid">
      <div class="metric-card">
        <h3>Total Users</h3>
        <p class="metric-value">1,234</p>
      </div>
      <div class="metric-card">
        <h3>Active Simulations</h3>
        <p class="metric-value">42</p>
      </div>
      <div class="chart-card">
        <h3>User Activity</h3>
        <div class="chart-placeholder"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.metric-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.metric-card h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #4a5568;
}

.metric-value {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
}

.chart-card {
  grid-column: span 2;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-placeholder {
  height: 200px;
  background: #f7fafc;
  border: 1px dashed #cbd5e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
}
</style>