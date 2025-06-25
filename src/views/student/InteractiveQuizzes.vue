<template>
  <div class="quizzes-container">
    <h1>Geographic Coordinates Quiz</h1>
    
    <div v-if="!quizCompleted" class="quiz-section">
      <div class="quiz-progress">
        Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>
      
      <div class="question-container">
        <h3>{{ currentQuestion.question }}</h3>
        
        <div v-if="currentQuestion.type === 'multiple-choice'" class="options">
          <button 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            @click="selectAnswer(option)"
            :class="{ 
              'selected': selectedAnswer === option,
              'correct': showFeedback && option === currentQuestion.answer,
              'incorrect': showFeedback && selectedAnswer === option && option !== currentQuestion.answer
            }"
          >
            {{ option }}
          </button>
        </div>
        
        <div v-else-if="currentQuestion.type === 'map-click'" class="map-quiz">
          <div class="map-display" ref="mapDisplay" @click="handleMapClick">
            <div class="grid-lines">
              <div class="equator"></div>
              <div class="prime-meridian"></div>
            </div>
            <div 
              v-if="selectedCoordinates" 
              class="selected-point"
              :style="{
                left: selectedCoordinates.x + '%',
                top: selectedCoordinates.y + '%'
              }"
            ></div>
            <div 
              v-if="showFeedback && currentQuestion.answer" 
              class="correct-point"
              :style="{
                left: currentQuestion.answer.x + '%',
                top: currentQuestion.answer.y + '%'
              }"
            ></div>
          </div>
          <div class="coordinates-display">
            <p v-if="selectedCoordinates">
              Selected: {{ formatMapCoordinates(selectedCoordinates) }}
            </p>
            <p v-if="showFeedback && currentQuestion.answer">
              Correct: {{ formatMapCoordinates(currentQuestion.answer) }}
            </p>
          </div>
        </div>
        
        <div v-if="showFeedback" class="feedback">
          <p :class="{ 'correct-feedback': isAnswerCorrect, 'incorrect-feedback': !isAnswerCorrect }">
            {{ isAnswerCorrect ? 'Correct!' : 'Incorrect' }}
          </p>
          <p class="explanation">{{ currentQuestion.explanation }}</p>
        </div>
        
        <button 
          v-if="!showFeedback && (selectedAnswer || selectedCoordinates)" 
          @click="checkAnswer"
          class="submit-btn"
        >
          Submit Answer
        </button>
        
        <button 
          v-else 
          @click="nextQuestion"
          class="next-btn"
        >
          {{ isLastQuestion ? 'See Results' : 'Next Question' }}
        </button>
      </div>
    </div>
    
    <div v-else class="results-section">
      <h2>Quiz Completed!</h2>
      <p class="score">Your score: {{ score }} / {{ questions.length }}</p>
      <p class="percentage">{{ Math.round((score / questions.length) * 100) }}%</p>
      
      <div class="breakdown">
        <h3>Question Breakdown</h3>
        <div v-for="(question, index) in questions" :key="index" class="question-review">
          <p><strong>Q{{ index + 1 }}:</strong> {{ question.question }}</p>
          <p :class="{ 'correct-answer': userAnswers[index] === question.answer, 'wrong-answer': userAnswers[index] !== question.answer }">
            Your answer: {{ formatUserAnswer(userAnswers[index], question.type) }}
          </p>
          <p>Correct answer: {{ formatUserAnswer(question.answer, question.type) }}</p>
          <p class="explanation">{{ question.explanation }}</p>
        </div>
      </div>
      
      <button @click="resetQuiz" class="retry-btn">Try Again</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const questions = [
  {
    type: 'multiple-choice',
    question: 'Which line represents 0° latitude?',
    options: [
      'Prime Meridian',
      'Equator',
      'International Date Line',
      'Tropic of Cancer'
    ],
    answer: 'Equator',
    explanation: 'The Equator is the line of 0° latitude, dividing the Earth into Northern and Southern Hemispheres.'
  },
  {
    type: 'multiple-choice',
    question: 'What is the maximum value for longitude?',
    options: [
      '90°',
      '180°',
      '360°',
      '45°'
    ],
    answer: '180°',
    explanation: 'Longitude ranges from 0° at the Prime Meridian to 180° East and West.'
  },
  {
    type: 'map-click',
    question: 'Click on the location that represents 0° latitude, 0° longitude',
    answer: { x: 50, y: 50 }, // Center of the map
    explanation: 'The point where the Equator (0° latitude) and Prime Meridian (0° longitude) intersect is off the west coast of Africa in the Atlantic Ocean.'
  },
  {
    type: 'multiple-choice',
    question: 'Which statement about latitude is correct?',
    options: [
      'Lines of latitude are all the same length',
      'Latitude measures east-west position',
      'The North Pole is at 90°N latitude',
      'Latitude lines converge at the poles'
    ],
    answer: 'The North Pole is at 90°N latitude',
    explanation: 'The North Pole is indeed at 90°N latitude. Latitude measures north-south position, and lines of latitude are not all the same length (they get smaller toward the poles).'
  },
  {
    type: 'map-click',
    question: 'Click on the approximate location of 30°N latitude, 90°W longitude',
    answer: { x: 25, y: 33.33 }, // Approximate position for New Orleans
    explanation: '30°N, 90°W is near New Orleans, Louisiana. This demonstrates how to estimate positions based on coordinate values.'
  }
];

const currentQuestionIndex = ref(0);
const selectedAnswer = ref(null);
const selectedCoordinates = ref(null);
const showFeedback = ref(false);
const isAnswerCorrect = ref(false);
const userAnswers = ref([]);
const score = ref(0);
const quizCompleted = ref(false);
const mapDisplay = ref(null);

const currentQuestion = computed(() => questions[currentQuestionIndex.value]);
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.length - 1);
const progressPercentage = computed(() => ((currentQuestionIndex.value + 1) / questions.length) * 100);

const selectAnswer = (answer) => {
  if (!showFeedback.value) {
    selectedAnswer.value = answer;
  }
};

const handleMapClick = (event) => {
  if (showFeedback.value) return;
  
  const rect = mapDisplay.value.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  
  selectedCoordinates.value = { x, y };
};

const checkAnswer = () => {
  showFeedback.value = true;
  
  if (currentQuestion.value.type === 'multiple-choice') {
    isAnswerCorrect.value = selectedAnswer.value === currentQuestion.value.answer;
  } else {
    // For map clicks, allow some margin of error
    const xDiff = Math.abs(selectedCoordinates.value.x - currentQuestion.value.answer.x);
    const yDiff = Math.abs(selectedCoordinates.value.y - currentQuestion.value.answer.y);
    isAnswerCorrect.value = xDiff < 10 && yDiff < 10;
  }
  
  userAnswers.value.push(
    currentQuestion.value.type === 'multiple-choice' 
      ? selectedAnswer.value 
      : selectedCoordinates.value
  );
  
  if (isAnswerCorrect.value) {
    score.value++;
  }
};

const nextQuestion = () => {
  showFeedback.value = false;
  selectedAnswer.value = null;
  selectedCoordinates.value = null;
  
  if (isLastQuestion.value) {
    quizCompleted.value = true;
  } else {
    currentQuestionIndex.value++;
  }
};

const resetQuiz = () => {
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  selectedCoordinates.value = null;
  showFeedback.value = false;
  userAnswers.value = [];
  score.value = 0;
  quizCompleted.value = false;
};

const formatMapCoordinates = (coords) => {
  const lat = 90 - coords.y * 1.8; // Convert % to degrees (0-180)
  const lng = coords.x * 3.6 - 180; // Convert % to degrees (0-360)
  
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  
  return `${Math.abs(lat.toFixed(1))}° ${latDir}, ${Math.abs(lng.toFixed(1))}° ${lngDir}`;
};

const formatUserAnswer = (answer, type) => {
  if (type === 'map-click') {
    return formatMapCoordinates(answer);
  }
  return answer;
};
</script>

<style scoped>
.quizzes-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #2d3748;
  margin-bottom: 20px;
  text-align: center;
}

.quiz-section {
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.quiz-progress {
  margin-bottom: 20px;
  text-align: center;
  color: #4a5568;
}

.progress-bar {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  margin-top: 8px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #3182ce;
  transition: width 0.3s;
}

.question-container {
  margin-top: 20px;
}

h3 {
  color: #2d3748;
  margin-bottom: 20px;
}

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.options button {
  padding: 12px;
  background-color: white;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.options button:hover {
  background-color: #ebf8ff;
  border-color: #90cdf4;
}

.options button.selected {
  background-color: #bee3f8;
  border-color: #63b3ed;
}

.options button.correct {
  background-color: #c6f6d5;
  border-color: #68d391;
}

.options button.incorrect {
  background-color: #fed7d7;
  border-color: #fc8181;
}

.map-quiz {
  margin-bottom: 20px;
}

.map-display {
  position: relative;
  width: 100%;
  height: 300px;
  background-color: #bee3f8;
  border: 1px solid #90cdf4;
  border-radius: 6px;
  cursor: crosshair;
  overflow: hidden;
}

.grid-lines {
  position: absolute;
  width: 100%;
  height: 100%;
}

.equator {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #f56565;
}

.prime-meridian {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #4299e1;
}

.selected-point, .correct-point {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.selected-point {
  background-color: #2b6cb0;
  border: 2px solid #ebf8ff;
}

.correct-point {
  background-color: #38a169;
  border: 2px solid #c6f6d5;
}

.coordinates-display {
  margin-top: 10px;
  font-family: monospace;
}

.feedback {
  margin: 20px 0;
  padding: 15px;
  border-radius: 6px;
}

.correct-feedback {
  color: #38a169;
  font-weight: bold;
  font-size: 1.2rem;
}

.incorrect-feedback {
  color: #e53e3e;
  font-weight: bold;
  font-size: 1.2rem;
}

.explanation {
  margin-top: 10px;
  color: #4a5568;
}

.submit-btn, .next-btn, .retry-btn {
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  display: block;
  margin: 20px auto 0;
}

.submit-btn:hover, .next-btn:hover, .retry-btn:hover {
  background-color: #2c5282;
}

.results-section {
  background-color: #f8fafc;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
}

.score {
  font-size: 1.5rem;
  margin: 20px 0;
}

.percentage {
  font-size: 2rem;
  font-weight: bold;
  color: #3182ce;
  margin-bottom: 30px;
}

.breakdown {
  text-align: left;
  margin-top: 30px;
}

.question-review {
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
}

.correct-answer {
  color: #38a169;
}

.wrong-answer {
  color: #e53e3e;
}

@media (max-width: 600px) {
  .options {
    grid-template-columns: 1fr;
  }
}
</style>