<template>
  <div class="collaboration-forum">
    <h1>Discussion Forum</h1>
    
    <div class="forum-actions">
      <input type="text" placeholder="Search discussions..." class="search-input">
      <button class="new-topic-btn">New Topic</button>
    </div>

    <div class="topics-list">
      <div v-for="topic in topics" :key="topic.id" class="topic-card">
        <div class="topic-info">
          <h3>{{ topic.title }}</h3>
          <p class="author">Posted by {{ topic.author }} • {{ topic.date }}</p>
          <p class="preview">{{ topic.preview }}</p>
        </div>
        <div class="topic-stats">
          <span>💬 {{ topic.replies }}</span>
          <span>👁️ {{ topic.views }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const topics = ref([
  { 
    id: 1,
    title: 'Distance Calculation Best Practices',
    author: 'Dr. Smith',
    date: '2 days ago',
    preview: 'Here are some tips for accurate distance measurements...',
    replies: 8,
    views: 42
  },
  { 
    id: 2,
    title: 'Business Simulation Question',
    author: 'Jane Doe',
    date: '1 week ago',
    preview: 'Has anyone completed the market analysis task?...',
    replies: 15,
    views: 87
  }
])
</script>

<style scoped>
.collaboration-forum {
  padding: 20px;
}

.forum-actions {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  gap: 15px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.new-topic-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.topic-card {
  display: flex;
  justify-content: space-between;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.topic-info {
  flex: 1;
}

.topic-info h3 {
  margin: 0 0 5px 0;
}

.author {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
}

.preview {
  margin: 0;
  color: #333;
}

.topic-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  color: #666;
  font-size: 14px;
}
</style>