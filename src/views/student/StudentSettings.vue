<template>
  <div class="student-settings">
    <h1>Account Settings</h1>
    
    <div class="settings-card">
      <h2>Profile Information</h2>
      <form @submit.prevent="saveProfile">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" v-model="profile.name">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="profile.email">
        </div>
        <button type="submit" class="save-btn">Save Changes</button>
      </form>
    </div>

    <div class="settings-card">
      <h2>Password</h2>
      <form @submit.prevent="changePassword">
        <div class="form-group">
          <label>Current Password</label>
          <input type="password" v-model="password.current">
        </div>
        <div class="form-group">
          <label>New Password</label>
          <input type="password" v-model="password.new">
        </div>
        <button type="submit" class="save-btn">Update Password</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const profile = ref({
  name: 'Alex Johnson',
  email: 'alex@student.edu'
})

const password = ref({
  current: '',
  new: ''
})

const saveProfile = () => {
  alert('Profile updated successfully!')
}

const changePassword = () => {
  alert('Password changed successfully!')
  password.value = { current: '', new: '' }
}
</script>

<style scoped>
.student-settings {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.settings-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.settings-card h2 {
  margin: 0 0 20px 0;
  font-size: 18px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.save-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>