<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <header class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">🌍 Longitude and latitudes learning System</h1>
        <p class="subtitle">Master Geographic Coordinates with Interactive Learning</p>
        <div class="cta-buttons">
          <button @click="navigateToLogin" class="cta-btn primary">Login</button>
          <button @click="navigateToLogin" class="cta-btn secondary">Get Started</button>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title">Key Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🌎</div>
          <h3>Interactive Globe</h3>
          <p>Explore a 3D globe with real-time coordinate visualization and measurement tools.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🧭</div>
          <h3>Precision Tools</h3>
          <p>Calculate distances, bearings, and areas with professional-grade accuracy.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Data Visualization</h3>
          <p>Import and visualize your own geographic data sets on our platform.</p>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <div class="about-content">
        <h2>About GeoLearn</h2>
        <p>
          GeoLearn revolutionizes how you learn longitude and latitude through an immersive platform featuring 3D globes,
          real-time calculations, and AI-powered guidance.
        </p>
        <p>
          Our system helps students, educators, and professionals master geographic coordinates with interactive tools and
          comprehensive learning resources.
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="page-footer">
      <p>© 2025 GeoLearn System. All rights reserved.</p>
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
.landing-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
  background-color: #fefefe;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  color: white;
  padding: 5rem 1rem;
  text-align: center;
  min-height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.2rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.4rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.cta-btn {
  padding: 0.85rem 2rem;
  border-radius: 9999px;
  font-weight: bold;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.cta-btn.primary {
  background-color: #ffffff;
  color: #1e3a8a;
  border: 2px solid transparent;
}

.cta-btn.primary:hover {
  background-color: #f3f4f6;
}

.cta-btn.secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.cta-btn.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Features Section */
.features-section {
  padding: 4rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.section-title {
  font-size: 2.2rem;
  margin-bottom: 3rem;
  color: #1e3a8a;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: #555;
  line-height: 1.6;
}

/* About Section */
.about-section {
  background-color: #f9fafb;
  padding: 4rem 1rem;
}

.about-content {
  max-width: 850px;
  margin: 0 auto;
  text-align: center;
}

.about-section h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1e3a8a;
}

.about-section p {
  margin-bottom: 1rem;
  line-height: 1.7;
  font-size: 1.05rem;
  color: #444;
}

/* Footer */
.page-footer {
  background-color: #1e3a8a;
  color: white;
  text-align: center;
  padding: 1.25rem;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.3rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .cta-btn {
    width: 80%;
    max-width: 300px;
  }
}
</style>
