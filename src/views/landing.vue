<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <header class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="emoji">🌍</span> Longitude & Latitude Learning System
        </h1>
        <p class="subtitle">Master Geographic Coordinates with Interactive Learning</p>
        <div class="cta-buttons">
          <button @click="navigateToLogin" class="cta-btn primary-btn">Login</button>
          <button @click="navigateToLogin" class="cta-btn secondary-btn">Get Started</button>
        </div>
      </div>
    </header>

    <!-- Footer -->
    <footer class="page-footer">
      <p>&copy; 2025 GeoLearn System. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* Base Styles */
.landing-page {
  font-family: 'Inter', sans-serif; /* A clean, modern font */
  color: #333333; /* Soft dark grey for text */
  background-color: #f9f9f9; /* Very light grey background */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(145deg, #e0efff 0%, #d0e7ff 100%); /* Soft, light blue gradient */
  color: #2c3e50; /* Darker blue for text on light background */
  padding: 6rem 1.5rem; /* More vertical padding */
  text-align: center;
  flex-grow: 1; /* Occupy remaining vertical space */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden; /* For subtle background elements */
}

/* Subtle background circles (decorative) */
.hero-section::before,
.hero-section::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.3); /* Translucent white circles */
  border-radius: 50%;
  z-index: 0;
  filter: blur(50px); /* Soft blur effect */
}

.hero-section::before {
  width: 150px;
  height: 150px;
  top: 10%;
  left: 10%;
}

.hero-section::after {
  width: 200px;
  height: 200px;
  bottom: 5%;
  right: 8%;
}


.hero-content {
  max-width: 850px; /* Slightly wider content area */
  margin: 0 auto;
  position: relative; /* Bring content above pseudo-elements */
  z-index: 1;
}

.hero-title {
  font-size: 3.8rem; /* Larger, more impactful title */
  font-weight: 800; /* Extra bold */
  margin-bottom: 1.2rem;
  line-height: 1.2;
  color: #1a2c3e; /* Very dark blue for strong contrast */
  text-shadow: 1px 1px 2px rgba(0,0,0,0.05); /* Subtle text shadow */
}

.hero-title .emoji {
  font-size: 0.9em; /* Adjust emoji size relative to text */
  vertical-align: middle;
  margin-right: 10px;
}

.subtitle {
  font-size: 1.6rem; /* Clear and inviting subtitle */
  margin-bottom: 2.5rem;
  color: #4a6572; /* Muted blue-grey */
  font-weight: 400;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem; /* More space between buttons */
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 3rem;
}

.cta-btn {
  padding: 1rem 2.5rem; /* Generous padding */
  border-radius: 30px; /* Pill-shaped buttons */
  font-weight: 600; /* Semi-bold */
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1.1rem; /* Slightly larger font */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Subtle initial shadow */
}

.primary-btn {
  background-color: #007bff; /* Vibrant blue */
  color: white;
}

.primary-btn:hover {
  background-color: #0056b3; /* Darker blue on hover */
  transform: translateY(-3px); /* Lift effect */
  box-shadow: 0 8px 15px rgba(0, 123, 255, 0.3);
}

.secondary-btn {
  background-color: #f0f4f8; /* Very light grey */
  color: #007bff; /* Blue text */
  border: 1px solid #cce0ff; /* Light blue border */
}

.secondary-btn:hover {
  background-color: #e2e8f0; /* Slightly darker light grey on hover */
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

/* Footer */
.page-footer {
  background-color: #e0efff; /* Matches hero's lighter tone */
  color: #4a6572; /* Muted text color */
  text-align: center;
  padding: 1.5rem; /* More padding */
  font-size: 0.95rem;
  border-top: 1px solid #cce0ff; /* Subtle top border */
}

/* Responsive */
@media (max-width: 900px) {
  .hero-title {
    font-size: 3rem;
  }
  .subtitle {
    font-size: 1.4rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 1rem;
  }
  .hero-title {
    font-size: 2.5rem;
  }
  .subtitle {
    font-size: 1.2rem;
  }
  .cta-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .cta-btn {
    width: 90%;
    max-width: 300px;
    font-size: 1em;
    padding: 0.8rem 2rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 3rem 0.8rem;
  }
  .hero-title {
    font-size: 2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
}
</style>
