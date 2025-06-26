<template>
  <div class="student-dashboard">
    <h1>Welcome Back, {{ userName || 'Student' }}!</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Available Simulation Tasks</h3>
        <p class="value">{{ availableSimulationTasksCount }}</p>
      </div>
      <div class="stat-card">
        <h3>Completed Quizzes</h3>
        <p class="value">{{ completedQuizzesCount }}</p>
      </div>
      <!-- The 'Completed Simulations (placeholder)' section has been removed -->
    </div>

    <!-- The Upcoming Deadlines section has been removed -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase'; // Ensure these are correctly imported
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const userName = ref('');
const completedQuizzesCount = ref(0);
// Renamed from availableQuizzesCount to availableSimulationTasksCount
const availableSimulationTasksCount = ref(4); // Set to 4 as requested

const fetchUserData = async (user) => {
  if (user) {
    // 1. Fetch user's display name from Firestore
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        userName.value = userDocSnap.data().name || user.displayName || user.email;
      } else {
        userName.value = user.displayName || user.email || 'Student';
        console.warn("User document not found in 'users' collection.");
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      userName.value = user.displayName || user.email || 'Student';
    }

    // 2. Fetch completed quizzes count
    try {
      // Assuming 'geo_quiz_results' stores one document per user for their latest quiz result
      const quizResultDocRef = doc(db, 'geo_quiz_results', user.uid);
      const quizResultDocSnap = await getDoc(quizResultDocRef);
      if (quizResultDocSnap.exists()) {
        completedQuizzesCount.value = 1; // If a document exists, assume at least one quiz was completed
        // If you store individual quiz results, you would count them here.
      } else {
        completedQuizzesCount.value = 0;
      }
    } catch (error) {
      console.error("Error fetching completed quizzes:", error);
      completedQuizzesCount.value = 0;
    }
  } else {
    userName.value = 'Guest';
    completedQuizzesCount.value = 0;
  }
};

onMounted(() => {
  // Listen for auth state changes
  onAuthStateChanged(auth, (user) => {
    fetchUserData(user);
  });
});
</script>

<style scoped>
.student-dashboard {
  padding: 30px; /* Increased padding */
  max-width: 1000px; /* Slightly wider */
  margin: 30px auto; /* Centered with top/bottom margin */
  background-color: #f8f9fa; /* Light background */
  border-radius: 12px; /* More rounded corners */
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08); /* Softer, more pronounced shadow */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

h1 {
  color: #2c3e50;
  margin-bottom: 35px; /* More space below heading */
  text-align: center;
  font-size: 2.8em; /* Larger welcome message */
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Adjusted minmax for better scaling */
  gap: 25px; /* Increased gap */
  margin: 40px 0; /* More vertical margin */
}

.stat-card {
  background: white;
  border-radius: 10px; /* More rounded */
  padding: 25px; /* More padding */
  box-shadow: 0 4px 10px rgba(0,0,0,0.08); /* Clearer shadow */
  text-align: center;
  transition: transform 0.2s ease-in-out; /* Add hover effect */
}

.stat-card:hover {
  transform: translateY(-5px); /* Lift effect on hover */
}

.stat-card h3 {
  margin: 0 0 15px 0;
  font-size: 1.2em; /* Larger stat title */
  color: #555;
  font-weight: 600;
}

.stat-card .value {
  margin: 0;
  font-size: 3.5em; /* Very large value */
  font-weight: bold;
  color: #007bff; /* Primary blue color for values */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .student-dashboard {
    padding: 20px;
    margin: 20px auto;
  }

  h1 {
    font-size: 2.2em;
  }

  .stats-grid {
    grid-template-columns: 1fr; /* Single column on small screens */
    gap: 15px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-card .value {
    font-size: 3em;
  }
}
</style>
