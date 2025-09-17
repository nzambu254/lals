<template>
  <div class="home-container">
    <section class="hero-section">
      <div class="hero-content">
        <h1>Welcome to PrimeLearn</h1>
        <p>Enhance your learning with interactive flashcards, quizzes, and progress tracking.</p>
        <div class="cta-buttons">
          <RouterLink to="/login" class="cta-button primary">Get Started</RouterLink>
          <RouterLink to="/login" class="cta-button secondary">Login</RouterLink>
        </div>
      </div>
      <div class="hero-image">
        <img :src="heroImage" alt="Students learning together" />
      </div>
    </section>

    <section class="features-section">
      <h2>Our Features</h2>
      <div class="features-grid">
        <div class="feature-card" v-for="feature in features" :key="feature.title">
          <div class="feature-icon">
            <img :src="feature.icon" :alt="feature.title" />
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
        </div>
      </div>
    </section>

    <section class="testimonial-section">
      <div class="testimonial-content">
        <img
          src="https://img.icons8.com/fluency/96/user-male-circle.png"
          alt="Happy student"
          class="testimonial-avatar"
        />
        <div class="testimonial-text">
          <blockquote>"PrimeLearn helped me improve my test scores by 30% in just one month!"</blockquote>
          <p class="testimonial-author">- Sarah Johnson, Medical Student</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import heroImage from '@/assets/image.jpeg'
import flashcardImg from '@/assets/flashcard.jpeg'
import quizImg from '@/assets/quiz.jpeg'
import progImg from '@/assets/prog.jpeg'

const features = [
  {
    title: 'Flashcards',
    text: 'Create and study with interactive flashcards to improve retention.',
    icon: flashcardImg,
  },
  {
    title: 'Quizzes',
    text: 'Test your knowledge with customizable quizzes.',
    icon: quizImg,
  },
  {
    title: 'Progress Tracking',
    text: 'Monitor your learning progress with detailed analytics.',
    icon: progImg,
  },
]
</script>

<style scoped>
.home-container {
  height: auto; /* changed from 100vh to auto to allow scrolling */
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  box-sizing: border-box;
  /* overflow: hidden removed to prevent cutting off content */
}

/* Hero section */
.hero-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(3, 169, 244, 0.1) 100%);
  border-radius: 0.75rem;
  padding: 1.5rem;
}
.hero-content {
  flex: 1;
}
.hero-content h1 {
  font-size: 2.2rem;
  margin-bottom: 0.75rem;
  background: linear-gradient(90deg, #1e40af, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}
.hero-content p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #374151;
  max-width: 80%;
}
.cta-buttons {
  display: flex;
  gap: 1rem;
}
.cta-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
}
.cta-button.primary {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
}
.cta-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(30, 64, 175, 0.3);
}
.cta-button.secondary {
  border: 2px solid #1e40af;
  color: #1e40af;
  background: white;
}
.cta-button.secondary:hover {
  background-color: #f8fafc;
}
.hero-image img {
  height: 280px; /* increased from 200px */
  border-radius: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Features section */
.features-section {
  flex: 1;
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
.features-section h2 {
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}
.feature-card {
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem 0.8rem; /* increased padding for bigger images */
  transition: transform 0.3s ease;
  text-align: center; /* center the text */
}
.feature-card:hover {
  transform: translateY(-5px);
}
.feature-icon img {
  width: 100px; /* increased from 70px */
  height: 100px; /* increased from 70px */
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 0.8rem;
}
.feature-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}
.feature-card p {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.4;
}

/* Testimonial section */
.testimonial-section {
  flex: 0.8;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  border-radius: 0.75rem;
  color: white;
  padding: 1.5rem;
  display: flex;
  align-items: center;
}
.testimonial-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}
.testimonial-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}
blockquote {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
  font-style: italic;
}
.testimonial-author {
  font-size: 0.9rem;
  opacity: 0.9;
}
</style>
