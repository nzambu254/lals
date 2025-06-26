<template>
  <div class="admin-container">
    <h1 class="page-title">User Management</h1>
    <div class="card">
      <div class="card-header">
        <h3>All Users</h3>
        <!-- Removed the "Add User" button as requested -->
      </div>
      <div class="card-body">
        <div v-if="loading" class="loading-message">Loading users...</div>
        <div v-else-if="error" class="error-message">Error: {{ error }}</div>
        <div v-else-if="users.length === 0" class="no-users-message">No users found.</div>
        <table v-else class="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td class="actions-cell">
                <button class="btn-edit" @click="openEditModal(user)">Edit</button>
                <button class="btn-delete" @click="confirmDelete(user)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Edit User</h3>
        <form @submit.prevent="updateUser">
          <div class="form-group">
            <label for="editName">Name:</label>
            <input type="text" id="editName" v-model="editingUser.name" required>
          </div>
          <div class="form-group">
            <label for="editEmail">Email:</label>
            <input type="email" id="editEmail" v-model="editingUser.email" required disabled>
            <!-- Email is typically not editable to prevent unintended auth issues -->
          </div>
          <div class="form-group">
            <label for="editRole">Role:</label>
            <select id="editRole" v-model="editingUser.role">
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn-primary">Save Changes</button>
            <button type="button" class="btn-secondary" @click="closeEditModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete user: <strong>{{ userToDelete?.name }} ({{ userToDelete?.email }})</strong>?</p>
        <div class="modal-actions">
          <button class="btn-delete" @click="deleteUser">Delete</button>
          <button class="btn-secondary" @click="cancelDelete">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { db } from '@/firebase'; // Assuming db is exported from '@/firebase'
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Reactive states
const users = ref([]);
const loading = ref(true);
const error = ref(null);

const showEditModal = ref(false);
const editingUser = ref(null); // Holds the user data currently being edited

const showDeleteConfirm = ref(false);
const userToDelete = ref(null); // Holds the user data to be deleted

let unsubscribe; // To store the unsubscribe function for the real-time listener

// Fetch users in real-time
const fetchUsers = () => {
  loading.value = true;
  error.value = null;
  const usersCollectionRef = collection(db, 'users');
  const q = query(usersCollectionRef); // You can add orderBy, where clauses here if needed

  // Set up real-time listener
  unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedUsers = [];
    snapshot.forEach((doc) => {
      // Assuming doc.id is the UID and doc.data() contains name, email, role
      fetchedUsers.push({ id: doc.id, ...doc.data() });
    });
    users.value = fetchedUsers;
    loading.value = false;
  }, (err) => {
    console.error("Error fetching users:", err);
    error.value = "Failed to load users. Please check console for details.";
    loading.value = false;
  });
};

// --- Edit User Logic ---
const openEditModal = (user) => {
  editingUser.value = { ...user }; // Create a copy to avoid directly editing reactive state
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingUser.value = null;
};

const updateUser = async () => {
  if (!editingUser.value || !editingUser.value.id) {
    console.error("No user selected for update or missing user ID.");
    return;
  }

  try {
    const userDocRef = doc(db, 'users', editingUser.value.id);
    await updateDoc(userDocRef, {
      name: editingUser.value.name,
      role: editingUser.value.role,
      // Email is typically not updated here as it's linked to Firebase Auth
    });
    console.log("User updated successfully!");
    closeEditModal();
  } catch (err) {
    console.error("Error updating user:", err);
    alert("Failed to update user. See console for details."); // Use custom modal if alert is restricted
  }
};

// --- Delete User Logic ---
const confirmDelete = (user) => {
  userToDelete.value = { ...user }; // Store user to delete
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  userToDelete.value = null;
};

const deleteUser = async () => {
  if (!userToDelete.value || !userToDelete.value.id) {
    console.error("No user selected for deletion or missing user ID.");
    return;
  }

  try {
    const userDocRef = doc(db, 'users', userToDelete.value.id);
    await deleteDoc(userDocRef);
    console.log("User deleted successfully!");
    cancelDelete();
  } catch (err) {
    console.error("Error deleting user:", err);
    alert("Failed to delete user. See console for details."); // Use custom modal if alert is restricted
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchUsers();
});

onUnmounted(() => {
  // Unsubscribe from the real-time listener when the component is unmounted
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
.admin-container {
  padding: 30px; /* Increased padding */
  max-width: 1200px;
  margin: 30px auto; /* Centered with margin */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.page-title {
  font-size: 2.5em; /* Larger title */
  margin-bottom: 30px;
  color: #2d3748;
  text-align: center;
  font-weight: 700;
}

.card {
  background: white;
  border-radius: 12px; /* More rounded */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* More prominent shadow */
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px; /* More padding */
  border-bottom: 1px solid #e2e8f0;
  background-color: #f7fafc; /* Light header background */
}

.card-header h3 {
  margin: 0;
  font-size: 1.8em; /* Larger header title */
  color: #3182ce;
  font-weight: 600;
}

.card-body {
  padding: 25px; /* More padding */
  overflow-x: auto; /* Allow horizontal scrolling on small screens */
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; /* Ensure table doesn't get too squished */
}

.user-table th,
.user-table td {
  padding: 15px 20px; /* More padding */
  text-align: left;
  border-bottom: 1px solid #ebf4ff; /* Lighter border */
}

.user-table th {
  background-color: #edf2f7; /* Slightly darker header background */
  font-weight: 700; /* Bolder text */
  color: #4a5568;
  text-transform: uppercase;
  font-size: 0.9em;
}

.user-table tbody tr:last-child td {
  border-bottom: none; /* No border on last row */
}

.user-table tbody tr:hover {
  background-color: #f0f8ff; /* Subtle hover effect */
}

.actions-cell {
  white-space: nowrap; /* Prevent buttons from wrapping */
}

.btn-primary, .btn-secondary, .btn-edit, .btn-delete {
  padding: 10px 18px; /* Consistent padding */
  border-radius: 6px; /* Slightly more rounded */
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.btn-primary {
  background-color: #4299e1;
  color: white;
}

.btn-primary:hover {
  background-color: #3182ce;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 153, 225, 0.2);
}

.btn-edit {
  background-color: #f6ad55; /* Orange-yellow for edit */
  color: #2d3748;
  margin-right: 10px; /* Space between buttons */
}

.btn-edit:hover {
  background-color: #ed8936;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(246, 173, 85, 0.2);
}

.btn-delete {
  background-color: #ef4444; /* Red for delete */
  color: white;
}

.btn-delete:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  text-align: left;
}

.modal-content h3 {
  color: #3182ce;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.8em;
  text-align: center;
}

.modal-content .form-group {
  margin-bottom: 15px;
}

.modal-content label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #4a5568;
}

.modal-content input,
.modal-content select {
  width: calc(100% - 24px); /* Account for padding */
  padding: 12px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 1em;
}

.modal-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #2d3748;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(226, 232, 240, 0.2);
}

/* Loading and error messages */
.loading-message, .error-message, .no-users-message {
  text-align: center;
  padding: 20px;
  font-size: 1.1em;
  color: #555;
}
.error-message {
  color: #e74c3c;
  font-weight: bold;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .admin-container {
    padding: 15px;
  }
  .page-title {
    font-size: 2em;
  }
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .card-header h3 {
    font-size: 1.5em;
  }
  .card-body {
    padding: 15px;
  }
  .user-table th,
  .user-table td {
    padding: 10px 15px;
  }
  .btn-primary, .btn-secondary, .btn-edit, .btn-delete {
    padding: 8px 14px;
    font-size: 0.85em;
  }
  .modal-content {
    padding: 20px;
  }
}
</style>
