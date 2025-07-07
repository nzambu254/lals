<template>
  <div class="geo-quiz-container">
    <div class="quiz-header">
      <h1>Latitude & Longitude Practice</h1>
      <div class="header-buttons">
        <button @click="showReports = !showReports" class="report-btn">
          {{ showReports ? 'Hide Reports' : 'View Reports' }}
        </button>
        <button v-if="showReports" @click="printReports" class="print-btn">
          Print Reports
        </button>
        <button v-if="showReports" @click="downloadReports" class="download-btn">
          Download Reports
        </button>
      </div>
    </div>

    <!-- Reports Section -->
    <div v-if="showReports" class="reports-section" id="reports-section">
      <h2>Student Performance Reports</h2>
      
      <div v-if="quizHistory.length === 0" class="no-reports">
        <p>No quiz attempts found. Complete a quiz to see your reports here.</p>
      </div>
      
      <div v-else class="reports-grid">
        <div v-for="(attempt, index) in quizHistory" :key="index" class="report-card">
          <div class="report-header">
            <h3>Attempt {{ index + 1 }}</h3>
            <span class="report-date">{{ formatDate(attempt.timestamp) }}</span>
          </div>
          
          <div class="report-score">
            <span class="score-text">Score: {{ attempt.score }} / {{ attempt.total }}</span>
            <div class="score-bar">
              <div class="score-fill" :style="{ width: (attempt.score / attempt.total) * 100 + '%' }"></div>
            </div>
            <span class="percentage">{{ Math.round((attempt.score / attempt.total) * 100) }}%</span>
          </div>
          
          <div class="report-details">
            <button @click="toggleReportDetails(index)" class="details-btn">
              {{ expandedReports[index] ? 'Hide Details' : 'View Details' }}
            </button>
            
            <div v-if="expandedReports[index]" class="detailed-answers">
              <div v-for="(question, qIndex) in questions" :key="qIndex" class="answer-detail">
                <h4>Q{{ qIndex + 1 }}. {{ question.question }}</h4>
                <div class="answer-comparison">
                  <p><strong>Your Answer:</strong> {{ attempt.answers[qIndex] || 'No answer provided' }}</p>
                  <p><strong>Correct Answer:</strong> {{ question.answer }}</p>
                  <p :class="{ correct: isAnswerCorrect(attempt.answers[qIndex], question.answer), wrong: !isAnswerCorrect(attempt.answers[qIndex], question.answer) }">
                    {{ isAnswerCorrect(attempt.answers[qIndex], question.answer) ? '✅ Correct' : '❌ Incorrect' }}
                  </p>
                </div>
                
                <!-- Display saved workings only if they exist -->
                <div v-if="attempt.workings && attempt.workings[qIndex]" class="saved-workings">
                  <h6>Your Saved Workings:</h6>
                  <div class="workings-content">{{ attempt.workings[qIndex].content }}</div>
                  <div class="workings-grade">
                    <span>Grade: {{ attempt.workings[qIndex].grade || 'Not graded' }} / 3</span>
                    <span v-if="attempt.workings[qIndex].feedback" class="feedback">
                      Feedback: {{ attempt.workings[qIndex].feedback }}
                    </span>
                  </div>
                </div>

                <!-- Display PDF upload if it exists -->
                <div v-if="attempt.pdfUploads && attempt.pdfUploads[qIndex]" class="pdf-upload-display">
                  <h6>Uploaded PDF:</h6>
                  <a :href="attempt.pdfUploads[qIndex].url" target="_blank" class="pdf-link">
                    View PDF ({{ attempt.pdfUploads[qIndex].name }})
                  </a>
                  <div class="pdf-grade">
                    <span>Grade: {{ attempt.pdfUploads[qIndex].grade || 'Not graded' }} / 3</span>
                    <span v-if="attempt.pdfUploads[qIndex].feedback" class="feedback">
                      Feedback: {{ attempt.pdfUploads[qIndex].feedback }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Quiz Section -->
    <div v-if="!quizCompleted && !showReports" class="quiz-section">
      <div v-for="(q, index) in questions" :key="index" class="question-block">
        <h3>Q{{ index + 1 }}. {{ q.question }}</h3>
        <textarea
          v-model="userAnswers[index]"
          rows="4"
          placeholder="Type your answer here..."
        ></textarea>
        
        <!-- Workings Upload Section in Quiz -->
        <div v-if="isCalculationQuestion(index)" class="workings-section">
          <h4>Show Your Workings (Step-by-Step Calculation):</h4>
          <textarea
            v-model="quizWorkings[index]"
            placeholder="Type your step-by-step calculations here..."
            rows="4"
            class="workings-textarea"
          ></textarea>
          <div class="workings-actions">
            <button @click="saveQuizWorkings(index)" class="save-workings-btn">
              Save Workings
            </button>
            <span v-if="savedWorkingsStatus[index]" class="workings-status">
              ✅ Workings saved
            </span>
          </div>

          <!-- PDF Upload Section -->
          <div class="pdf-upload-section">
            <h4>Or Upload Your Workings as PDF:</h4>
            <div class="upload-container">
              <input 
                type="file" 
                ref="pdfUploads"
                :id="'pdf-upload-' + index"
                accept=".pdf"
                @change="handlePdfUpload(index)"
                class="pdf-upload-input"
              />
              <label :for="'pdf-upload-' + index" class="upload-label">
                <span v-if="!pdfUploads[index]">Choose PDF File</span>
                <span v-else>{{ pdfUploads[index].name }}</span>
              </label>
              <button 
                v-if="pdfUploads[index]" 
                @click="removePdf(index)" 
                class="remove-pdf-btn"
              >
                Remove
              </button>
            </div>
            <div v-if="pdfUploadStatus[index]" class="upload-status">
              {{ pdfUploadStatus[index] }}
            </div>
          </div>
        </div>
      </div>

      <button @click="submitQuiz" class="submit-btn">Submit Answers</button>
    </div>

    <!-- Results Section -->
    <div v-if="quizCompleted && !showReports" class="results-section">
      <h2>Quiz Results</h2>
      <p class="score-display">Your Score: {{ score }} / {{ questions.length }}</p>

      <div v-for="(q, index) in questions" :key="index" class="result-block">
        <h4>Q{{ index + 1 }}. {{ q.question }}</h4>
        <p><strong>Your Answer:</strong> {{ userAnswers[index] }}</p>
        <p><strong>Correct Answer:</strong> {{ q.answer }}</p>
        <p :class="{ correct: isCorrect(index), wrong: !isCorrect(index) }">
          {{ isCorrect(index) ? '✅ Correct' : '❌ Incorrect' }}
        </p>
        
        <!-- Show saved workings in results -->
        <div v-if="isCalculationQuestion(index) && quizWorkings[index]" class="saved-workings">
          <h5>Your Workings:</h5>
          <div class="workings-content">{{ quizWorkings[index] }}</div>
        </div>

        <!-- Show uploaded PDF in results -->
        <div v-if="isCalculationQuestion(index) && pdfUploads[index]" class="pdf-upload-display">
          <h5>Uploaded PDF:</h5>
          <a :href="pdfUploads[index].url" target="_blank" class="pdf-link">
            View PDF ({{ pdfUploads[index].name }})
          </a>
        </div>
      </div>

      <div class="result-actions">
        <button @click="resetQuiz" class="retry-btn">Try Again</button>
        <button @click="showReports = true" class="view-reports-btn">View All Reports</button>
        <button @click="printResults" class="print-btn">Print Results</button>
      </div>
    </div>

    <!-- Teacher Grading Section (only visible to teachers) -->
    <div v-if="userRole === 'teacher' && !showReports" class="grading-section">
      <h2>Grade Student Workings</h2>
      <div class="grading-instructions">
        <p>Grade student workings out of 3 marks and provide feedback.</p>
      </div>

      <div v-if="studentAttempts.length > 0" class="student-attempts">
        <div v-for="attempt in studentAttempts" :key="attempt.id" class="attempt-card">
          <div class="attempt-header">
            <h3>{{ attempt.name || attempt.email }}</h3>
            <span class="attempt-date">{{ formatDate(attempt.timestamp) }}</span>
            <span class="attempt-score">Score: {{ attempt.score }} / {{ attempt.total }}</span>
          </div>

          <div class="attempt-questions">
            <div v-for="(question, qIndex) in questions" :key="qIndex" class="question-to-grade">
              <h4>Q{{ qIndex + 1 }}. {{ question.question }}</h4>
              
              <!-- Workings to grade -->
              <div v-if="attempt.workings && attempt.workings[qIndex]" class="workings-to-grade">
                <h5>Student Workings:</h5>
                <div class="workings-content">{{ attempt.workings[qIndex].content }}</div>
                
                <div class="grading-form">
                  <label>Grade (0-3):</label>
                  <select 
                    v-model="attempt.workings[qIndex].grade" 
                    @change="saveGrade(attempt.id, qIndex, 'workings', attempt.workings[qIndex].grade)"
                    class="grade-select"
                  >
                    <option value="">Not graded</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                  
                  <label>Feedback:</label>
                  <textarea
                    v-model="attempt.workings[qIndex].feedback"
                    @blur="saveFeedback(attempt.id, qIndex, 'workings', attempt.workings[qIndex].feedback)"
                    placeholder="Provide feedback..."
                    rows="3"
                    class="feedback-textarea"
                  ></textarea>
                </div>
              </div>

              <!-- PDF to grade -->
              <div v-if="attempt.pdfUploads && attempt.pdfUploads[qIndex]" class="pdf-to-grade">
                <h5>Student PDF:</h5>
                <a :href="attempt.pdfUploads[qIndex].url" target="_blank" class="pdf-link">
                  View PDF ({{ attempt.pdfUploads[qIndex].name }})
                </a>
                
                <div class="grading-form">
                  <label>Grade (0-3):</label>
                  <select 
                    v-model="attempt.pdfUploads[qIndex].grade" 
                    @change="saveGrade(attempt.id, qIndex, 'pdf', attempt.pdfUploads[qIndex].grade)"
                    class="grade-select"
                  >
                    <option value="">Not graded</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                  
                  <label>Feedback:</label>
                  <textarea
                    v-model="attempt.pdfUploads[qIndex].feedback"
                    @blur="saveFeedback(attempt.id, qIndex, 'pdf', attempt.pdfUploads[qIndex].feedback)"
                    placeholder="Provide feedback..."
                    rows="3"
                    class="feedback-textarea"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-attempts">
        <p>No student attempts to grade yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db, storage } from '@/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import html2pdf from 'html2pdf.js';

const router = useRouter();

// User state
const user = ref(null);
const userRole = ref('student');

// Quiz state
const questions = [
  {
    question: 'Given the local time of city P (0°, 30°W) is 12:00 pm, what is the local time of city Q (10°S, 60°W)?',
    answer: '10:00 am',
    isCalculation: true
  },
  {
    question: 'Given the local time of city P (0°, 30°W) is 12:00 pm, what is the local time of city R (24°N, 10°W)?',
    answer: '2:00 pm',
    isCalculation: true
  },
  {
    question: 'Local time of city S (33°S, 20°E) when P (0°, 30°W) is 12:00 pm?',
    answer: '2:00 pm',
    isCalculation: true
  },
  {
    question: 'Local time of city T (81°N, 81°W) when P is 12:00 pm?',
    answer: '6:36 am',
    isCalculation: true
  },
  {
    question: 'Jet from X (42°S, 150°E) to Y (8°N, 150°E), speed = 600 knots. Find local time at Z (10°S, 60°E) when jet lands.',
    answer: '2:00 pm',
    isCalculation: true
  },
  {
    question: 'Airport C position from A(60°N,5°E) → B(60°N,17°E) then 600 nm North?',
    answer: '70°N, 17°E',
    isCalculation: true
  },
  {
    question: 'Distance in nautical miles between A and B?',
    answer: '600 nm',
    isCalculation: true
  },
  {
    question: 'Total flight time if speed is 300 knots?',
    answer: '2 hours',
    isCalculation: true
  },
  {
    question: 'Arrival time at C if departure from A at 9:20am?',
    answer: '11:20 am',
    isCalculation: true
  },
  {
    question: 'Final position (Q, R, S) after flying 1800 nm East, South, then West from P(0°, 40°W)?',
    answer: 'Q: 0°, 10°E; R: 30°S, 10°E; S: 30°S, 50°W',
    isCalculation: true
  },
  {
    question: 'Average speed for 16hr total flight?',
    answer: '337.5 knots',
    isCalculation: true
  },
  {
    question: 'Time taken from R to S if it is 2 hrs shorter than P to Q to R?',
    answer: '7 hrs',
    isCalculation: true
  },
  {
    question: 'Shortest distance between M(45°N, 38°E) and N(45°N, 142°W)?',
    answer: '3720 nm',
    isCalculation: true
  },
  {
    question: 'Plane from P(10°S, 62°E) due north 2 hrs @800 km/h. New position?',
    answer: '4.2°S, 62°E',
    isCalculation: true
  },
  {
    question: 'Distance in nautical miles to 12°W westwards at same speed?',
    answer: '1350 nm',
    isCalculation: true
  },
  {
    question: 'Time taken for that distance?',
    answer: '5 hrs',
    isCalculation: true
  },
  {
    question: 'Local time at Q when left P at 1300 hrs?',
    answer: '11:12 am',
    isCalculation: true
  },
  {
    question: 'Speed from A(60°N, 130°W) to B(60°N, 47°E), 1700 hrs arrival, left 1300 hrs?',
    answer: '660 knots',
    isCalculation: true
  },
  {
    question: 'Time taken by S (West) to C(60°N, 133°N) @ 600knots?',
    answer: '2.2 hrs',
    isCalculation: true
  },
  {
    question: 'Time taken by T (North) to C @ 600knots?',
    answer: '2 hrs',
    isCalculation: true
  },
  {
    question: 'Local time at B if local time at D (23°N, 50°W) is 10:00am?',
    answer: '6:12 pm',
    isCalculation: true
  }
];

const userAnswers = ref(Array(questions.length).fill(''));
const quizWorkings = ref(Array(questions.length).fill(''));
const savedWorkingsStatus = ref(Array(questions.length).fill(false));
const pdfUploads = ref(Array(questions.length).fill(null));
const pdfUploadStatus = ref(Array(questions.length).fill(''));
const quizCompleted = ref(false);
const showReports = ref(false);
const quizHistory = ref([]);
const expandedReports = ref({});
const studentAttempts = ref([]);

const score = computed(() => {
  return questions.reduce((acc, q, i) => {
    return acc + (isCorrect(i) ? 1 : 0);
  }, 0);
});

// Auth state listener
let unsubscribe = null;

const getUserRole = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().role : 'student';
  } catch (err) {
    console.error("Error getting user role:", err);
    return 'student';
  }
};

const initAuth = () => {
  unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      user.value = firebaseUser;
      userRole.value = await getUserRole(firebaseUser.uid);
      
      localStorage.setItem('user', JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email
      }));
      localStorage.setItem('role', userRole.value);

      await loadQuizHistory();
      if (userRole.value === 'teacher') {
        await loadStudentAttempts();
      }
    } else {
      user.value = null;
      userRole.value = 'student';
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      quizHistory.value = [];
      router.push('/login');
    }
  });
};

onMounted(() => {
  initAuth();
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

// Quiz Methods
const isCorrect = (index) => {
  const userAnswer = userAnswers.value[index]?.trim().toLowerCase();
  const correctAnswer = questions[index].answer.trim().toLowerCase();
  return userAnswer === correctAnswer;
};

const isAnswerCorrect = (userAnswer, correctAnswer) => {
  if (!userAnswer) return false;
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
};

const isCalculationQuestion = (index) => {
  return questions[index].isCalculation;
};

const saveQuizWorkings = (index) => {
  if (!quizWorkings.value[index] || !quizWorkings.value[index].trim()) {
    alert('Please enter your workings before saving.');
    return;
  }
  
  savedWorkingsStatus.value[index] = true;
  alert('Workings saved successfully!');
};

const handlePdfUpload = async (index) => {
  const fileInput = document.getElementById(`pdf-upload-${index}`);
  const file = fileInput.files[0];
  
  if (!file) return;
  
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    pdfUploadStatus.value[index] = 'File too large (max 5MB)';
    return;
  }
  
  try {
    pdfUploadStatus.value[index] = 'Uploading...';
    
    // Create a unique filename
    const filename = `workings_${user.value.uid}_Q${index+1}_${Date.now()}.pdf`;
    const storageReference = storageRef(storage, `workings/${filename}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageReference, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    
    // Store the file reference
    pdfUploads.value[index] = {
      name: file.name,
      url: downloadUrl,
      path: snapshot.ref.fullPath
    };
    
    pdfUploadStatus.value[index] = 'Upload successful!';
  } catch (error) {
    console.error("Error uploading PDF:", error);
    pdfUploadStatus.value[index] = 'Upload failed. Please try again.';
  }
};

const removePdf = (index) => {
  pdfUploads.value[index] = null;
  pdfUploadStatus.value[index] = '';
  const fileInput = document.getElementById(`pdf-upload-${index}`);
  if (fileInput) fileInput.value = '';
};

const submitQuiz = async () => {
  quizCompleted.value = true;
  if (user.value?.uid) {
    const attemptId = `${user.value.uid}_${Date.now()}`;
    const result = {
      id: attemptId,
      uid: user.value.uid,
      email: user.value.email,
      name: user.value.displayName || user.value.email,
      answers: userAnswers.value,
      score: score.value,
      total: questions.length,
      timestamp: serverTimestamp(),
      workings: {},
      pdfUploads: {}
    };
    
    // Add saved workings to the result
    quizWorkings.value.forEach((working, index) => {
      if (working && working.trim()) {
        result.workings[index] = {
          content: working.trim(),
          submittedAt: serverTimestamp()
        };
      }
    });
    
    // Add PDF uploads to the result
    pdfUploads.value.forEach((pdf, index) => {
      if (pdf) {
        result.pdfUploads[index] = {
          name: pdf.name,
          url: pdf.url,
          path: pdf.path,
          submittedAt: serverTimestamp()
        };
      }
    });
    
    // Save to quiz_attempts collection for history
    await setDoc(doc(db, 'quiz_attempts', attemptId), result);
    
    // Also save to geo_quiz_results for compatibility
    await setDoc(doc(db, 'geo_quiz_results', user.value.uid), result);
    
    await loadQuizHistory();
  }
};

const resetQuiz = () => {
  userAnswers.value = Array(questions.length).fill('');
  quizWorkings.value = Array(questions.length).fill('');
  savedWorkingsStatus.value = Array(questions.length).fill(false);
  pdfUploads.value = Array(questions.length).fill(null);
  pdfUploadStatus.value = Array(questions.length).fill('');
  quizCompleted.value = false;
  showReports.value = false;
};

const loadQuizHistory = async () => {
  if (user.value?.uid) {
    try {
      const q = query(
        collection(db, 'quiz_attempts'),
        where('uid', '==', user.value.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      quizHistory.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error loading quiz history:", error);
      quizHistory.value = [];
    }
  }
};

const loadStudentAttempts = async () => {
  try {
    const q = query(
      collection(db, 'quiz_attempts'),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    studentAttempts.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error loading student attempts:", error);
    studentAttempts.value = [];
  }
};

const saveGrade = async (attemptId, questionIndex, type, grade) => {
  try {
    const updatePath = type === 'workings' 
      ? `workings.${questionIndex}.grade`
      : `pdfUploads.${questionIndex}.grade`;
    
    await updateDoc(doc(db, 'quiz_attempts', attemptId), {
      [updatePath]: grade
    });
    
    // Update local state
    const attempt = studentAttempts.value.find(a => a.id === attemptId);
    if (attempt) {
      if (type === 'workings' && attempt.workings && attempt.workings[questionIndex]) {
        attempt.workings[questionIndex].grade = grade;
      } else if (type === 'pdf' && attempt.pdfUploads && attempt.pdfUploads[questionIndex]) {
        attempt.pdfUploads[questionIndex].grade = grade;
      }
    }
  } catch (error) {
    console.error("Error saving grade:", error);
    alert("Failed to save grade. Please try again.");
  }
};

const saveFeedback = async (attemptId, questionIndex, type, feedback) => {
  try {
    const updatePath = type === 'workings' 
      ? `workings.${questionIndex}.feedback`
      : `pdfUploads.${questionIndex}.feedback`;
    
    await updateDoc(doc(db, 'quiz_attempts', attemptId), {
      [updatePath]: feedback
    });
    
    // Update local state
    const attempt = studentAttempts.value.find(a => a.id === attemptId);
    if (attempt) {
      if (type === 'workings' && attempt.workings && attempt.workings[questionIndex]) {
        attempt.workings[questionIndex].feedback = feedback;
      } else if (type === 'pdf' && attempt.pdfUploads && attempt.pdfUploads[questionIndex]) {
        attempt.pdfUploads[questionIndex].feedback = feedback;
      }
    }
  } catch (error) {
    console.error("Error saving feedback:", error);
    alert("Failed to save feedback. Please try again.");
  }
};

const toggleReportDetails = (index) => {
  expandedReports.value[index] = !expandedReports.value[index];
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  let date;
  if (timestamp.toDate) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const printReports = () => {
  const printContent = document.getElementById('reports-section').innerHTML;
  const originalContent = document.body.innerHTML;
  
  document.body.innerHTML = `
    <div class="print-header">
      <h1>Latitude & Longitude Practice Reports</h1>
      <p>Printed on: ${new Date().toLocaleString()}</p>
    </div>
    ${printContent}
  `;
  
  window.print();
  document.body.innerHTML = originalContent;
  window.location.reload();
};

const downloadReports = () => {
  const element = document.getElementById('reports-section');
  const opt = {
    margin: 10,
    filename: `GeoQuiz_Reports_${new Date().toISOString().slice(0,10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().from(element).set(opt).save();
};

const printResults = () => {
  const printContent = document.querySelector('.results-section').innerHTML;
  const originalContent = document.body.innerHTML;
  
  document.body.innerHTML = `
    <div class="print-header">
      <h1>Latitude & Longitude Practice Results</h1>
      <p>Printed on: ${new Date().toLocaleString()}</p>
    </div>
    ${printContent}
  `;
  
  window.print();
  document.body.innerHTML = originalContent;
  window.location.reload();
};
</script>


<style scoped>
/* Base styles for the entire quiz container */
.geo-quiz-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  font-family: 'Inter', sans-serif;
  color: #333333;
}

/* Header section styles */
.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eeeeee;
}

.quiz-header h1 {
  font-size: 2.2rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 700;
}

.header-buttons {
  display: flex;
  gap: 1rem;
}

.report-btn {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.report-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
}

.print-btn, .download-btn {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #27ae60 0%, #219653 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.print-btn:hover, .download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(39, 174, 96, 0.4);
}

/* Reports Section */
.reports-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.reports-section h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.no-reports {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-size: 1.1rem;
}

.reports-grid {
  display: grid;
  gap: 2rem;
}

.report-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.report-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #2c3e50;
}

.report-date {
  color: #6c757d;
  font-size: 0.9rem;
}

.report-score {
  margin-bottom: 1.5rem;
}

.score-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  display: block;
  margin-bottom: 0.5rem;
}

.score-bar {
  width: 100%;
  height: 12px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #e74c3c 0%, #f39c12 50%, #27ae60 100%);
  transition: width 0.3s ease;
}

.percentage {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.details-btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid #3498db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  color: #3498db;
}

.details-btn:hover {
  background: #3498db;
  color: white;
}

.detailed-answers {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.answer-detail {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.answer-detail h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.1rem;
}

.answer-comparison p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.saved-workings, .pdf-upload-display {
  margin-top: 1rem;
  padding: 1rem;
  background: #e8f5e8;
  border-radius: 6px;
  border: 1px solid #c3e6c3;
}

.saved-workings h5, .saved-workings h6, 
.pdf-upload-display h5, .pdf-upload-display h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 0.9rem;
}

.workings-content {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #d4edda;
  margin-bottom: 1rem;
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.workings-grade, .pdf-grade {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.workings-grade span, .pdf-grade span {
  font-weight: 600;
  color: #2c3e50;
}

.feedback {
  font-style: italic;
  color: #6c757d;
}

.pdf-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
}

.pdf-link:hover {
  text-decoration: underline;
}

/* Quiz Section (questions) */
.quiz-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.question-block {
  padding: 2rem;
  background: #fdfdfd;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.question-block:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.question-block h3 {
  margin-top: 0;
  margin-bottom: 1.2rem;
  color: #34495e;
  font-size: 1.25rem;
  font-weight: 600;
}

.workings-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 8px;
  border: 2px dashed #3498db;
}

.workings-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1rem;
}

.workings-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #cccccc;
  border-radius: 6px;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 1rem;
}

.workings-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.save-workings-btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #27ae60;
  color: white;
}

.save-workings-btn:hover {
  background: #219a52;
}

.workings-status {
  color: #27ae60;
  font-size: 0.9rem;
  font-weight: 600;
}

/* PDF Upload Section */
.pdf-upload-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.pdf-upload-input {
  display: none;
}

.upload-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.upload-label {
  padding: 0.8rem 1.5rem;
  background: #f1f3f5;
  border: 2px dashed #3498db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #3498db;
  text-align: center;
  flex-grow: 1;
}

.upload-label:hover {
  background: #e2e6ea;
}

.remove-pdf-btn {
  padding: 0.8rem 1.5rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.remove-pdf-btn:hover {
  background: #c0392b;
}

.upload-status {
  font-size: 0.9rem;
  color: #27ae60;
  font-weight: 600;
}

textarea {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1px solid #cccccc;
  border-radius: 8px;
  font-size: 1.05rem;
  resize: vertical;
    min-height: 120px;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.submit-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  align-self: center;
  margin-top: 1rem;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
}

/* Results Section */
.results-section {
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.results-section h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
}

.score-display {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
}

.result-block {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  margin-bottom: 1.5rem;
}

.result-block h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.1rem;
}

.result-block p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.correct {
  color: #27ae60;
  font-weight: 600;
}

.wrong {
  color: #e74c3c;
  font-weight: 600;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.retry-btn {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
}

.view-reports-btn {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
}

.view-reports-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(46, 204, 113, 0.4);
}

/* Teacher Grading Section */
.grading-section {
  margin-top: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.grading-section h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
}

.grading-instructions {
  text-align: center;
  margin-bottom: 2rem;
  color: #6c757d;
}

.student-attempts {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.attempt-card {
  padding: 2rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.attempt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.attempt-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.attempt-date {
  color: #6c757d;
  font-size: 0.9rem;
}

.attempt-score {
  font-weight: 600;
  color: #2c3e50;
}

.question-to-grade {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.question-to-grade h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.1rem;
}

.workings-to-grade, .pdf-to-grade {
  margin-top: 1rem;
}

.workings-to-grade h5, .pdf-to-grade h5 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 1rem;
}

.grading-form {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 1rem;
  align-items: center;
}

.grading-form label {
  font-weight: 600;
  color: #2c3e50;
}

.grade-select {
  padding: 0.5rem;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 0.95rem;
}

.feedback-textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 80px;
  grid-column: 1 / -1;
}

.no-attempts {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .geo-quiz-container {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .quiz-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .report-card {
    padding: 1.5rem;
  }
  
  .grading-form {
    grid-template-columns: 1fr;
  }
  
  .result-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .result-actions button {
    width: 100%;
  }
}

@media print {
  .geo-quiz-container {
    box-shadow: none;
    padding: 0;
    margin: 0;
  }
  
  .quiz-header, .grading-section, .result-actions {
    display: none;
  }
  
  .print-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .print-header h1 {
    font-size: 1.5rem;
  }
  
  .report-card, .result-block {
    page-break-inside: avoid;
    margin-bottom: 1.5rem;
  }
}
</style>