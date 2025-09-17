<template>
  <div class="quiz-reports-container">
    <div class="header">
      <h1>Student Reports</h1>
      <div class="actions">
        <button @click="downloadPDF" class="download-btn">
          <span class="icon">📥</span> Download PDF
        </button>
        <button @click="refreshData" class="refresh-btn">
          <span class="icon">🔄</span> Refresh
        </button>
      </div>
    </div>

    <div class="filters">
      <div class="filter-group">
        <label for="search">Search:</label>
        <input
          id="search"
          v-model="searchQuery"
          type="text"
          placeholder="Search by student name or email"
        />
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th @click="sortBy('name')">
              Student Name / Email
              <span v-if="sortKey === 'name'" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('createdAt')">
              Created At
              <span v-if="sortKey === 'createdAt'" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('lastLogin')">
              Last Login
              <span v-if="sortKey === 'lastLogin'" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th>Role & Flashcards</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredStudents" :key="student.id">
            <td>{{ student.name }} <br /><small>{{ student.email }}</small></td>
            <td>{{ formatDate(student.createdAt) }}</td>
            <td>{{ formatDate(student.lastLogin) }}</td>
            <td>
              {{ student.role }}
              <br />
              <small>Total: {{ student.progress?.totalFlashcards || 0 }}</small>
            </td>
            <td>
              <button @click="viewDetails(student)" class="view-btn">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedStudent" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Student Details</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <!-- Student Info Card -->
          <div class="student-card">
            <h3>{{ selectedStudent.name }}</h3>
            <p class="email">{{ selectedStudent.email }}</p>
            <div class="info-grid">
              <div class="role"><strong>Role:</strong> {{ selectedStudent.role }}</div>
              <div class="flashcards"><strong>Total Flashcards:</strong> {{ selectedStudent.progress?.totalFlashcards || 0 }}</div>
              <div class="created"><strong>Created At:</strong> {{ formatDate(selectedStudent.createdAt) }}</div>
              <div class="login"><strong>Last Login:</strong> {{ formatDate(selectedStudent.lastLogin) }}</div>
              <div class="last-viewed"><strong>Last Viewed:</strong> {{ formatDate(selectedStudent.progress?.lastViewed) }}</div>
            </div>
          </div>

          <!-- Progress Section -->
          <div class="answers-section">
            <h3>Progress</h3>
            <div v-if="selectedStudent.progress">
              <p><strong>Total Flashcards:</strong> {{ selectedStudent.progress.totalFlashcards || 0 }}</p>
              <p><strong>Last Viewed:</strong> {{ formatDate(selectedStudent.progress.lastViewed) }}</p>
            </div>
            <p v-else>No progress recorded.</p>
          </div>

          <!-- Difficult Numbers -->
          <div class="answers-section">
            <h3>Difficult Numbers</h3>
            <ul v-if="selectedStudent.progress?.difficultNumbers?.length">
              <li v-for="(num, i) in selectedStudent.progress.difficultNumbers" :key="i">{{ num }}</li>
            </ul>
            <p v-else>No difficult numbers.</p>
          </div>

          <!-- Viewed Numbers -->
          <div class="answers-section">
            <h3>Viewed Numbers</h3>
            <ul v-if="selectedStudent.progress?.viewedNumbers?.length">
              <li v-for="(num, i) in selectedStudent.progress.viewedNumbers" :key="i">{{ num }}</li>
            </ul>
            <p v-else>No viewed numbers yet.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="close-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const students = ref([]);
const searchQuery = ref('');
const sortKey = ref('createdAt');
const sortOrder = ref('desc');
const selectedStudent = ref(null);
const isLoading = ref(false);

onMounted(async () => {
  await fetchStudents();
});

const fetchStudents = async () => {
  try {
    isLoading.value = true;
    const q = query(collection(db, 'users'), where('role', '==', 'student'));
    const querySnapshot = await getDocs(q);
    students.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching students:', error);
  } finally {
    isLoading.value = false;
  }
};

const refreshData = async () => {
  await fetchStudents();
};

const filteredStudents = computed(() => {
  let filtered = [...students.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(student =>
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query)
    );
  }

  filtered.sort((a, b) => {
    const aValue = a[sortKey.value];
    const bValue = b[sortKey.value];

    if (!aValue || !bValue) return 0;

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
});

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  if (timestamp.seconds !== undefined) {
    return format(new Date(timestamp.seconds * 1000), 'MMM dd, yyyy HH:mm');
  }
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch {
    return 'Invalid date';
  }
};

const viewDetails = (student) => {
  selectedStudent.value = student;
};

const closeModal = () => {
  selectedStudent.value = null;
};

const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Reports', 14, 22);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, 30);

  const headers = [
    ['Name/Email', 'Created At', 'Last Login', 'Role', 'Total Flashcards']
  ];

  const data = filteredStudents.value.map(student => [
    `${student.name} (${student.email})`,
    formatDate(student.createdAt),
    formatDate(student.lastLogin),
    student.role,
    student.progress?.totalFlashcards?.toString() || '0'
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 40,
    headStyles: { fillColor: [41,128,185], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245,245,245] },
    margin: { top: 40 }
  });

  doc.save('student_reports.pdf');
};
</script>

<style scoped>
.quiz-reports-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}

.download-btn {
  background-color: #4CAF50;
  color: white;
}
.download-btn:hover { background-color: #45a049; }

.refresh-btn {
  background-color: #2196F3;
  color: white;
}
.refresh-btn:hover { background-color: #1976d2; }

.view-btn {
  background-color: #ff9800;
  color: white;
}
.view-btn:hover { background-color: #e68900; }

.close-btn {
  background-color: #f44336;
  color: white;
}
.close-btn:hover { background-color: #d32f2f; }

.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.table-container { overflow-x: auto; }

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th { background-color: #f5f5f5; cursor: pointer; position: relative; }
th:hover { background-color: #e9e9e9; }

.sort-icon { margin-left: 5px; }
tr:hover { background-color: #f5f5f5; }

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 10px;
  width: 85%;
  max-width: 850px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 4px 25px rgba(0,0,0,0.2);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body { padding: 20px; }
.modal-footer { padding: 15px 20px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; }

/* Colorful Student Card */
.student-card {
  background: linear-gradient(135deg, #0c0d0e 0%, #0f0f0f 100%);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  color: #fff;
}
.student-card h3 { margin: 0 0 5px; }
.student-card .email { color: rgba(255,255,255,0.9); margin-bottom: 15px; }

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}
.info-grid div {
  background: rgba(255,255,255,0.15);
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  transition: background 0.3s ease;
}
.info-grid div:hover {
  background: rgba(255,255,255,0.3);
}

/* Answers Section */
.answers-section {
  margin-bottom: 20px;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 6px;
}
.answers-section h3 { margin-bottom: 10px; color: #444; }

@media (max-width: 768px) {
  .header { flex-direction: column; align-items: flex-start; gap: 10px; }
  .filters { flex-direction: column; gap: 10px; }
  .filter-group { flex-direction: column; align-items: flex-start; }
  th, td { padding: 8px 10px; }
  .modal { width: 95%; }
}
</style>
