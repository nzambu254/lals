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

    <!-- Image Gallery Section -->
    <section class="image-gallery">
      <h2 class="section-title">Explore the World of Coordinates</h2>
      <p class="section-subtitle">Visual learning makes understanding latitude and longitude easier</p>
      
      <div class="gallery-grid">
        <div class="gallery-card">
          <img src="/assets/lat1.jpeg" alt="Earth's grid system" class="card-image">
          <div class="card-content">
            <h3>The Earth's Grid System</h3>
            <p>Latitude lines run east-west and measure distance north or south of the equator. Longitude lines run north-south and measure distance east or west of the prime meridian.</p>
          </div>
        </div>
        
        <div class="gallery-card">
          <img src="/assets/lat2.jpeg" alt="Latitude visualization" class="card-image">
          <div class="card-content">
            <h3>Understanding Latitude</h3>
            <p>Latitude ranges from 0° at the Equator to 90° at the poles. The most important latitudes are the Tropic of Cancer (23.5°N), Tropic of Capricorn (23.5°S), Arctic Circle (66.5°N), and Antarctic Circle (66.5°S).</p>
          </div>
        </div>
        
        <div class="gallery-card">
          <img src="/assets/lat3.jpeg" alt="Longitude visualization" class="card-image">
          <div class="card-content">
            <h3>Mastering Longitude</h3>
            <p>Longitude lines converge at the poles. The prime meridian (0°) passes through Greenwich, England. Time zones are based on longitude, with each 15° representing approximately one hour of time difference.</p>
          </div>
        </div>
        
        <div class="gallery-card">
          <img src="/assets/lat4.jpeg" alt="Practical applications" class="card-image">
          <div class="card-content">
            <h3>Practical Applications</h3>
            <p>Coordinates are essential for navigation, GPS systems, weather forecasting, and mapping. Understanding them helps in everything from hiking to international shipping and aviation.</p>
          </div>
        </div>
      </div>
    </section>

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

/* Hero Section - Made smaller and thinner */
.hero-section {
  background: linear-gradient(145deg, #e0efff 0%, #d0e7ff 100%); /* Soft, light blue gradient */
  color: #2c3e50; /* Darker blue for text on light background */
  padding: 3rem 1.5rem; /* Reduced from 6rem to 3rem */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden; /* For subtle background elements */
  min-height: auto; /* Removed flex-grow and use auto height */
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
  font-size: 2.8rem; /* Reduced from 3.8rem */
  font-weight: 700; /* Reduced from 800 */
  margin-bottom: 1rem; /* Reduced from 1.2rem */
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
  font-size: 1.3rem; /* Reduced from 1.6rem */
  margin-bottom: 1.5rem; /* Reduced from 2.5rem */
  color: #4a6572; /* Muted blue-grey */
  font-weight: 400;
}

.cta-buttons {
  display: flex;
  gap: 1.2rem; /* Reduced from 1.5rem */
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.5rem; /* Reduced from 3rem */
}

.cta-btn {
  padding: 0.8rem 2rem; /* Reduced from 1rem 2.5rem */
  border-radius: 25px; /* Slightly smaller border radius */
  font-weight: 600; /* Semi-bold */
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem; /* Reduced from 1.1rem */
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

/* Image Gallery Section */
.image-gallery {
  padding: 4rem 2rem; /* Reduced from 5rem */
  background-color: white;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  color: #1a2c3e;
  margin-bottom: 1rem;
  font-weight: 700;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #4a6572;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.gallery-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #e0e0e0;
}

.card-content {
  padding: 1.5rem;
  text-align: left;
}

.card-content h3 {
  font-size: 1.3rem;
  color: #1a2c3e;
  margin-bottom: 0.8rem;
}

.card-content p {
  color: #4a6572;
  line-height: 1.6;
  font-size: 0.95rem;
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
    font-size: 2.4rem; /* Adjusted for new smaller base size */
  }
  .subtitle {
    font-size: 1.2rem;
  }
  .section-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2.5rem 1rem; /* Reduced from 4rem */
  }
  .hero-title {
    font-size: 2rem; /* Reduced from 2.5rem */
  }
  .subtitle {
    font-size: 1.1rem; /* Reduced from 1.2rem */
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
  .image-gallery {
    padding: 3rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 2rem 0.8rem; /* Reduced from 3rem */
  }
  .hero-title {
    font-size: 1.8rem; /* Reduced from 2rem */
  }
  .subtitle {
    font-size: 1rem;
  }
  .section-title {
    font-size: 1.8rem;
  }
  .section-subtitle {
    font-size: 1rem;
  }
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>