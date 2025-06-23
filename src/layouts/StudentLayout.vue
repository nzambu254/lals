<template>
  <div class="student-layout">
    <Sidebar :isAdmin="false" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped>
.student-layout {
  display: flex;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 20px;
}
</style>