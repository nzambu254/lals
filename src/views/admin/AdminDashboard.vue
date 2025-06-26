<template>
  <div class="admin-container">
    <h1>Welcome Back, {{ adminName || 'Admin' }}!</h1>

    <!-- Summary Cards -->
    <div class="dashboard-summary">
      <div class="summary-card">
        <div class="summary-icon users-icon">
          <span class="icon">👥</span>
        </div>
        <div class="summary-content">
          <h3>Total Users</h3>
          <p>{{ totalUsersCount }}</p>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon simulation-icon">
          <span class="icon">🎮</span>
        </div>
        <div class="summary-content">
          <h3>Available Simulation Tasks</h3>
          <p>{{ availableSimulationTasksCount }}</p>
        </div>
      </div>
      <!-- Other summary cards (Content Items, Active Programs) have been removed based on the request to focus on users and simulations -->
    </div>

    <!-- The "Recent Activity" and "Quick Actions" sections have been removed as requested -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase'; // Ensure these are correctly imported
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const adminName = ref('');
const totalUsersCount = ref(0);
const availableSimulationTasksCount = ref(4); // Set to 4 as per your instruction

const fetchAdminData = async () => {
  // 1. Get the current authenticated user
  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribe(); // Unsubscribe immediately after getting the user
      resolve(firebaseUser);
    });
  });

  if (user) {
    // 2. Fetch the admin's name from the 'users' Firestore collection
    try {
      const adminDocRef = doc(db, "users", user.uid);
      const adminDocSnap = await getDoc(adminDocRef);
      if (adminDocSnap.exists()) {
        adminName.value = adminDocSnap.data().name || user.displayName || user.email;
      } else {
        adminName.value = user.displayName || user.email || 'Admin';
        console.warn("Admin user document not found in 'users' collection for UID:", user.uid);
      }
    } catch (error) {
      console.error("Error fetching admin name:", error);
      adminName.value = user.displayName || user.email || 'Admin'; // Fallback name
    }

    // 3. Fetch total number of users in the system
    try {
      const usersCollectionRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollectionRef);
      totalUsersCount.value = usersSnapshot.size; // Get the count of documents
    } catch (error) {
      console.error("Error fetching total users count:", error);
      totalUsersCount.value = 'N/A'; // Indicate error
    }
  } else {
    adminName.value = 'Guest';
    totalUsersCount.value = 'N/A';
  }
};

onMounted(() => {
  fetchAdminData();
});
</script>

<style scoped>
.admin-container {
  padding: 30px; /* Increased padding */
  max-width: 1000px; /* Slightly adjusted max-width */
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

/* Summary Cards Grid */
.dashboard-summary {
  display: grid;
  /* Adjust grid columns to fit the two cards you want to display */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px; /* Increased gap */
  margin: 40px 0; /* More vertical margin */
  justify-content: center; /* Center the cards if there's extra space */
}

.summary-card {
  background: white;
  border-radius: 12px; /* More rounded */
  padding: 25px; /* Increased padding */
  box-shadow: 0 4px 10px rgba(0,0,0,0.08); /* Clearer shadow */
  display: flex;
  flex-direction: column; /* Stack icon and content vertically */
  align-items: center; /* Center content horizontally */
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e2e8f0;
}

.summary-card:hover {
  transform: translateY(-5px); /* Lift effect on hover */
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.summary-icon {
  width: 70px; /* Larger icon container */
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px; /* Space between icon and text */
  flex-shrink: 0;
}

.summary-icon .icon {
  font-size: 36px; /* Larger icon */
}

.users-icon {
  background-color: #ebf8ff; /* Light blue */
  color: #3182ce; /* Darker blue */
}

.simulation-icon {
  background-color: #ebfaf1; /* Light green */
  color: #38a169; /* Darker green */
}

/* Removed content-icon and training-icon styles as those cards are no longer present */

.summary-content h3 {
  margin: 0 0 10px 0;
  font-size: 1.2em; /* Larger stat title */
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-content p {
  margin: 0;
  font-size: 3.5em; /* Very large value */
  font-weight: bold;
  color: #007bff; /* Primary blue color for values */
}

/* Removed styles for .dashboard-section, .section-title, .activity-list, .activity-item, etc. */
/* Removed styles for .quick-actions, .action-btn, etc. */

/* Responsive Design */
@media (max-width: 768px) {
  .admin-container {
    padding: 20px;
    margin: 20px auto;
  }
  
  h1 {
    font-size: 2.2em;
  }
  
  .dashboard-summary {
    grid-template-columns: 1fr; /* Stack cards on smaller screens */
    gap: 15px;
  }
  
  .summary-card {
    padding: 20px;
  }
  
  .summary-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }
  
  .summary-icon .icon {
    font-size: 30px;
  }
  
  .summary-content h3 {
    font-size: 1.1em;
  }
  
  .summary-content p {
    font-size: 3em;
  }
}
</style>
