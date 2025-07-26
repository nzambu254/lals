<template>
  <div class="landing-page">
    <!-- Animated Background Elements -->
    <div class="bg-elements">
      <div class="floating-globe"></div>
      <div class="coordinate-lines"></div>
      <div class="pulse-ring"></div>
    </div>

    <!-- Main Content Container -->
    <div class="main-container">
      <!-- Left Panel - Hero Content -->
      <div class="hero-panel">
        <div class="hero-content">
          <div class="logo-section">
            <div class="globe-icon">🌍</div>
            <h1 class="hero-title">
              GeoLearn
              <span class="title-accent">Pro</span>
            </h1>
          </div>
          
          <div class="tagline">
            <h2>Master Geographic Coordinates</h2>
            <p class="subtitle">Interactive latitude & longitude learning system</p>
          </div>

          <div class="cta-section">
            <button @click="navigateToLogin" class="cta-btn primary-btn">
              <span class="btn-text">Start Learning</span>
              <div class="btn-glow"></div>
            </button>
            <button @click="navigateToLogin" class="cta-btn secondary-btn">
              <span class="btn-text">Sign In</span>
            </button>
          </div>

          <div class="stats-row">
            <div class="stat-item">
              <div class="stat-number">10K+</div>
              <div class="stat-label">Students</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">95%</div>
              <div class="stat-label">Success Rate</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50+</div>
              <div class="stat-label">Countries</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Interactive Visual Grid -->
      <div class="visual-panel">
        <div class="panel-header">
          <h3>Learning Modules</h3>
          <div class="header-line"></div>
        </div>
        
        <div class="module-grid">
          <div class="module-card latitude-card">
            <div class="card-icon">📍</div>
            <h4>Latitude Lines</h4>
            <p>Master horizontal coordinates</p>
            <div class="card-progress">
              <div class="progress-bar" style="width: 75%"></div>
            </div>
          </div>

          <div class="module-card longitude-card">
            <div class="card-icon">🗺️</div>
            <h4>Longitude Lines</h4>
            <p>Understand vertical coordinates</p>
            <div class="card-progress">
              <div class="progress-bar" style="width: 60%"></div>
            </div>
          </div>

          <div class="module-card navigation-card">
            <div class="card-icon">🧭</div>
            <h4>Navigation</h4>
            <p>Apply coordinate knowledge</p>
            <div class="card-progress">
              <div class="progress-bar" style="width: 40%"></div>
            </div>
          </div>

          <div class="module-card practical-card">
            <div class="card-icon">🚀</div>
            <h4>Real World</h4>
            <p>GPS & practical applications</p>
            <div class="card-progress">
              <div class="progress-bar" style="width: 85%"></div>
            </div>
          </div>
        </div>

        <div class="quick-facts">
          <div class="fact-item">
            <span class="fact-icon">⚡</span>
            <span>Interactive Learning</span>
          </div>
          <div class="fact-item">
            <span class="fact-icon">🎯</span>
            <span>Gamified Experience</span>
          </div>
          <div class="fact-item">
            <span class="fact-icon">📱</span>
            <span>Mobile Friendly</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Strip -->
    <div class="footer-strip">
      <span>&copy; 2025 GeoLearn System</span>
      <div class="footer-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
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
/* Reset and Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.landing-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: linear-gradient(135deg, #303553 0%, #0b0a0c 100%);
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Animated Background Elements */
.bg-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.floating-globe {
  position: absolute;
  top: 20%;
  right: 10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  backdrop-filter: blur(10px);
}

.coordinate-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: drift 20s linear infinite;
}

.pulse-ring {
  position: absolute;
  bottom: 15%;
  left: 15%;
  width: 150px;
  height: 150px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: pulse 4s ease-in-out infinite;
}

/* Main Container */
.main-container {
  display: flex;
  height: calc(100vh - 40px);
  z-index: 1;
  position: relative;
}

/* Hero Panel */
.hero-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-content {
  max-width: 500px;
  color: white;
  text-align: center;
}

.logo-section {
  margin-bottom: 2rem;
}

.globe-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: rotate 10s linear infinite;
  display: inline-block;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-accent {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  opacity: 0.95;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
  margin-bottom: 2.5rem;
  line-height: 1.5;
}

/* CTA Section */
.cta-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.cta-btn {
  position: relative;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  min-width: 140px;
}

.primary-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
}

.primary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 107, 107, 0.6);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.primary-btn:hover .btn-glow {
  left: 100%;
}

/* Stats Row */
.stats-row {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 0.2rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Visual Panel */
.visual-panel {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
}

.panel-header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.panel-header h3 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.header-line {
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  margin: 0 auto;
  border-radius: 2px;
}

/* Module Grid */
.module-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  flex: 1;
  margin-bottom: 2rem;
}

.module-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  color: white;
  position: relative;
  overflow: hidden;
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s;
}

.module-card:hover::before {
  left: 100%;
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  display: block;
}

.module-card h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.module-card p {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.card-progress {
  background: rgba(255, 255, 255, 0.2);
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Quick Facts */
.quick-facts {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  color: white;
}

.fact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.fact-icon {
  font-size: 1.2rem;
}

/* Footer Strip */
.footer-strip {
  height: 40px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2;
}

.footer-dots {
  display: flex;
  gap: 0.5rem;
}

.footer-dots span {
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: blink 2s ease-in-out infinite;
}

.footer-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.footer-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes drift {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes blink {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-container {
    flex-direction: column;
  }
  
  .hero-panel {
    flex: 0 0 auto;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .tagline h2 {
    font-size: 1.4rem;
  }
  
  .visual-panel {
    padding: 1.5rem;
  }
  
  .module-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .stats-row {
    gap: 0.5rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .globe-icon {
    font-size: 3rem;
  }
  
  .cta-section {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-btn {
    width: 200px;
  }
  
  .module-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-facts {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  
  .footer-strip {
    padding: 0 1rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .hero-panel, .visual-panel {
    padding: 1rem;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .tagline h2 {
    font-size: 1.2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .stats-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .module-card {
    padding: 1rem;
  }
  
  .floating-globe {
    width: 120px;
    height: 120px;
  }
}
</style>