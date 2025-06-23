<template>
  <div class="admin-container">
    <h1 class="page-title">Content Creation</h1>
    <div class="card">
      <div class="card-header">
        <h3>Create New Content</h3>
      </div>
      <div class="card-body">
        <form class="content-form">
          <div class="form-group">
            <label>Title</label>
            <input type="text" v-model="content.title" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="content.description"></textarea>
          </div>
          <div class="form-group">
            <label>Type</label>
            <select v-model="content.type">
              <option value="business">Business</option>
              <option value="simulation">Simulation</option>
              <option value="politics">Politics</option>
            </select>
          </div>
          <button type="submit" class="btn-primary">Save Content</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const content = ref({
  title: '',
  description: '',
  type: 'business',
});
</script>

<style scoped>
.content-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #4a5568;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}
</style>