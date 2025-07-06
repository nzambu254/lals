<template>
  <div class="geo-quiz-container">
    <div class="quiz-header">
      <h1>Latitude & Longitude Practice</h1>
      <div class="header-buttons">
        <button @click="showReports = !showReports" class="report-btn">
          {{ showReports ? 'Hide Reports' : 'View Reports' }}
        </button>
      </div>
    </div>

    <!-- Reports Section -->
    <div v-if="showReports" class="reports-section">
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
                
                <!-- Workings Upload Section for Calculation Questions -->
                <div v-if="isCalculationQuestion(qIndex)" class="workings-section">
                  <h5>Upload Your Workings (Text Format):</h5>
                  <textarea
                    v-model="workings[`${index}-${qIndex}`]"
                    placeholder="Type your step-by-step calculations here..."
                    rows="4"
                    class="workings-textarea"
                  ></textarea>
                  <div class="workings-actions">
                    <button @click="saveWorkings(index, qIndex)" class="save-workings-btn">
                      Save Workings
                    </button>
                    <span v-if="attempt.workings && attempt.workings[qIndex]" class="workings-status">
                      ✅ Workings saved
                    </span>
                  </div>
                  
                  <!-- Display saved workings -->
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
      </div>

      <div class="result-actions">
        <button @click="resetQuiz" class="retry-btn">Try Again</button>
        <button @click="showReports = true" class="view-reports-btn">View All Reports</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '@/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const router = useRouter();

// User state
const user = ref(null);

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
const quizCompleted = ref(false);
const showReports = ref(false);
const quizHistory = ref([]);
const expandedReports = ref({});
const workings = ref({});

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
      const userRole = await getUserRole(firebaseUser.uid);
      
      localStorage.setItem('user', JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email
      }));
      localStorage.setItem('role', userRole);

      await loadQuizHistory();
    } else {
      user.value = null;
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

const submitQuiz = async () => {
  quizCompleted.value = true;
  if (user.value?.uid) {
    const attemptId = `${user.value.uid}_${Date.now()}`;
    const result = {
      id: attemptId,
      uid: user.value.uid,
      name: user.value.displayName || user.value.email,
      answers: userAnswers.value,
      score: score.value,
      total: questions.length,
      timestamp: serverTimestamp(),
      workings: {}
    };
    
    // Save to quiz_attempts collection for history
    await setDoc(doc(db, 'quiz_attempts', attemptId), result);
    
    // Also save to geo_quiz_results for compatibility
    await setDoc(doc(db, 'geo_quiz_results', user.value.uid), result);
    
    await loadQuizHistory();
  }
};

const resetQuiz = () => {
  userAnswers.value = Array(questions.length).fill('');
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

const toggleReportDetails = (index) => {
  expandedReports.value[index] = !expandedReports.value[index];
};

const saveWorkings = async (attemptIndex, questionIndex) => {
  const workingKey = `${attemptIndex}-${questionIndex}`;
  const workingContent = workings.value[workingKey];
  
  if (!workingContent || !workingContent.trim()) {
    alert('Please enter your workings before saving.');
    return;
  }
  
  try {
    const attempt = quizHistory.value[attemptIndex];
    const attemptRef = doc(db, 'quiz_attempts', attempt.id);
    
    const workingData = {
      content: workingContent.trim(),
      submittedAt: serverTimestamp(),
      grade: null,
      feedback: null
    };
    
    // Update the specific working for this question
    const updateData = {};
    updateData[`workings.${questionIndex}`] = workingData;
    
    await updateDoc(attemptRef, updateData);
    
    // Update local state
    if (!attempt.workings) {
      attempt.workings = {};
    }
    attempt.workings[questionIndex] = workingData;
    
    // Clear the working input
    workings.value[workingKey] = '';
    
    alert('Workings saved successfully!');
  } catch (error) {
    console.error("Error saving workings:", error);
    alert('Error saving workings. Please try again.');
  }
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
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.report-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(231, 76, 60, 0.4);
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

.workings-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 8px;
  border: 2px dashed #3498db;
}

.workings-section h5 {
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

.saved-workings {
  margin-top: 1rem;
  padding: 1rem;
  background: #e8f5e8;
  border-radius: 6px;
  border: 1px solid #c3e6c3;
}

.saved-workings h6 {
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

.workings-grade {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.workings-grade span {
  font-weight: 600;
  color: #2c3e50;
}

.feedback {
  font-style: italic;
  color: #6c757d;
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

textarea {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1px solid #cccccc;
  border-radius: 8px;
  font-size: 1.05rem;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.2);
}

.submit-btn, .retry-btn, .view-reports-btn {
  width: auto;
  align-self: flex-end;
  padding: 1.1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
}

.submit-btn {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  box-shadow: 0 6px 15px rgba(52, 152, 219, 0.25);
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(52, 152, 219, 0.4);
}

.retry-btn {
  background: #f1f3f5;
  color: #34495e;
  border: 1px solid #dcdcdc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.retry-btn:hover {
  background: #e2e6ea;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.view-reports-btn {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.view-reports-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(231, 76, 60, 0.4);
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* Results Section */
.results-section {
  padding: 1rem;
}

.results-section h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.score-display {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  color: #2c3e50;
  text-align: center;
  background-color: #ecf0f1;
  padding: 1rem 2rem;
  border-radius: 10px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.result-block {
  margin-bottom: 2rem;
  padding: 2rem;
  background: #fdfdfd;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.result-block h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #34495e;
  font-size: 1.2rem;
  font-weight: 600;
}

.result-block p {
  margin: 0.6rem 0;
  font-size: 1.05rem;
}

.result-block p strong {
  color: #555555;
}

.correct {
  color: #27ae60;
  font-weight: 700;
  font-size: 1.1rem;
}

.wrong {
  color: #e74c3c;
  font-weight:600;
  font-size: 1.1rem;
}

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
  
  .reports-grid {
    grid-template-columns: 1fr;
  }
  
  .report-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .result-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .submit-btn, .retry-btn, .view-reports-btn {
    width: 100%;
  }
}

/* Animation for correct/wrong answers */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-block {
  animation: fadeIn 0.4s ease-out forwards;
}

/* Loading state for when saving workings */
.workings-saving {
  position: relative;
}

.workings-saving::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Tooltip for additional help */
.tooltip {
  position: relative;
  display: inline-block;
  margin-left: 0.5rem;
  cursor: help;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 0.5rem;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.8rem;
  font-weight: normal;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

/* Print-specific styles */
@media print {
  .geo-quiz-container {
    box-shadow: none;
    padding: 0;
    margin: 0;
  }
  
  .quiz-header, .header-buttons {
    display: none;
  }
  
  .report-card {
    page-break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ddd;
  }
  
  button {
    display: none;
  }
}
</style>