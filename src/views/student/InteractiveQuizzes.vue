<template>
  <div class="geo-quiz-container">
    <div class="quiz-header">
      <h1>Latitude & Longitude Practice</h1>
    </div>

    <div v-if="!quizCompleted" class="quiz-section">
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

    <div v-else class="results-section">
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

      <button @click="resetQuiz" class="retry-btn">Try Again</button>

      <div v-if="lastQuizResult" class="last-quiz-section">
        <h3>Your Last Quiz Performance</h3>
        <p><strong>Date:</strong> {{ new Date(lastQuizResult.timestamp.toDate()).toLocaleString() }}</p>
        <p><strong>Score:</strong> {{ lastQuizResult.score }} / {{ lastQuizResult.total }}</p>
        <div class="last-quiz-answers">
          <div v-for="(q, index) in questions" :key="'last-' + index" class="last-result-block">
            <p><strong>Q{{ index + 1 }}:</strong> {{ q.question }}</p>
            <p><strong>Your Answer:</strong> {{ lastQuizResult.answers[index] }}</p>
            <p><strong>Correct Answer:</strong> {{ q.answer }}</p>
            <p :class="{ correct: lastQuizResult.answers[index]?.trim().toLowerCase() === q.answer.trim().toLowerCase(), wrong: lastQuizResult.answers[index]?.trim().toLowerCase() !== q.answer.trim().toLowerCase() }">
              {{ lastQuizResult.answers[index]?.trim().toLowerCase() === q.answer.trim().toLowerCase() ? '✅ Correct' : '❌ Incorrect' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '@/firebase'; // Ensure db is imported from your firebase config
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged

const router = useRouter();

// User state (assuming it's handled globally or within an auth composition)
const user = ref(null); // This will hold the authenticated user object

// Quiz state
const questions = [
  {
    question: 'Given the local time of city P (0°, 30°W) is 12:00 pm, what is the local time of city Q (10°S, 60°W)?',
    answer: '10:00 am'
  },
  {
    question: 'Given the local time of city P (0°, 30°W) is 12:00 pm, what is the local time of city R (24°N, 10°W)?',
    answer: '2:00 pm'
  },
  {
    question: 'Local time of city S (33°S, 20°E) when P (0°, 30°W) is 12:00 pm?',
    answer: '2:00 pm'
  },
  {
    question: 'Local time of city T (81°N, 81°W) when P is 12:00 pm?',
    answer: '6:36 am'
  },
  {
    question: 'Jet from X (42°S, 150°E) to Y (8°N, 150°E), speed = 600 knots. Find local time at Z (10°S, 60°E) when jet lands.',
    answer: '2:00 pm'
  },
  {
    question: 'Airport C position from A(60°N,5°E) → B(60°N,17°E) then 600 nm North?',
    answer: '70°N, 17°E'
  },
  {
    question: 'Distance in nautical miles between A and B?',
    answer: '600 nm'
  },
  {
    question: 'Total flight time if speed is 300 knots?',
    answer: '2 hours'
  },
  {
    question: 'Arrival time at C if departure from A at 9:20am?',
    answer: '11:20 am'
  },
  {
    question: 'Final position (Q, R, S) after flying 1800 nm East, South, then West from P(0°, 40°W)?',
    answer: 'Q: 0°, 10°E; R: 30°S, 10°E; S: 30°S, 50°W'
  },
  {
    question: 'Average speed for 16hr total flight?',
    answer: '337.5 knots'
  },
  {
    question: 'Time taken from R to S if it is 2 hrs shorter than P to Q to R?',
    answer: '7 hrs'
  },
  {
    question: 'Shortest distance between M(45°N, 38°E) and N(45°N, 142°W)?',
    answer: '3720 nm'
  },
  {
    question: 'Plane from P(10°S, 62°E) due north 2 hrs @800 km/h. New position?',
    answer: '4.2°S, 62°E'
  },
  {
    question: 'Distance in nautical miles to 12°W westwards at same speed?',
    answer: '1350 nm'
  },
  {
    question: 'Time taken for that distance?',
    answer: '5 hrs'
  },
  {
    question: 'Local time at Q when left P at 1300 hrs?',
    answer: '11:12 am'
  },
  {
    question: 'Speed from A(60°N, 130°W) to B(60°N, 47°E), 1700 hrs arrival, left 1300 hrs?',
    answer: '660 knots'
  },
  {
    question: 'Time taken by S (West) to C(60°N, 133°N) @ 600knots?',
    answer: '2.2 hrs'
  },
  {
    question: 'Time taken by T (North) to C @ 600knots?',
    answer: '2 hrs'
  },
  {
    question: 'Local time at B if local time at D (23°N, 50°W) is 10:00am?',
    answer: '6:12 pm'
  }
];

const userAnswers = ref(Array(questions.length).fill(''));
const quizCompleted = ref(false);
const score = computed(() => {
  return questions.reduce((acc, q, i) => {
    return acc + (isCorrect(i) ? 1 : 0);
  }, 0);
});

const lastQuizResult = ref(null); // To store the last quiz result

// Auth state listener
let unsubscribe = null;

// Get user role from Firestore (if needed, otherwise remove)
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

// Initialize auth state listener
const initAuth = () => {
  unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      user.value = firebaseUser;
      const userRole = await getUserRole(firebaseUser.uid);
      
      // Set localStorage for router guard (if used)
      localStorage.setItem('user', JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email
      }));
      localStorage.setItem('role', userRole);

      // Load last quiz result when user logs in
      await loadLastQuizResult();

    } else {
      user.value = null;
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      lastQuizResult.value = null; // Clear last result on logout
      // Redirect to login or home if not authenticated
      router.push('/login'); // Example redirection
    }
  });
};

// Check if user is already authenticated on component mount
onMounted(() => {
  initAuth();
});

// Cleanup on unmount
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

// Quiz Methods
const isCorrect = (index) => {
  const user = userAnswers.value[index]?.trim().toLowerCase();
  const correct = questions[index].answer.trim().toLowerCase();
  return user === correct;
};

const submitQuiz = async () => {
  quizCompleted.value = true;
  if (user.value?.uid) {
    const result = {
      uid: user.value.uid,
      name: user.value.displayName || user.value.email,
      answers: userAnswers.value,
      score: score.value,
      total: questions.length,
      timestamp: serverTimestamp(),
    };
    await setDoc(doc(db, 'geo_quiz_results', user.value.uid), result);
    await loadLastQuizResult(); // Reload the last result after submitting
  }
};

const resetQuiz = () => {
  userAnswers.value = Array(questions.length).fill('');
  quizCompleted.value = false;
};

const loadLastQuizResult = async () => {
  if (user.value?.uid) {
    try {
      const docRef = doc(db, 'geo_quiz_results', user.value.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        lastQuizResult.value = docSnap.data();
      } else {
        lastQuizResult.value = null;
      }
    } catch (error) {
      console.error("Error loading last quiz result:", error);
      lastQuizResult.value = null;
    }
  }
};
</script>

<style scoped>
/* Base styles for the entire quiz container */
.geo-quiz-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2.5rem; /* Increased padding */
  background: #ffffff; /* White background */
  border-radius: 16px; /* Slightly more rounded corners */
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08); /* Softer, more spread out shadow */
  font-family: 'Inter', sans-serif; /* Modern, clean font */
  color: #333333; /* Darker text for better readability */
}

/* Header section styles */
.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem; /* Increased bottom margin */
  padding-bottom: 1rem;
  border-bottom: 1px solid #eeeeee; /* Subtle separator */
}

.quiz-header h1 {
  font-size: 2.2rem; /* Slightly larger heading */
  color: #2c3e50; /* Darker, more professional blue-grey */
  margin: 0;
  font-weight: 700; /* Bolder font */
}

/* Quiz Section (questions) */
.quiz-section {
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Spacing between question blocks */
}

.question-block {
  padding: 2rem; /* Increased padding */
  background: #fdfdfd; /* Very light background */
  border-radius: 12px; /* Nicely rounded */
  border: 1px solid #e0e0e0; /* Subtle border */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05); /* Very light shadow */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.question-block:hover {
  transform: translateY(-3px); /* Gentle lift on hover */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.question-block h3 {
  margin-top: 0;
  margin-bottom: 1.2rem; /* More space below heading */
  color: #34495e; /* Darker heading color */
  font-size: 1.25rem; /* Slightly larger question text */
  font-weight: 600;
}

textarea {
  width: 100%;
  padding: 1rem 1.2rem; /* More horizontal padding */
  border: 1px solid #cccccc; /* Softer border */
  border-radius: 8px;
  font-size: 1.05rem; /* Slightly larger text in textarea */
  resize: vertical;
  min-height: 120px; /* Taller textarea */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05); /* Inner shadow for depth */
}

textarea:focus {
  outline: none;
  border-color: #3498db; /* Blue focus color */
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.2); /* Blue glow */
}

.submit-btn, .retry-btn {
  width: auto; /* Allow button to size to content */
  align-self: flex-end; /* Align to the right */
  padding: 1.1rem 2.5rem; /* Larger, more prominent buttons */
  font-size: 1.1rem; /* Larger font */
  font-weight: 700; /* Bolder text */
  border: none;
  border-radius: 10px; /* More rounded */
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem; /* More space above buttons */
}

.submit-btn {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); /* Blue gradient */
  color: white;
  box-shadow: 0 6px 15px rgba(52, 152, 219, 0.25);
}

.submit-btn:hover {
  transform: translateY(-3px); /* More pronounced lift */
  box-shadow: 0 10px 20px rgba(52, 152, 219, 0.4);
}

.retry-btn {
  background: #f1f3f5; /* Light grey */
  color: #34495e; /* Dark text */
  border: 1px solid #dcdcdc; /* Subtle border */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.retry-btn:hover {
  background: #e2e6ea; /* Slightly darker grey */
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Results Section */
.results-section {
  padding: 1rem; /* Slightly less padding than whole container */
}

.results-section h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.score-display {
  font-size: 1.5rem; /* Larger score */
  font-weight: 700;
  margin-bottom: 2.5rem;
  color: #2c3e50;
  text-align: center;
  background-color: #ecf0f1; /* Light grey background for score */
  padding: 1rem 2rem;
  border-radius: 10px;
  display: inline-block; /* Make it fit content */
  margin-left: auto;
  margin-right: auto;
  display: block; /* Center the block */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.result-block {
  margin-bottom: 2rem; /* More space between result blocks */
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
  margin: 0.6rem 0; /* Slightly more vertical spacing for text */
  font-size: 1.05rem;
}

.result-block p strong {
  color: #555555; /* Slightly darker strong text */
}

.correct {
  color: #27ae60; /* Flat green */
  font-weight: 700;
  font-size: 1.1rem;
}

.wrong {
  color: #e74c3c; /* Flat red */
  font-weight: 700;
  font-size: 1.1rem;
}

/* Last Quiz Performance Section */
.last-quiz-section {
  margin-top: 3rem;
  padding: 2.5rem;
  background: #eaf2f8; /* Light blue background for last results */
  border-radius: 16px;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.05); /* Inner shadow for depth */
  border: 1px dashed #cccccc; /* Dashed border */
}

.last-quiz-section h3 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #dcdcdc;
  padding-bottom: 1rem;
}

.last-quiz-section p {
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  color: #444444;
}

.last-quiz-answers {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.last-result-block {
  padding: 1.5rem;
  background: #ffffff; /* White background for individual last results */
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.last-result-block p {
  margin: 0.4rem 0;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .geo-quiz-container {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .quiz-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .quiz-header h1 {
    font-size: 1.8rem;
  }

  .logout-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }

  .question-block {
    padding: 1.5rem;
  }

  .question-block h3 {
    font-size: 1.1rem;
  }

  textarea {
    min-height: 90px;
  }

  .submit-btn, .retry-btn {
    padding: 0.9rem 1.8rem;
    font-size: 1rem;
  }

  .results-section h2 {
    font-size: 1.8rem;
  }

  .score-display {
    font-size: 1.3rem;
  }

  .result-block {
    padding: 1.2rem;
  }

  .result-block h4 {
    font-size: 1.1rem;
  }

  .last-quiz-section {
    padding: 1.5rem;
  }

  .last-quiz-section h3 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .geo-quiz-container {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  .quiz-header h1 {
    font-size: 1.5rem;
  }
  
  .question-block {
    padding: 1rem;
  }
  
  .question-block h3 {
    font-size: 1rem;
  }

  textarea {
    min-height: 70px;
    font-size: 0.9rem;
  }

  .submit-btn, .retry-btn {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }

  .results-section h2 {
    font-size: 1.5rem;
  }

  .score-display {
    font-size: 1.1rem;
    padding: 0.8rem 1.5rem;
  }

  .result-block {
    padding: 1rem;
  }

  .last-quiz-section {
    padding: 1rem;
  }

  .last-quiz-section h3 {
    font-size: 1.3rem;
  }

  .last-result-block {
    padding: 1rem;
  }
}
</style>