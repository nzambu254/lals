<template>
  <div class="feedback-messages">
    <h1>Feedback & Messages</h1>
    
    <div class="messages-container">
      <div class="messages-sidebar">
        <div 
          v-for="message in messages" 
          :key="message.id"
          :class="{ active: activeMessage === message.id }"
          @click="activeMessage = message.id"
        >
          <h4>{{ message.sender }}</h4>
          <p class="preview">{{ message.preview }}</p>
          <p class="time">{{ message.time }}</p>
        </div>
      </div>
      
      <div class="message-content" v-if="activeMessageContent">
        <h2>{{ activeMessageContent.sender }}</h2>
        <p class="time">{{ activeMessageContent.time }}</p>
        <div class="message-body">
          {{ activeMessageContent.body }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeMessage = ref(1)
const messages = ref([
  { 
    id: 1,
    sender: 'Professor Johnson',
    preview: 'Your last assignment was well done...',
    time: '10:30 AM',
    body: 'Your last assignment demonstrated excellent understanding of the distance calculation concepts. I particularly liked your approach to problem #3. Keep up the good work!'
  },
  { 
    id: 2,
    sender: 'System Notification',
    preview: 'New simulation available...',
    time: 'Yesterday',
    body: 'A new business simulation "Market Analysis 2023" is now available in your dashboard. The deadline for submission is June 30th.'
  }
])

const activeMessageContent = computed(() => {
  return messages.value.find(m => m.id === activeMessage.value)
})
</script>

<style scoped>
.feedback-messages {
  padding: 20px;
  height: calc(100vh - 60px);
}

.messages-container {
  display: flex;
  height: 100%;
  margin-top: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.messages-sidebar {
  width: 300px;
  border-right: 1px solid #eee;
  overflow-y: auto;
}

.messages-sidebar > div {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.messages-sidebar > div:hover {
  background: #f9f9f9;
}

.messages-sidebar > div.active {
  background: #ebf5fb;
}

.messages-sidebar h4 {
  margin: 0 0 5px 0;
}

.messages-sidebar .preview {
  margin: 0 0 5px 0;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.messages-sidebar .time {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.message-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.message-content h2 {
  margin: 0 0 5px 0;
}

.message-content .time {
  margin: 0 0 20px 0;
  color: #999;
}

.message-body {
  line-height: 1.6;
}
</style>