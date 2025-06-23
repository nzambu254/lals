<template>
  <div class="admin-container">
    <h1 class="page-title">Program Training</h1>
    <div class="card">
      <div class="card-header">
        <h3>Training Programs</h3>
        <button class="btn-primary">New Program</button>
      </div>
      <div class="card-body">
        <div class="program-grid">
          <div v-for="program in programs" :key="program.id" class="program-card">
            <h4>{{ program.name }}</h4>
            <p>{{ program.description }}</p>
            <div class="program-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const programs = [
  { id: 1, name: "Health Training", description: "Basic health practices" },
  { id: 2, name: "Digital Innovation", description: "Latest tech trends" },
];
</script>

<style scoped>
.program-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.program-card {
  background: #f7fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.program-card h4 {
  margin: 0 0 8px 0;
  color: #2d3748;
}

.program-card p {
  margin: 0;
  color: #718096;
  font-size: 14px;
}

.program-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style>