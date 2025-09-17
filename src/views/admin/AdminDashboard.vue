<template>
  <div class="admin-dashboard">
    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading dashboard data...</p>
    </div>

    <!-- Admin Header -->
    <header class="admin-header">
      <h1>Admin Dashboard</h1>
      <div class="admin-controls">
        <select v-model="timeRange" @change="filterData" class="filter-select">
          <option value="7">Last 7 days</option>
          <option value="30" selected>Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="all">All time</option>
        </select>
        <button @click="refreshData" :disabled="loading" class="refresh-btn">
          <span class="btn-icon">🔄</span> Refresh
        </button>
      </div>
    </header>

    <!-- Summary Stats -->
    <div class="summary-stats">
      <div class="summary-card">
        <div class="summary-icon">👥</div>
        <h3>Total Users</h3>
        <p>{{ summaryData.totalUsers }}</p>
        <small class="card-subtitle">Registered users</small>
      </div>
      <div class="summary-card">
        <div class="summary-icon">📚</div>
        <h3>Avg Flashcards</h3>
        <p>{{ summaryData.avgFlashcards }}</p>
        <small class="card-subtitle">Per user</small>
      </div>
      <div class="summary-card">
        <div class="summary-icon">✅</div>
        <h3>Completion Rate</h3>
        <p>{{ summaryData.avgCompletionRate }}%</p>
        <small class="card-subtitle">Average progress</small>
      </div>
      <div class="summary-card">
        <div class="summary-icon">📈</div>
        <h3>Active Users</h3>
        <p>{{ summaryData.activeUsers }}</p>
        <small class="card-subtitle">{{ getActiveUsersLabel() }}</small>
      </div>
    </div>

    <!-- Main Content -->
    <div class="admin-content">
      <!-- User Performance Table -->
      <div class="performance-section">
        <div class="section-header">
          <h2>User Performance Metrics</h2>
          <div class="search-box">
            <input 
              v-model="searchTerm" 
              @input="filterUsers"
              placeholder="Search users..." 
              class="search-input"
            >
            <span class="search-icon">🔍</span>
          </div>
        </div>
        
        <div class="table-container">
          <table class="performance-table">
            <thead>
              <tr>
                <th @click="sortUsers('email')" class="sortable">
                  Email 
                  <span class="sort-icon">{{ getSortIcon('email') }}</span>
                </th>
                <th @click="sortUsers('level')" class="sortable">
                  Level
                  <span class="sort-icon">{{ getSortIcon('level') }}</span>
                </th>
                <th @click="sortUsers('totalFlashcards')" class="sortable">
                  Flashcards
                  <span class="sort-icon">{{ getSortIcon('totalFlashcards') }}</span>
                </th>
                <th @click="sortUsers('completionRate')" class="sortable">
                  Progress
                  <span class="sort-icon">{{ getSortIcon('completionRate') }}</span>
                </th>
                <th>Difficult Numbers</th>
                <th @click="sortUsers('lastViewed')" class="sortable">
                  Last Active
                  <span class="sort-icon">{{ getSortIcon('lastViewed') }}</span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
                <td>
                  <div class="user-email">
                    <div class="user-avatar">{{ getUserInitials(user.email) }}</div>
                    {{ user.email }}
                  </div>
                </td>
                <td>
                  <span class="level-badge" :class="getLevelClass(user.level)">
                    {{ user.level }}
                  </span>
                </td>
                <td>
                  <div class="flashcard-count">
                    <span class="count">{{ user.totalFlashcards }}</span>
                    <span class="viewed">({{ user.viewedNumbers?.length || 0 }} viewed)</span>
                  </div>
                </td>
                <td>
                  <div class="progress-container">
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :style="{ width: user.completionRate + '%' }"
                      ></div>
                    </div>
                    <span class="progress-text">{{ user.completionRate }}%</span>
                  </div>
                </td>
                <td>
                  <div class="difficult-numbers">
                    <span v-if="user.difficultNumbers?.length" class="difficulty-count">
                      {{ user.difficultNumbers.length }} numbers
                    </span>
                    <span v-else class="no-difficulties">None</span>
                  </div>
                </td>
                <td>
                  <div class="last-active">
                    {{ formatDate(user.lastViewed) }}
                    <small class="time-ago">{{ getTimeAgo(user.lastViewed) }}</small>
                  </div>
                </td>
                <td>
                  <button @click="viewUserDetails(user)" class="action-btn view-btn">
                    <span>👁️</span> View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="filteredUsers.length === 0" class="no-data">
            <div class="no-data-icon">📊</div>
            <h3>No users found</h3>
            <p>Try adjusting your search or time filter</p>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <!-- User Activity Chart -->
        <div class="chart-card">
          <h3>User Activity Over Time</h3>
          <div class="chart-container">
            <div class="activity-chart">
              <div class="chart-bars">
                <div 
                  v-for="(day, index) in activityData" 
                  :key="index"
                  class="activity-bar"
                  :style="{ height: (day.count / maxActivity * 100) + '%' }"
                  :title="`${day.count} active users on ${day.label}`"
                >
                  <span class="bar-value">{{ day.count }}</span>
                </div>
              </div>
              <div class="chart-labels">
                <span v-for="day in activityData" :key="day.label">{{ day.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Level Distribution Chart -->
        <div class="chart-card">
          <h3>User Level Distribution</h3>
          <div class="chart-container">
            <div class="level-distribution">
              <div class="level-stats">
                <div 
                  v-for="level in levelDistribution" 
                  :key="level.name"
                  class="level-stat"
                  :class="level.name.toLowerCase()"
                >
                  <div class="level-circle" :style="{ width: (level.percentage * 2) + 'px', height: (level.percentage * 2) + 'px' }">
                    <span>{{ level.count }}</span>
                  </div>
                  <div class="level-info">
                    <h4>{{ level.name }}</h4>
                    <p>{{ level.percentage }}% ({{ level.count }} users)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Overview Chart -->
        <div class="chart-card full-width">
          <h3>Flashcard Progress Overview</h3>
          <div class="chart-container">
            <div class="progress-overview">
              <div class="progress-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ progressStats.totalFlashcards }}</span>
                  <span class="stat-label">Total Flashcards</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ progressStats.totalViewed }}</span>
                  <span class="stat-label">Cards Viewed</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ progressStats.difficultCount }}</span>
                  <span class="stat-label">Difficult Numbers</span>
                </div>
              </div>
              <div class="completion-chart">
                <div class="completion-rings">
                  <div 
                    class="completion-ring" 
                    :style="{ 
                      background: `conic-gradient(#4FACFE 0deg ${(progressStats.completionRate * 3.6)}deg, #e9ecef ${(progressStats.completionRate * 3.6)}deg 360deg)` 
                    }"
                  >
                    <div class="ring-center">
                      <span class="completion-percentage">{{ progressStats.completionRate }}%</span>
                      <span class="completion-label">Overall Completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <div v-if="selectedUser" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>User Details</h3>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="user-details">
            <div class="detail-section">
              <h4>Basic Information</h4>
              <p><strong>Email:</strong> {{ selectedUser.email }}</p>
              <p><strong>Level:</strong> <span class="level-badge" :class="getLevelClass(selectedUser.level)">{{ selectedUser.level }}</span></p>
              <p><strong>Joined:</strong> {{ formatDate(selectedUser.createdAt) }}</p>
              <p><strong>Last Active:</strong> {{ formatDate(selectedUser.lastViewed) }}</p>
            </div>
            
            <div class="detail-section">
              <h4>Progress Statistics</h4>
              <p><strong>Total Flashcards:</strong> {{ selectedUser.totalFlashcards }}</p>
              <p><strong>Viewed Numbers:</strong> {{ selectedUser.viewedNumbers?.length || 0 }}</p>
              <p><strong>Completion Rate:</strong> {{ selectedUser.completionRate }}%</p>
              <p><strong>Difficult Numbers:</strong> {{ selectedUser.difficultNumbers?.length || 0 }}</p>
            </div>
            
            <div class="detail-section" v-if="selectedUser.difficultNumbers?.length">
              <h4>Difficult Numbers</h4>
              <div class="difficult-numbers-list">
                <span 
                  v-for="num in selectedUser.difficultNumbers" 
                  :key="num" 
                  class="difficult-number"
                >
                  {{ num }}
                </span>
              </div>
            </div>
            
            <div class="detail-section" v-if="selectedUser.viewedNumbers?.length">
              <h4>Viewed Numbers (First 20)</h4>
              <div class="viewed-numbers-list">
                <span 
                  v-for="num in selectedUser.viewedNumbers.slice(0, 20)" 
                  :key="num" 
                  class="viewed-number"
                >
                  {{ num }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '@/firebase';
import { 
  collection, 
  query, 
  getDocs,
  orderBy // Added the missing import
} from 'firebase/firestore';
import { auth } from '@/firebase';

// Reactive data
const loading = ref(true)
const timeRange = ref('30')
const searchTerm = ref('')
const sortField = ref('lastViewed')
const sortDirection = ref('desc')
const selectedUser = ref(null)

const allUsers = ref([])
const filteredUsers = ref([])

// Computed properties
const summaryData = computed(() => {
  const users = filteredUsers.value
  const totalUsers = users.length
  const activeUsers = users.filter(user => isUserActive(user.lastViewed)).length
  const avgFlashcards = totalUsers > 0 ? Math.round(users.reduce((sum, user) => sum + user.totalFlashcards, 0) / totalUsers) : 0
  const avgCompletionRate = totalUsers > 0 ? Math.round(users.reduce((sum, user) => sum + user.completionRate, 0) / totalUsers) : 0
  
  return {
    totalUsers,
    activeUsers,
    avgFlashcards,
    avgCompletionRate
  }
})

const levelDistribution = computed(() => {
  const users = filteredUsers.value
  const levels = { Beginner: 0, Intermediate: 0, Advanced: 0 }
  
  users.forEach(user => {
    levels[user.level]++
  })
  
  const total = users.length
  
  return Object.entries(levels).map(([name, count]) => ({
    name,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0
  }))
})

const activityData = computed(() => {
  const days = []
  const now = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    const dayUsers = filteredUsers.value.filter(user => {
      if (!user.lastViewed) return false
      const userDate = user.lastViewed.toDate ? user.lastViewed.toDate() : new Date(user.lastViewed)
      return userDate.toDateString() === date.toDateString()
    })
    
    days.push({
      label: date.toLocaleDateString('en', { weekday: 'short' }),
      count: dayUsers.length
    })
  }
  
  return days
})

const maxActivity = computed(() => {
  return Math.max(...activityData.value.map(day => day.count), 1)
})

const progressStats = computed(() => {
  const users = filteredUsers.value
  const totalFlashcards = users.reduce((sum, user) => sum + user.totalFlashcards, 0)
  const totalViewed = users.reduce((sum, user) => sum + (user.viewedNumbers?.length || 0), 0)
  const difficultCount = users.reduce((sum, user) => sum + (user.difficultNumbers?.length || 0), 0)
  const completionRate = totalFlashcards > 0 ? Math.round((totalViewed / totalFlashcards) * 100) : 0
  
  return {
    totalFlashcards,
    totalViewed,
    difficultCount,
    completionRate
  }
})

// Methods
onMounted(async () => {
  await loadUsers()
})

async function loadUsers() {
  try {
    loading.value = true
    const usersCollection = collection(db, 'users')
    const usersQuery = query(usersCollection, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(usersQuery)
    
    allUsers.value = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        email: data.email,
        createdAt: data.createdAt,
        lastViewed: data.progress?.lastViewed || data.createdAt,
        totalFlashcards: data.progress?.totalFlashcards || 0,
        viewedNumbers: data.progress?.viewedNumbers || [],
        difficultNumbers: data.progress?.difficultNumbers || [],
        level: determineUserLevel(data.progress),
        completionRate: calculateCompletionRate(data.progress)
      }
    })
    
    filterData()
  } catch (error) {
    console.error('Error loading users:', error)
    alert('Error loading user data. Please check your Firebase configuration.')
  } finally {
    loading.value = false
  }
}

function determineUserLevel(progress) {
  if (!progress) return 'Beginner'
  
  const completionRate = calculateCompletionRate(progress)
  const totalFlashcards = progress.totalFlashcards || 0
  
  if (completionRate >= 80 && totalFlashcards >= 50) return 'Advanced'
  if (completionRate >= 50 && totalFlashcards >= 20) return 'Intermediate'
  return 'Beginner'
}

function calculateCompletionRate(progress) {
  if (!progress || !progress.totalFlashcards) return 0
  const viewed = progress.viewedNumbers?.length || 0
  return Math.round((viewed / progress.totalFlashcards) * 100)
}

function isUserActive(lastViewed) {
  if (!lastViewed) return false
  const date = lastViewed.toDate ? lastViewed.toDate() : new Date(lastViewed)
  const now = new Date()
  const diffDays = Math.ceil((now - date) / (1000 * 60 * 60 * 24))
  
  switch (timeRange.value) {
    case '7': return diffDays <= 7
    case '30': return diffDays <= 30
    case '90': return diffDays <= 90
    default: return true
  }
}

function filterData() {
  let filtered = [...allUsers.value]
  
  // Filter by time range
  if (timeRange.value !== 'all') {
    const days = parseInt(timeRange.value)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    filtered = filtered.filter(user => {
      if (!user.lastViewed) return false
      const userDate = user.lastViewed.toDate ? user.lastViewed.toDate() : new Date(user.lastViewed)
      return userDate >= cutoffDate
    })
  }
  
  filteredUsers.value = filtered
  filterUsers()
}

function filterUsers() {
  let filtered = [...filteredUsers.value]
  
  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.email.toLowerCase().includes(term)
    )
  }
  
  // Sort users
  filtered.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]
    
    if (sortField.value === 'lastViewed' || sortField.value === 'createdAt') {
      aVal = aVal && aVal.toDate ? aVal.toDate() : new Date(aVal || 0)
      bVal = bVal && bVal.toDate ? bVal.toDate() : new Date(bVal || 0)
    }
    
    if (sortDirection.value === 'desc') {
      return bVal > aVal ? 1 : -1
    } else {
      return aVal > bVal ? 1 : -1
    }
  })
  
  filteredUsers.value = filtered
}

function sortUsers(field) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'desc'
  }
  filterUsers()
}

function getSortIcon(field) {
  if (sortField.value !== field) return '↕️'
  return sortDirection.value === 'asc' ? '↑' : '↓'
}

async function refreshData() {
  await loadUsers()
}

function viewUserDetails(user) {
  selectedUser.value = user
}

function closeModal() {
  selectedUser.value = null
}

function formatDate(date) {
  if (!date) return 'Never'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getTimeAgo(date) {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  const now = new Date()
  const diffMs = now - d
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

function getUserInitials(email) {
  return email.substring(0, 2).toUpperCase()
}

function getLevelClass(level) {
  return {
    'beginner': level === 'Beginner',
    'intermediate': level === 'Intermediate',
    'advanced': level === 'Advanced'
  }
}

function getActiveUsersLabel() {
  switch (timeRange.value) {
    case '7': return 'Last 7 days'
    case '30': return 'Last 30 days'  
    case '90': return 'Last 90 days'
    default: return 'All time'
  }
}

function logout() {
  sessionStorage.removeItem('adminEmail')
  sessionStorage.removeItem('adminPassword')
  sessionStorage.removeItem('adminLoginTime')
  // Navigate to login page - implement as needed
  window.location.href = '/admin/login'
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e3e3e3;
  border-top: 5px solid #6a11cb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Header Styles */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.admin-header h1 {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.admin-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.refresh-btn, .logout-btn {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
}

.refresh-btn:hover, .logout-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.logout-btn {
  background: rgba(220, 38, 38, 0.2);
  border-color: rgba(220, 38, 38, 0.3);
}

.logout-btn:hover {
  background: rgba(220, 38, 38, 0.3);
}

.btn-icon {
  margin-right: 8px;
  font-size: 1.1em;
}

.filter-select {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: white;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Summary Stats */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.summary-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%);
}

.summary-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

.summary-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  display: block;
}

.summary-card h3 {
  margin: 0 0 12px;
  color: #4a5568;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-card p {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 8px;
  color: #2d3748;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-subtitle {
  color: #718096;
  font-size: 0.85rem;
  font-style: italic;
}

/* Main Content */
.admin-content {
  display: grid;
  gap: 32px;
}

.performance-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.performance-section h2 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 12px 40px 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  width: 280px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  right: 12px;
  color: #a0aec0;
  pointer-events: none;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.performance-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.performance-table th {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 16px 20px;
  text-align: left;
  font-weight: 700;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.sortable:hover {
  background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
}

.sort-icon {
  margin-left: 8px;
  opacity: 0.6;
  font-size: 0.8rem;
}

.performance-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  font-size: 0.95rem;
}

.user-row:hover {
  background-color: #f8fafc;
}

.user-email {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
}

.level-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.level-badge.beginner {
  background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
  color: #9a3412;
}

.level-badge.intermediate {
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
  color: #1e40af;
}

.level-badge.advanced {
  background: linear-gradient(135deg, #bbf7d0 0%, #86efac 100%);
  color: #166534;
}

.flashcard-count {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.count {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2d3748;
}

.viewed {
  font-size: 0.8rem;
  color: #718096;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  width: 80px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: 600;
  color: #4a5568;
  min-width: 40px;
}

.difficult-numbers {
  font-size: 0.9rem;
}

.difficulty-count {
  color: #e53e3e;
  font-weight: 600;
}

.no-difficulties {
  color: #68d391;
  font-weight: 500;
}

.last-active {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-ago {
  color: #718096;
  font-size: 0.8rem;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.view-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.view-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.no-data h3 {
  margin: 0 0 8px;
  color: #4a5568;
}

.no-data p {
  margin: 0;
  font-size: 0.9rem;
}

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.full-width {
  grid-column: 1 / -1;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.chart-card h3 {
  margin: 0 0 20px;
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 700;
}

.chart-container {
  min-height: 200px;
}

.activity-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-bars {
  display: flex;
  align-items: end;
  height: 180px;
  gap: 12px;
  justify-content: space-around;
  margin-bottom: 16px;
}

.activity-bar {
  background: linear-gradient(to top, #4FACFE 0%, #00F2FE 100%);
  width: 32px;
  border-radius: 4px 4px 0 0;
  animation: growBar 1s ease-in-out;
    position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 1px;
}

.activity-bar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  font-weight: 700;
  color: #4a5568;
  white-space: nowrap;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
}

.chart-labels span {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 600;
  text-align: center;
  width: 32px;
}

/* Level Distribution */
.level-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.level-stat {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.level-stat:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.level-circle {
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.level-stat.beginner .level-circle {
  background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
}

.level-stat.intermediate .level-circle {
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
}

.level-stat.advanced .level-circle {
  background: linear-gradient(135deg, #bbf7d0 0%, #86efac 100%);
}

.level-info h4 {
  margin: 0 0 4px;
  font-size: 1rem;
  color: #2d3748;
}

.level-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #718096;
}

/* Progress Overview */
.progress-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 24px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: #f1f5f9;
  transform: translateY(-4px);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 600;
}

.completion-chart {
  display: flex;
  justify-content: center;
  align-items: center;
}

.completion-ring {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.ring-center {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.completion-percentage {
  font-size: 1.8rem;
  font-weight: 800;
  color: #2d3748;
}

.completion-label {
  font-size: 0.8rem;
  color: #718096;
  text-align: center;
  max-width: 80px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 16px 16px 0 0;
}

.modal-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.4rem;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #e53e3e;
  background: #fed7d7;
}

.modal-body {
  padding: 24px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.detail-section h4 {
  margin: 0 0 16px;
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 700;
}

.detail-section p {
  margin: 0 0 12px;
  color: #4a5568;
  display: flex;
  gap: 8px;
}

.detail-section p:last-child {
  margin-bottom: 0;
}

.detail-section strong {
  color: #2d3748;
  min-width: 140px;
}

.difficult-numbers-list, .viewed-numbers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.difficult-number, .viewed-number {
  padding: 6px 12px;
  background: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.difficult-number {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  color: #9b2c2c;
  border-color: #feb2b2;
}

.viewed-number {
  background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
  color: #276749;
  border-color: #9ae6b4;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .admin-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .progress-overview {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 16px;
  }
  
  .summary-stats {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .performance-table {
    font-size: 0.85rem;
  }
  
  .performance-table th,
  .performance-table td {
    padding: 12px 8px;
  }
  
  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 0.7rem;
  }
  
  .action-btn {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .admin-controls {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-select, .refresh-btn, .logout-btn {
    width: 100%;
    justify-content: center;
  }
  
  .performance-section {
    padding: 20px;
  }
  
  .chart-card {
    padding: 20px;
  }
  
  .progress-stats {
    grid-template-columns: 1fr;
  }
}

/* Animation for bar growth */
@keyframes growBar {
  from {
    height: 0%;
    opacity: 0;
  }
  to {
    height: var(--target-height);
    opacity: 1;
  }
}

/* Apply animation to bars */
.activity-bar {
  animation: growBar 1s ease-out;
}

/* Focus states for accessibility */
button:focus, select:focus, input:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .summary-card {
    border: 2px solid #2d3748;
  }
  
  .performance-table th {
    background: #2d3748;
    color: white;
  }
  
  .progress-bar {
    border: 1px solid #2d3748;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .spinner, .activity-bar, .summary-card, .action-btn,
  .refresh-btn, .logout-btn, .level-stat, .stat-item,
  .level-circle, .modal-content {
    animation: none;
    transition: none;
  }
}
</style>