<template>
  <div class="notifications-container">
    <div class="notifications-header">
      <h1>Notifications</h1>
      <button 
        @click="showComposeModal = true" 
        class="compose-button"
      >
        Compose New
      </button>
    </div>

    <div class="notifications-tabs">
      <button 
        @click="activeTab = 'inbox'" 
        :class="{ active: activeTab === 'inbox' }"
      >
        Inbox ({{ unreadCount }})
      </button>
      <button 
        @click="activeTab = 'sent'" 
        :class="{ active: activeTab === 'sent' }"
      >
        Sent
      </button>
      <button 
        @click="activeTab = 'broadcast'" 
        :class="{ active: activeTab === 'broadcast' }"
      >
        Broadcasts
      </button>
    </div>

    <div class="notifications-list">
      <div v-if="loading" class="loading-spinner">
        Loading notifications...
      </div>
      
      <div v-else-if="filteredNotifications.length === 0" class="empty-state">
        No notifications found
      </div>

      <div 
        v-else 
        v-for="notification in filteredNotifications" 
        :key="notification.id"
        class="notification-item"
        :class="{ unread: !notification.read && activeTab === 'inbox' }"
        @click="markAsRead(notification)"
      >
        <div class="notification-header">
          <span class="sender">
            <span v-if="activeTab === 'inbox'">
              From: {{ notification.senderName || 'System' }}
            </span>
            <span v-else-if="activeTab === 'sent'">
              To: {{ getRecipientName(notification.recipientId) }}
            </span>
            <span v-else>
              Broadcast to all students
            </span>
          </span>
          <span class="date">
            {{ formatDate(notification.timestamp) }}
          </span>
        </div>
        <div class="notification-title">
          {{ notification.title }}
        </div>
        <div class="notification-message">
          {{ notification.message }}
        </div>
        <div v-if="activeTab === 'inbox'" class="notification-actions">
          <button 
            @click.stop="replyToNotification(notification)"
            class="action-button"
          >
            Reply
          </button>
        </div>
      </div>
    </div>

    <!-- Compose Modal -->
    <div v-if="showComposeModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Compose Notification</h2>
          <button @click="showComposeModal = false" class="close-button">
            &times;
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Notification Type</label>
            <select 
              v-model="notificationType" 
              class="form-select"
              @change="handleNotificationTypeChange"
            >
              <option value="single">Single Recipient</option>
              <option value="broadcast">Broadcast to All Students</option>
            </select>
          </div>
          
          <div v-if="notificationType === 'single'" class="form-group">
            <label>Recipient</label>
            <select v-model="newNotification.recipientId" class="form-select">
              <option value="">Select a recipient</option>
              <option 
                v-for="student in students" 
                :key="student.id" 
                :value="student.id"
              >
                {{ student.name }} (Student)
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Title</label>
            <input 
              v-model="newNotification.title" 
              type="text" 
              class="form-input"
              placeholder="Notification title"
            >
          </div>
          
          <div class="form-group">
            <label>Message</label>
            <textarea 
              v-model="newNotification.message" 
              class="form-textarea"
              placeholder="Type your message here..."
              rows="5"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showComposeModal = false" class="cancel-button">
            Cancel
          </button>
          <button @click="sendNotification" class="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { db } from '@/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { auth } from '@/firebase';

const activeTab = ref('inbox');
const loading = ref(true);
const notifications = ref([]);
const students = ref([]);
const unreadCount = ref(0);
const showComposeModal = ref(false);
const notificationType = ref('single');

const newNotification = ref({
  recipientId: '',
  title: '',
  message: ''
});

const currentUser = auth.currentUser;

const filteredNotifications = computed(() => {
  return notifications.value.filter(notification => {
    if (activeTab.value === 'inbox') {
      return notification.recipientId === currentUser.uid;
    } else if (activeTab.value === 'sent') {
      return notification.senderId === currentUser.uid && !notification.isBroadcast;
    } else {
      return notification.isBroadcast && notification.senderId === currentUser.uid;
    }
  }).sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
});

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString();
};

const getRecipientName = (recipientId) => {
  const student = students.value.find(s => s.id === recipientId);
  return student ? student.name : 'Unknown';
};

const fetchNotifications = async () => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('recipientId', '==', currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      notifications.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      unreadCount.value = notifications.value.filter(n => !n.read).length;
      loading.value = false;
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    loading.value = false;
  }
};

const fetchStudents = async () => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', 'student'));
    const snapshot = await getDocs(q);
    
    students.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching students:', error);
  }
};

const markAsRead = async (notification) => {
  if (notification.read || activeTab.value !== 'inbox') return;
  
  try {
    const notificationRef = doc(db, 'notifications', notification.id);
    await updateDoc(notificationRef, {
      read: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

const replyToNotification = (notification) => {
  showComposeModal.value = true;
  notificationType.value = 'single';
  newNotification.value = {
    recipientId: notification.senderId,
    title: `Re: ${notification.title}`,
    message: `\n\n------ Original Message ------\n${notification.message}`
  };
};

const handleNotificationTypeChange = () => {
  if (notificationType.value === 'broadcast') {
    newNotification.value.recipientId = '';
  }
};

const sendNotification = async () => {
  if ((notificationType.value === 'single' && !newNotification.value.recipientId) || 
      !newNotification.value.title || 
      !newNotification.value.message) {
    alert('Please fill all fields');
    return;
  }
  
  try {
    const notificationsRef = collection(db, 'notifications');
    
    if (notificationType.value === 'broadcast') {
      // Send to all students
      for (const student of students.value) {
        await addDoc(notificationsRef, {
          senderId: currentUser.uid,
          senderName: currentUser.displayName || 'Admin',
          recipientId: student.id,
          title: newNotification.value.title,
          message: newNotification.value.message,
          timestamp: serverTimestamp(),
          read: false,
          isBroadcast: true
        });
      }
    } else {
      // Single recipient
      await addDoc(notificationsRef, {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Admin',
        recipientId: newNotification.value.recipientId,
        title: newNotification.value.title,
        message: newNotification.value.message,
        timestamp: serverTimestamp(),
        read: false,
        isBroadcast: false
      });
    }
    
    showComposeModal.value = false;
    newNotification.value = {
      recipientId: '',
      title: '',
      message: ''
    };
    
    alert(notificationType.value === 'broadcast' 
      ? 'Broadcast sent successfully!' 
      : 'Notification sent successfully!');
  } catch (error) {
    console.error('Error sending notification:', error);
    alert('Failed to send notification');
  }
};

let unsubscribeNotifications = null;

onMounted(async () => {
  unsubscribeNotifications = await fetchNotifications();
  await fetchStudents();
});

onUnmounted(() => {
  if (unsubscribeNotifications) {
    unsubscribeNotifications();
  }
});
</script>

<style scoped>
.notifications-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.compose-button {
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.compose-button:hover {
  background-color: #3182ce;
}

.notifications-tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.notifications-tabs button {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: #718096;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.notifications-tabs button.active {
  color: #4299e1;
  border-bottom: 2px solid #4299e1;
}

.notifications-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.notification-item {
  padding: 16px;
  border-bottom: 1px solid #edf2f7;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item.unread {
  background-color: #ebf8ff;
}

.notification-item:hover {
  background-color: #f7fafc;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #718096;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #2d3748;
}

.notification-message {
  color: #4a5568;
  white-space: pre-line;
}

.notification-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.action-button {
  background-color: #e2e8f0;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #cbd5e0;
}

.loading-spinner, .empty-state {
  padding: 20px;
  text-align: center;
  color: #718096;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
}

.modal-body {
  padding: 16px;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.form-textarea {
  resize: vertical;
}

.cancel-button {
  background-color: #e2e8f0;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.send-button {
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #3182ce;
}
</style>