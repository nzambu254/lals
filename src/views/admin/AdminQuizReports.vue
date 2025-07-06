<template>
  <div class="quiz-reports-container">
    <div class="header">
      <h1>Student Quiz Reports</h1>
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
              Student Name/Email
              <span v-if="sortKey === 'name'" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('timestamp')">
              Attempt Date
              <span v-if="sortKey === 'timestamp'" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('score')">
              Score
              <span v-if="sortKey === 'score'" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('total')">
              Total Questions
              <span v-if="sortKey === 'total'" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th>Percentage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attempt in filteredAttempts" :key="attempt.id">
            <td>{{ attempt.name }}</td>
            <td>{{ formatDate(attempt.timestamp) }}</td>
            <td>{{ attempt.score }}</td>
            <td>{{ attempt.total }}</td>
            <td>{{ calculatePercentage(attempt.score, attempt.total) }}%</td>
            <td>
              <button @click="viewDetails(attempt)" class="view-btn">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedAttempt" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Quiz Attempt Details</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="student-info">
            <p><strong>Student:</strong> {{ selectedAttempt.name }}</p>
            <p><strong>Date:</strong> {{ formatDate(selectedAttempt.timestamp) }}</p>
            <p><strong>Score:</strong> {{ selectedAttempt.score }} / {{ selectedAttempt.total }}</p>
            <p><strong>Percentage:</strong> {{ calculatePercentage(selectedAttempt.score, selectedAttempt.total) }}%</p>
          </div>
          
          <div class="answers-section">
            <h3>Answers:</h3>
            <div v-for="(answer, index) in selectedAttempt.answers" :key="index" class="answer-item">
              <p><strong>Question {{ index + 1 }}:</strong> {{ answer }}</p>
            </div>
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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const quizAttempts = ref([]);
const searchQuery = ref('');
const sortKey = ref('timestamp');
const sortOrder = ref('desc');
const selectedAttempt = ref(null);
const isLoading = ref(false);

onMounted(async () => {
  await fetchQuizAttempts();
});

const fetchQuizAttempts = async () => {
  try {
    isLoading.value = true;
    const querySnapshot = await getDocs(collection(db, 'quiz_attempts'));
    quizAttempts.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
  } finally {
    isLoading.value = false;
  }
};

const refreshData = async () => {
  await fetchQuizAttempts();
};

const filteredAttempts = computed(() => {
  let filtered = [...quizAttempts.value];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(attempt => 
      attempt.name.toLowerCase().includes(query)
    );
  }
  
  filtered.sort((a, b) => {
    const aValue = a[sortKey.value];
    const bValue = b[sortKey.value];
    
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
  try {
    const date = timestamp.toDate();
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch (e) {
    return 'Invalid date';
  }
};

const calculatePercentage = (score, total) => {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
};

const viewDetails = (attempt) => {
  selectedAttempt.value = attempt;
};

const closeModal = () => {
  selectedAttempt.value = null;
};

const downloadPDF = () => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Quiz Reports', 14, 22);
  
  // Date
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${formatDate({ toDate: () => new Date() })}`, 14, 30);
  
  // Table data
  const headers = [
    ['Student Name/Email', 'Attempt Date', 'Score', 'Total Questions', 'Percentage']
  ];
  
  const data = filteredAttempts.value.map(attempt => [
    attempt.name,
    formatDate(attempt.timestamp),
    attempt.score.toString(),
    attempt.total.toString(),
    `${calculatePercentage(attempt.score, attempt.total)}%`
  ]);
  
  // Add table
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 40,
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 40 }
  });
  
  // Save the PDF
  doc.save('quiz_reports.pdf');
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
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
}

.download-btn {
  background-color: #4CAF50;
  color: white;
}

.refresh-btn {
  background-color: #2196F3;
  color: white;
}

.view-btn {
  background-color: #ff9800;
  color: white;
}

.close-btn {
  background-color: #f44336;
  color: white;
}

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

.table-container {
  overflow-x: auto;
}

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

th {
  background-color: #f5f5f5;
  cursor: pointer;
  position: relative;
}

th:hover {
  background-color: #e9e9e9;
}

.sort-icon {
  margin-left: 5px;
}

tr:hover {
  background-color: #f5f5f5;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.student-info {
  margin-bottom: 20px;
}

.answers-section {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 4px;
}

.answer-item {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f5f5f5;
}

.answer-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .filters {
    flex-direction: column;
    gap: 10px;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  th, td {
    padding: 8px 10px;
  }
  
  .modal {
    width: 95%;
  }
}
</style>