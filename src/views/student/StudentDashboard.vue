<template>
  <div class="dashboard">
    <header class="header">
      <h1>Student Dashboard</h1>
      <div class="header-decoration"></div>
    </header>

    <div class="stats-container">
      <div class="stat-card card-1">
        <div class="stat-icon">📚</div>
        <h3>Total Flashcards Studied</h3>
        <p>{{ progressData.totalFlashcards || 0 }}</p>
      </div>
      <div class="stat-card card-2">
        <div class="stat-icon">🎯</div>
        <h3>Quiz Accuracy</h3>
        <p>{{ progressData.quizAccuracy ? `${progressData.quizAccuracy}%` : 'N/A' }}</p>
      </div>
      <div class="stat-card card-3">
        <div class="stat-icon">🏆</div>
        <h3>Current Level</h3>
        <p>{{ progressData.currentLevel || 'Beginner' }}</p>
      </div>
    </div>

    <div class="navigation">
      <router-link to="/student/interactive-quizzes" class="nav-card nav-card-1">
        <div class="nav-icon">🎯</div>
        <h2>Interactive Quizzes</h2>
        <p>Test your knowledge with adaptive quizzes</p>
        <div class="nav-highlight"></div>
      </router-link>
      <router-link to="/student/flashcards" class="nav-card nav-card-2">
        <div class="nav-icon">📇</div>
        <h2>Flashcards</h2>
        <p>Learn prime numbers with interactive flashcards</p>
        <div class="nav-highlight"></div>
      </router-link>
      <router-link to="/student/notifications" class="nav-card nav-card-3">
        <div class="nav-icon">🔔</div>
        <h2>Notifications</h2>
        <p>View your latest notifications and updates</p>
        <div class="nav-highlight"></div>
      </router-link>
    </div>

    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="action-buttons">
        <button @click="startQuickQuiz" class="action-btn action-btn-1">
          <span class="btn-icon">⚡</span> Quick Quiz
        </button>
        <button @click="reviewDifficult" class="action-btn action-btn-2">
          <span class="btn-icon">🔍</span> Review Difficult Items
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useProgressStore } from '@/stores/progress';

export default {
  name: 'Dashboard',
  setup() {
    const progressStore = useProgressStore();
    return { progressStore };
  },
  computed: {
    progressData() {
      return this.progressStore.progressData;
    }
  },
  methods: {
    startQuickQuiz() {
      this.$router.push('/student/interactive-quizzes?mode=quick');
    },
    reviewDifficult() {
      this.$router.push('/student/flashcards?filter=difficult');
    },
    fetchProgressData() {
      // Mock progress data - replace with your actual data fetching
      const mockProgress = {
        totalFlashcards: 42,
        quizAccuracy: 85,
        currentLevel: 'Intermediate',
        difficultNumbers: [17, 29, 31]
      };
      
      // Update progress store
      this.progressStore.updateProgress(mockProgress);
    }
  },
  created() {
    this.fetchProgressData();
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  padding: 30px 20px;
  position: relative;
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(106, 17, 203, 0.3);
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 2.2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" stroke-width="2" stroke-opacity="0.1" stroke-dasharray="5,5"/></svg>');
  border-radius: 12px;
  z-index: 1;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
}

.card-1::before {
  background: linear-gradient(90deg, #FF9A8B 0%, #FF6B95 100%);
}
.card-2::before {
  background: linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%);
}
.card-3::before {
  background: linear-gradient(90deg, #F6D365 0%, #FDA085 100%);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.stat-card h3 {
  margin-top: 0;
  color: #555;
  font-size: 1.1rem;
}

.stat-card p {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 15px 0 0;
  color: #2c3e50;
}

.navigation {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.nav-card {
  background: white;
  border-radius: 12px;
  padding: 30px 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.nav-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  transition: transform 0.3s ease;
}

.nav-card:hover .nav-icon {
  transform: scale(1.1);
}

.nav-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  transition: all 0.3s ease;
}

.nav-card-1 .nav-highlight {
  background: linear-gradient(90deg, #FF9A8B 0%, #FF6B95 100%);
}
.nav-card-2 .nav-highlight {
  background: linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%);
}
.nav-card-3 .nav-highlight {
  background: linear-gradient(90deg, #F6D365 0%, #FDA085 100%);
}

.nav-card h2 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.nav-card p {
  color: #666;
  margin-bottom: 0;
}

.quick-actions {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.quick-actions h2 {
  margin-top: 0;
  margin-bottom: 25px;
  color: #2c3e50;
  font-size: 1.8rem;
  text-align: center;
  position: relative;
}

.quick-actions h2::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  margin: 10px auto 0;
  border-radius: 2px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.action-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.action-btn-1 {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
}

.action-btn-2 {
  background: linear-gradient(135deg, #FF9A8B 0%, #FF6B95 100%);
  color: white;
}

.btn-icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .header {
    padding: 20px 15px;
  }
  
  .header h1 {
    font-size: 1.8rem;
  }
  
  .navigation {
    grid-template-columns: 1fr;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>