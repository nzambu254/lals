<template>
  <div class="quiz-container">
    <div v-if="!quizStarted" class="quiz-start">
      <h1>Prime Numbers Quiz</h1>
      <div class="quiz-options">
        <div class="option-card" @click="startQuiz('identification')">
          <h2>Prime Identification</h2>
          <p>Identify whether numbers are prime or composite</p>
        </div>
        <div class="option-card" @click="startQuiz('factorization')">
          <h2>Prime Factorization</h2>
          <p>Find the prime factors of composite numbers</p>
        </div>
        <div class="option-card" @click="startQuiz('difficult')" v-if="user && difficultNumbers.length > 0">
          <h2>Difficult Numbers</h2>
          <p>Focus on numbers you've marked as difficult</p>
        </div>
      </div>
      
      <div class="difficulty-selector" v-if="quizMode">
        <h3>Select Difficulty:</h3>
        <div class="difficulty-options">
          <button 
            v-for="level in difficultyLevels" 
            :key="level.value"
            @click="setDifficulty(level.value)"
            :class="{ active: difficulty === level.value }"
          >
            {{ level.label }}
          </button>
        </div>
      </div>
      
      <button v-if="quizMode" @click="startQuizWithOptions" class="start-quiz-btn">
        Start Quiz
      </button>
    </div>
    
    <div v-else class="quiz-active">
      <div class="quiz-header">
        <h2>{{ quizTitle }}</h2>
        <div class="quiz-progress">
          <span>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
      </div>
      
      <div class="question-container">
        <div v-if="quizType === 'identification'" class="identification-question">
          <h3>Is {{ currentQuestion.number }} a prime number?</h3>
          <div class="answer-options">
            <button @click="checkAnswer(true)" class="answer-btn prime-btn">Yes, it's prime</button>
            <button @click="checkAnswer(false)" class="answer-btn composite-btn">No, it's composite</button>
          </div>
        </div>
        
        <div v-else-if="quizType === 'factorization'" class="factorization-question">
          <h3>What are the prime factors of {{ currentQuestion.number }}?</h3>
          <div class="factor-inputs">
            <div 
              v-for="(input, index) in factorInputs" 
              :key="index"
              class="factor-input"
            >
              <input 
                type="number" 
                v-model.number="factorInputs[index]"
                min="2"
                @keyup.enter="submitFactorization"
                placeholder="Enter prime factor"
              >
              <span v-if="index < factorInputs.length - 1">×</span>
            </div>
            <button @click="addFactorInput" class="add-factor-btn">+</button>
          </div>
          <button @click="submitFactorization" class="submit-btn">Submit</button>
        </div>
      </div>
      
      <div v-if="showFeedback" class="feedback" :class="{ correct: isCorrect, incorrect: !isCorrect }">
        <h3>{{ isCorrect ? 'Correct!' : 'Incorrect' }}</h3>
        <p v-if="!isCorrect && quizType === 'identification'">
          {{ currentQuestion.number }} is {{ currentQuestion.isPrime ? 'prime' : 'composite' }}.
          <span v-if="!currentQuestion.isPrime">
            Its factors are: {{ currentQuestion.factors.join(', ') }}
          </span>
        </p>
        <p v-if="!isCorrect && quizType === 'factorization'">
          The correct prime factors are: {{ currentQuestion.primeFactors.join(' × ') }}
        </p>
        <button @click="nextQuestion" class="next-btn">
          {{ isLastQuestion ? 'See Results' : 'Next Question' }}
        </button>
      </div>
      
      <div class="score-display">
        <span>Score: {{ score }}/{{ questions.length }}</span>
        <span>Streak: {{ streak }} {{ streakEmoji }}</span>
      </div>
    </div>
    
    <div v-if="quizCompleted" class="quiz-results">
      <h2>Quiz Completed!</h2>
      <div class="result-card">
        <h3>Your Score</h3>
        <div class="score-circle" :style="scoreCircleStyle">
          <span>{{ Math.round((score / questions.length) * 100) }}%</span>
        </div>
        <p>You got {{ score }} out of {{ questions.length }} questions correct</p>
      </div>
      
      <div class="result-details">
        <div class="detail-card">
          <h4>Correct Answers</h4>
          <p>{{ score }}</p>
        </div>
        <div class="detail-card">
          <h4>Incorrect Answers</h4>
          <p>{{ questions.length - score }}</p>
        </div>
        <div class="detail-card">
          <h4>Longest Streak</h4>
          <p>{{ maxStreak }}</p>
        </div>
      </div>
      
      <div class="quiz-actions">
        <button @click="restartQuiz" class="action-btn retry-btn">Try Again</button>
        <button @click="returnToDashboard" class="action-btn dashboard-btn">Back to Dashboard</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

export default {
  name: 'Quiz',
  data() {
    return {
      quizStarted: false,
      quizCompleted: false,
      quizType: null,
      quizMode: null,
      difficulty: 'medium',
      difficultyLevels: [
        { value: 'easy', label: 'Easy (1-50)' },
        { value: 'medium', label: 'Medium (1-100)' },
        { value: 'hard', label: 'Hard (1-200)' }
      ],
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      showFeedback: false,
      isCorrect: false,
      factorInputs: [null],
      difficultNumbers: []
    };
  },
  computed: {
    ...mapState(['user']),
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || {};
    },
    progressPercentage() {
      return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    },
    isLastQuestion() {
      return this.currentQuestionIndex === this.questions.length - 1;
    },
    quizTitle() {
      if (this.quizType === 'identification') return 'Prime Identification Quiz';
      if (this.quizType === 'factorization') return 'Prime Factorization Quiz';
      return 'Prime Numbers Quiz';
    },
    streakEmoji() {
      if (this.streak >= 5) return '🔥';
      if (this.streak >= 3) return '👍';
      return '';
    },
    scoreCircleStyle() {
      const percentage = (this.score / this.questions.length) * 100;
      let color;
      if (percentage >= 80) color = '#4CAF50';
      else if (percentage >= 50) color = '#FFC107';
      else color = '#F44336';
      return {
        background: `conic-gradient(${color} ${percentage}%, #eee ${percentage}% 100%)`
      };
    }
  },
  async created() {
    if (this.$route.query.mode === 'quick') {
      this.quizMode = 'quick';
      this.startQuiz('identification');
    }
    if (this.user) {
      await this.fetchDifficultNumbers();
    }
  },
  methods: {
    setDifficulty(level) {
      this.difficulty = level;
    },
    async fetchDifficultNumbers() {
      try {
        const userDoc = await getDoc(doc(db, 'users', this.user.uid));
        if (userDoc.exists()) {
          this.difficultNumbers = userDoc.data().difficultNumbers || [];
        }
      } catch (error) {
        console.error("Error fetching difficult numbers:", error);
      }
    },
    startQuiz(type) {
      this.quizType = type;
      if (type === 'difficult') {
        this.questions = this.difficultNumbers.map(num => ({
          number: num,
          isPrime: this.isPrime(num),
          factors: this.getFactors(num),
          primeFactors: this.getPrimeFactors(num)
        }));
      } else {
        this.questions = this.generateQuestions(type);
      }
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.streak = 0;
      this.maxStreak = 0;
      this.quizStarted = true;
      this.quizCompleted = false;
    },
    startQuizWithOptions() {
      if (this.quizMode) {
        this.startQuiz(this.quizMode);
      }
    },
    generateQuestions(type) {
      const questions = [];
      const numQuestions = 10;
      let maxNum;
      if (this.difficulty === 'easy') maxNum = 50;
      else if (this.difficulty === 'medium') maxNum = 100;
      else maxNum = 200;
      for (let i = 0; i < numQuestions; i++) {
        const number = Math.floor(Math.random() * maxNum) + 2;
        questions.push({
          number,
          isPrime: this.isPrime(number),
          factors: this.getFactors(number),
          primeFactors: this.getPrimeFactors(number)
        });
      }
      return questions;
    },
    isPrime(num) {
      if (num <= 1) return false;
      if (num <= 3) return true;
      if (num % 2 === 0 || num % 3 === 0) return false;
      for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
      }
      return true;
    },
    getFactors(num) {
      const factors = [];
      for (let i = 1; i <= num; i++) {
        if (num % i === 0) factors.push(i);
      }
      return factors;
    },
    getPrimeFactors(num) {
      const factors = [];
      let n = num;
      while (n % 2 === 0) {
        factors.push(2);
        n = n / 2;
      }
      for (let i = 3; i * i <= n; i += 2) {
        while (n % i === 0) {
          factors.push(i);
          n = n / i;
        }
      }
      if (n > 2) factors.push(n);
      return factors;
    },
    checkAnswer(answer) {
      const correct = this.currentQuestion.isPrime === answer;
      this.isCorrect = correct;
      this.showFeedback = true;
      this.recordAnswer(correct);
    },
    addFactorInput() {
      this.factorInputs.push(null);
    },
    submitFactorization() {
      const userFactors = this.factorInputs.filter(f => f !== null).sort((a, b) => a - b);
      const correctFactors = [...this.currentQuestion.primeFactors].sort((a, b) => a - b);
      const correct = JSON.stringify(userFactors) === JSON.stringify(correctFactors);
      this.isCorrect = correct;
      this.showFeedback = true;
      this.recordAnswer(correct);
    },
    recordAnswer(correct) {
      if (correct) {
        this.score++;
        this.streak++;
        this.maxStreak = Math.max(this.maxStreak, this.streak);
      } else {
        this.streak = 0;
        if (this.user) {
          this.saveDifficultNumber(this.currentQuestion.number);
        }
      }
    },
    async saveDifficultNumber(number) {
      try {
        await updateDoc(doc(db, 'users', this.user.uid), {
          difficultNumbers: arrayUnion(number)
        });
      } catch (error) {
        console.error("Error saving difficult number:", error);
      }
    },
    nextQuestion() {
      this.showFeedback = false;
      this.factorInputs = [null];
      if (this.isLastQuestion) {
        this.completeQuiz();
      } else {
        this.currentQuestionIndex++;
      }
    },
    completeQuiz() {
      this.quizStarted = false;
      this.quizCompleted = true;
      if (this.user) {
        this.saveQuizResults();
      }
    },
    async saveQuizResults() {
      try {
        const userRef = doc(db, 'users', this.user.uid);
        await updateDoc(userRef, {
          quizzesCompleted: increment(1),
          totalScore: increment(this.score),
          lastQuizScore: this.score
        });
      } catch (error) {
        console.error("Error saving quiz results:", error);
      }
    },
    restartQuiz() {
      this.quizStarted = false;
      this.quizCompleted = false;
      this.quizType = null;
    },
    returnToDashboard() {
      this.$router.push('/student/dashboard');
    }
  }
};
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.quiz-start {
  text-align: center;
}

.quiz-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.option-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.option-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.option-card h2 {
  margin-top: 0;
  color: #2c3e50;
}

.option-card p {
  color: #666;
}

.difficulty-selector {
  margin: 30px 0;
}

.difficulty-selector h3 {
  margin-bottom: 15px;
}

.difficulty-options {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.difficulty-options button {
  padding: 8px 16px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.difficulty-options button.active {
  background-color: #2c3e50;
  color: white;
}

.start-quiz-btn {
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-quiz-btn:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.quiz-active {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.quiz-progress {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  width: 150px;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.question-container {
  margin: 30px 0;
}

.identification-question h3 {
  font-size: 1.5rem;
  margin-bottom: 30px;
  text-align: center;
}

.answer-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.answer-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.prime-btn {
  background-color: #4CAF50;
  color: white;
}

.composite-btn {
  background-color: #F44336;
  color: white;
}

.answer-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.factorization-question h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
}

.factor-inputs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.factor-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.factor-input input {
  width: 80px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 1rem;
}

.add-factor-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #2196F3;
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn {
  display: block;
  margin: 0 auto;
  padding: 12px 24px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.feedback {
  margin: 30px 0;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.feedback.correct {
  background-color: #E8F5E9;
  border: 1px solid #C8E6C9;
}

.feedback.incorrect {
  background-color: #FFEBEE;
  border: 1px solid #FFCDD2;
}

.feedback h3 {
  margin-top: 0;
}

.next-btn {
  padding: 10px 20px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  margin-top: 15px;
  cursor: pointer;
}

.score-display {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-top: 20px;
}

.quiz-results {
  text-align: center;
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.result-card {
  margin: 30px 0;
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.result-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.detail-card {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
}

.detail-card h4 {
  margin-top: 0;
  color: #666;
}

.detail-card p {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0;
}

.quiz-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn {
  background-color: #2196F3;
  color: white;
}

.dashboard-btn {
  background-color: #9E9E9E;
  color: white;
}

.action-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .quiz-options {
    grid-template-columns: 1fr;
  }
  
  .answer-options {
    flex-direction: column;
    align-items: center;
  }
  
  .quiz-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>