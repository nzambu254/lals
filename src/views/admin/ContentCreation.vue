<template>
  <div class="admin-container">
    <h1 class="page-title">Content Management</h1>

    <!-- Create New Content Section -->
    <div class="card create-content-card">
      <div class="card-header">
        <h3>Create New Content Item</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="createContent" class="content-form">
          <div class="form-group">
            <label for="newTitle">Title:</label>
            <input type="text" id="newTitle" v-model="newContent.title" required placeholder="e.g., Latitude Fundamentals">
          </div>
          <div class="form-group">
            <label for="newDescription">Description:</label>
            <textarea id="newDescription" v-model="newContent.description" required placeholder="A brief overview of the content..."></textarea>
          </div>
          <div class="form-group">
            <label for="newType">Type:</label>
            <select id="newType" v-model="newContent.type" required>
              <option value="lesson">Lesson</option>
              <option value="quiz">Quiz</option>
              <option value="simulation-guide">Simulation Guide</option>
              <option value="resource">Resource</option>
            </select>
          </div>
          <button type="submit" class="btn-primary">Save Content</button>
        </form>
      </div>
    </div>

    <!-- Lesson Reports Section -->
    <div class="card lesson-reports-card">
      <div class="card-header">
        <h3>Lesson Reports</h3>
        <div class="report-actions">
          <button @click="downloadLessonReport('pdf')" class="btn-download">Download PDF</button>
          <button @click="downloadLessonReport('csv')" class="btn-download">Download CSV</button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="loading" class="loading-message">Loading lessons...</div>
        <div v-else-if="lessonContent.length === 0" class="no-content-message">No lessons found.</div>
        <div v-else class="lessons-summary">
          <p class="summary-text">Total Lessons: <strong>{{ lessonContent.length }}</strong></p>
          <div class="lessons-grid">
            <div v-for="lesson in lessonContent" :key="lesson.id" class="lesson-card">
              <h4 class="lesson-title">{{ lesson.title }}</h4>
              <p class="lesson-description">{{ lesson.description }}</p>
              <div class="lesson-meta">
                <span class="lesson-date">Created: {{ formatDate(lesson.createdAt) }}</span>
                <span class="lesson-updated">Updated: {{ formatDate(lesson.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Content List Section -->
    <div class="card all-content-card">
      <div class="card-header">
        <h3>All Content Items</h3>
      </div>
      <div class="card-body">
        <div v-if="loading" class="loading-message">Loading content...</div>
        <div v-else-if="error" class="error-message">Error: {{ error }}</div>
        <div v-else-if="allContent.length === 0" class="no-content-message">No content items found. Create one above!</div>
        <table v-else class="content-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in allContent" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.description }}</td>
              <td class="actions-cell">
                <button class="btn-edit" @click="openEditModal(item)">Edit</button>
                <button class="btn-delete" @click="confirmDelete(item)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Content Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Edit Content Item</h3>
        <form @submit.prevent="updateContent">
          <div class="form-group">
            <label for="editTitle">Title:</label>
            <input type="text" id="editTitle" v-model="editingContent.title" required>
          </div>
          <div class="form-group">
            <label for="editDescription">Description:</label>
            <textarea id="editDescription" v-model="editingContent.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="editType">Type:</label>
            <select id="editType" v-model="editingContent.type" required>
              <option value="lesson">Lesson</option>
              <option value="quiz">Quiz</option>
              <option value="simulation-guide">Simulation Guide</option>
              <option value="resource">Resource</option>
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
        <p>Are you sure you want to delete content item: <strong>"{{ contentToDelete?.title }}"</strong>?</p>
        <div class="modal-actions">
          <button class="btn-delete" @click="deleteContent">Delete</button>
          <button class="btn-secondary" @click="cancelDelete">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { db } from '@/firebase'; // Assuming db is exported from '@/firebase'
import { collection, query, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation

// Reactive state for creating new content
const newContent = ref({
  title: '',
  description: '',
  type: 'lesson', // Default type
});

// Reactive state for listing all content
const allContent = ref([]);
const loading = ref(true);
const error = ref(null);

// Reactive state for editing content
const showEditModal = ref(false);
const editingContent = ref(null);

// Reactive state for deleting content
const showDeleteConfirm = ref(false);
const contentToDelete = ref(null);

let unsubscribe; // To store the unsubscribe function for the real-time listener

// Computed property to filter lessons from all content
const lessonContent = computed(() => {
  return allContent.value.filter(item => item.type === 'lesson');
});

// --- Utility Functions ---

// Format date for display
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  // Handle Firestore timestamp
  if (timestamp.toDate) {
    return timestamp.toDate().toLocaleDateString();
  }
  
  // Handle regular Date object or string
  return new Date(timestamp).toLocaleDateString();
};

// Download lesson report function
const downloadLessonReport = (format) => {
  const lessons = lessonContent.value;
  
  if (lessons.length === 0) {
    alert('No lessons available to download');
    return;
  }

  const reportData = lessons.map(lesson => ({
    title: lesson.title,
    description: lesson.description,
    createdAt: formatDate(lesson.createdAt),
    updatedAt: formatDate(lesson.updatedAt)
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  
  if (format === 'csv') {
    downloadCSV(reportData, `lesson-report-${timestamp}.csv`);
  } else if (format === 'pdf') {
    downloadPDF(reportData, `lesson-report-${timestamp}.pdf`);
  }
};

// Download CSV function
const downloadCSV = (data, filename) => {
  const headers = ['Title', 'Description', 'Created At', 'Updated At'];
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      `"${row.title.replace(/"/g, '""')}"`,
      `"${row.description.replace(/"/g, '""')}"`,
      `"${row.createdAt}"`,
      `"${row.updatedAt}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Download PDF function
const downloadPDF = (data, filename) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Lesson Report', 105, 15, { align: 'center' });
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 25, { align: 'center' });
  
  // Add table headers
  doc.setFontSize(14);
  doc.text('Title', 15, 40);
  doc.text('Description', 60, 40);
  doc.text('Created', 140, 40);
  doc.text('Updated', 175, 40);
  
  // Add table content
  doc.setFontSize(12);
  let y = 50;
  
  data.forEach((lesson, index) => {
    if (y > 280) { // Add new page if we're near the bottom
      doc.addPage();
      y = 20;
      // Repeat headers on new page
      doc.setFontSize(14);
      doc.text('Title', 15, y);
      doc.text('Description', 60, y);
      doc.text('Created', 140, y);
      doc.text('Updated', 175, y);
      y = 30;
      doc.setFontSize(12);
    }
    
    // Split description into multiple lines if needed
    const descriptionLines = doc.splitTextToSize(lesson.description, 50);
    
    doc.text(lesson.title, 15, y);
    doc.text(descriptionLines, 60, y);
    doc.text(lesson.createdAt, 140, y);
    doc.text(lesson.updatedAt, 175, y);
    
    // Move y position based on description height
    y += Math.max(10, descriptionLines.length * 7);
    
    // Add a line between entries if not last item
    if (index < data.length - 1) {
      doc.line(15, y, 195, y);
      y += 5;
    }
  });
  
  // Save the PDF
  doc.save(filename);
};

// --- Firestore Operations ---

// 1. Create Content
const createContent = async () => {
  try {
    // Add content to the 'content' collection in Firestore
    await addDoc(collection(db, 'content'), {
      ...newContent.value,
      createdAt: serverTimestamp(), // Add timestamp for creation
      updatedAt: serverTimestamp(), // Add timestamp for last update
    });
    // Reset form fields after successful creation
    newContent.value = {
      title: '',
      description: '',
      type: 'lesson',
    };
    console.log('Content created successfully!');
  } catch (err) {
    console.error('Error creating content:', err);
    alert('Failed to create content. Please try again.'); // Consider a custom message box
  }
};

// 2. Fetch Content (Real-time)
const fetchContent = () => {
  loading.value = true;
  error.value = null;
  const contentCollectionRef = collection(db, 'content');
  const q = query(contentCollectionRef); // You can add orderBy, where clauses here if needed

  // Set up real-time listener using onSnapshot
  unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedContent = [];
    snapshot.forEach((doc) => {
      // doc.data() retrieves all fields in the document
      // doc.id is the unique ID generated by Firestore for the document
      fetchedContent.push({ id: doc.id, ...doc.data() });
    });
    allContent.value = fetchedContent;
    loading.value = false;
  }, (err) => {
    console.error("Error fetching content:", err);
    error.value = "Failed to load content. Please check console for details.";
    loading.value = false;
  });
};

// 3. Update Content
const openEditModal = (item) => {
  // Create a deep copy to avoid direct mutation of the item in the list
  editingContent.value = JSON.parse(JSON.stringify(item));
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingContent.value = null;
};

const updateContent = async () => {
  if (!editingContent.value || !editingContent.value.id) {
    console.error("No content selected for update or missing ID.");
    return;
  }

  try {
    const contentDocRef = doc(db, 'content', editingContent.value.id);
    await updateDoc(contentDocRef, {
      title: editingContent.value.title,
      description: editingContent.value.description,
      type: editingContent.value.type,
      updatedAt: serverTimestamp(), // Update timestamp on modification
    });
    console.log("Content updated successfully!");
    closeEditModal();
  } catch (err) {
    console.error("Error updating content:", err);
    alert("Failed to update content. See console for details."); // Consider a custom message box
  }
};

// 4. Delete Content
const confirmDelete = (item) => {
  contentToDelete.value = item; // Store the item to be deleted
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  contentToDelete.value = null;
};

const deleteContent = async () => {
  if (!contentToDelete.value || !contentToDelete.value.id) {
    console.error("No content selected for deletion or missing ID.");
    return;
  }

  try {
    const contentDocRef = doc(db, 'content', contentToDelete.value.id);
    await deleteDoc(contentDocRef);
    console.log("Content deleted successfully!");
    cancelDelete();
  } catch (err) {
    console.error("Error deleting content:", err);
    alert("Failed to delete content. See console for details."); // Consider a custom message box
  }
};

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchContent();
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
  padding: 30px;
  max-width: 1200px;
  margin: 30px auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.page-title {
  font-size: 2.5em;
  margin-bottom: 30px;
  color: #2d3748;
  text-align: center;
  font-weight: 700;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px; /* Space between cards */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f7fafc;
}

.card-header h3 {
  margin: 0;
  font-size: 1.8em;
  color: #3182ce;
  font-weight: 600;
}

.card-body {
  padding: 25px;
  overflow-x: auto; /* For table responsiveness */
}

/* Report Actions */
.report-actions {
  display: flex;
  gap: 10px;
}

.btn-download {
  padding: 10px 16px;
  background-color: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.btn-download:hover {
  background-color: #38a169;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(72, 187, 120, 0.2);
}

/* Lesson Reports Styles */
.lessons-summary {
  padding: 0;
}

.summary-text {
  font-size: 1.1em;
  color: #4a5568;
  margin-bottom: 25px;
  padding: 15px;
  background-color: #f7fafc;
  border-radius: 8px;
  text-align: center;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.lesson-card {
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lesson-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.lesson-title {
  color: #2d3748;
  font-size: 1.2em;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.lesson-description {
  color: #4a5568;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.lesson-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.85em;
  color: #718096;
}

.lesson-date, .lesson-updated {
  font-weight: 500;
}

/* Form Styles */
.content-form {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Increased gap */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Increased gap */
}

.form-group label {
  font-weight: 600;
  color: #4a5568;
  font-size: 1.05em;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 12px; /* Increased padding */
  border: 1px solid #cbd5e0;
  border-radius: 8px; /* More rounded */
  font-size: 1em;
  width: 100%; /* Full width */
  box-sizing: border-box; /* Include padding in width */
}

.form-group textarea {
  min-height: 120px; /* Taller textarea */
  resize: vertical;
}

/* Table Styles */
.content-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px; /* Ensure table looks good on wider screens */
}

.content-table th,
.content-table td {
  padding: 15px 20px;
  text-align: left;
  border-bottom: 1px solid #ebf4ff;
  vertical-align: top; /* Align content to top for longer descriptions */
}

.content-table th {
  background-color: #edf2f7;
  font-weight: 700;
  color: #4a5568;
  text-transform: uppercase;
  font-size: 0.9em;
}

.content-table tbody tr:last-child td {
  border-bottom: none;
}

.content-table tbody tr:hover {
  background-color: #f0f8ff;
}

.actions-cell {
  white-space: nowrap; /* Prevent buttons from wrapping */
}

/* Buttons */
.btn-primary, .btn-secondary, .btn-edit, .btn-delete {
  padding: 12px 20px; /* Consistent padding */
  border-radius: 8px; /* More rounded */
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1em;
}

.btn-primary {
  background-color: #4299e1;
  color: white;
  align-self: flex-start; /* Align button to start in form */
  margin-top: 10px;
}

.btn-primary:hover {
  background-color: #3182ce;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 153, 225, 0.2);
}

.btn-edit {
  background-color: #f6ad55;
  color: #2d3748;
  margin-right: 10px;
}

.btn-edit:hover {
  background-color: #ed8936;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(246, 173, 85, 0.2);
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-delete:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2);
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
  max-width: 550px; /* Wider modal */
  text-align: left;
}

.modal-content h3 {
  color: #3182ce;
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 1.8em;
  text-align: center;
}

.modal-content .form-group {
  margin-bottom: 20px; /* Spacing in modal form */
}

.modal-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

/* Loading, Error, No Content Messages */
.loading-message, .error-message, .no-content-message {
  text-align: center;
  padding: 20px;
  font-size: 1.1em;
  color: #555;
  background-color: #f8fafc;
  border-radius: 8px;
  margin-top: 15px;
}

.error-message {
  color: #e74c3c;
  font-weight: bold;
  background-color: #fef2f2;
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
  .report-actions {
    flex-direction: column;
    width: 100%;
  }
  .btn-download {
    width: 100%;
  }
  .lessons-grid {
    grid-template-columns: 1fr;
  }
  .form-group input,
  .form-group textarea,
  .form-group select {
    padding: 10px;
  }
  .content-table th,
  .content-table td {
    padding: 10px 15px;
  }
  .btn-primary, .btn-secondary, .btn-edit, .btn-delete {
    padding: 10px 15px;
    font-size: 0.9em;
  }
  .modal-content {
    padding: 20px;
  }
  .modal-actions {
    flex-direction: column-reverse; /* Stack buttons in reverse order */
    gap: 10px;
  }
  .modal-actions button {
    width: 100%;
  }
}
</style>