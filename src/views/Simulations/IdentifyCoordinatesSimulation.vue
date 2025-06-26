<template>
  <div class="simulation-container">
    <h2>Task: Identify Coordinates</h2>
    <p class="instruction">Identify the latitude and longitude of the marked point on the map. (This is a simplified representation)</p>

    <div class="map-area">
      <div class="map-grid">
        <div class="grid-line horizontal top-line">90°N</div>
        <div class="grid-line horizontal middle-line">0° (Equator)</div>
        <div class="grid-line horizontal bottom-line">90°S</div>

        <div class="grid-line vertical left-line">180°W</div>
        <div class="grid-line vertical prime-meridian">0° (Prime Meridian)</div>
        <div class="grid-line vertical right-line">180°E</div>

        <div class="target-point" :style="{ top: targetPoint.y, left: targetPoint.x }"></div>
      </div>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label for="userLat">Your Latitude:</label>
        <input type="number" id="userLat" v-model.number="userGuess.lat" min="0" max="90" step="1" placeholder="e.g. 40">
        <select v-model="userGuess.latDir">
          <option value="N">N</option>
          <option value="S">S</option>
        </select>
      </div>
      <div class="input-group">
        <label for="userLng">Your Longitude:</label>
        <input type="number" id="userLng" v-model.number="userGuess.lng" min="0" max="180" step="1" placeholder="e.g. 70">
        <select v-model="userGuess.lngDir">
          <option value="E">E</option>
          <option value="W">W</option>
        </select>
      </div>
      <button @click="checkAnswer" class="submit-btn">Check Answer</button>
    </div>

    <div v-if="feedback" class="feedback-section">
      <p :class="feedback.type">{{ feedback.message }}</p>
      <button @click="resetTask" class="reset-btn">Next Point</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const targetPoint = ref({ x: '55%', y: '30%' }); // Example point for visual
const actualCoordinates = ref({ lat: 50, latDir: 'N', lng: 90, lngDir: 'E' }); // Actual hidden coordinates

const userGuess = ref({ lat: null, latDir: 'N', lng: null, lngDir: 'E' });
const feedback = ref(null);

const generateRandomPoint = () => {
  const lat = Math.floor(Math.random() * 91); // 0-90
  const latDir = Math.random() > 0.5 ? 'N' : 'S';
  const lng = Math.floor(Math.random() * 181); // 0-180
  const lngDir = Math.random() > 0.5 ? 'E' : 'W';

  actualCoordinates.value = { lat, latDir, lng, lngDir };

  // Calculate visual position (simplified: 0% to 100%)
  // Lat: 90N at 0%, 0 at 50%, 90S at 100%
  // Lng: 180W at 0%, 0 at 50%, 180E at 100%
  const visualY = 50 - (lat * (latDir === 'N' ? 0.5 : -0.5)); // Map 90N to 5%, 90S to 95%
  const visualX = 50 + (lng * (lngDir === 'E' ? 0.25 : -0.25)); // Map 180W to 5%, 180E to 95%

  targetPoint.value = {
    y: `${Math.max(5, Math.min(95, visualY))}%`, // Clamp to avoid going off-screen
    x: `${Math.max(5, Math.min(95, visualX))}%`
  };
};

const checkAnswer = () => {
  if (userGuess.value.lat === actualCoordinates.value.lat &&
      userGuess.value.latDir === actualCoordinates.value.latDir &&
      userGuess.value.lng === actualCoordinates.value.lng &&
      userGuess.value.lngDir === actualCoordinates.value.lngDir) {
    feedback.value = { type: 'success', message: '🎉 Correct! Well done.' };
  } else {
    feedback.value = {
      type: 'error',
      message: `❌ Incorrect. The correct answer was ${actualCoordinates.value.lat}°${actualCoordinates.value.latDir}, ${actualCoordinates.value.lng}°${actualCoordinates.value.lngDir}.`
    };
  }
};

const resetTask = () => {
  userGuess.value = { lat: null, latDir: 'N', lng: null, lngDir: 'E' };
  feedback.value = null;
  generateRandomPoint(); // Generate a new point for the next round
};

// Initial task generation when component mounts
generateRandomPoint();
</script>

<style scoped>
.simulation-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  text-align: center;
}

h2 {
  color: #007bff;
  margin-bottom: 20px;
  font-size: 2em;
  font-weight: 700;
}

.instruction {
  font-size: 1.1em;
  color: #555;
  margin-bottom: 25px;
  line-height: 1.6;
}

.map-area {
  width: 100%;
  padding-bottom: 50%; /* Aspect ratio 2:1 (width:height) */
  position: relative;
  background-color: #e0f7fa; /* Light blue background for map */
  border-radius: 10px;
  overflow: hidden; /* Ensure point stays within bounds */
  border: 2px solid #ccc;
  margin-bottom: 30px;
}

.map-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Simple grid lines for representation */
  background-image:
    linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: 10% 10%, 10% 10%; /* 10 degree intervals visually */
}

.grid-line {
  position: absolute;
  font-size: 0.8em;
  color: #666;
  font-weight: 600;
}
.grid-line.horizontal {
  width: 100%;
  border-bottom: 1px dashed #999;
}
.grid-line.vertical {
  height: 100%;
  border-right: 1px dashed #999;
}

.top-line { top: 5%; transform: translateY(-50%); } /* 90N */
.middle-line { top: 50%; transform: translateY(-50%); border-bottom: 2px solid #007bff; } /* Equator */
.bottom-line { top: 95%; transform: translateY(-50%); } /* 90S */

.left-line { left: 5%; transform: translateX(-50%); } /* 180W */
.prime-meridian { left: 50%; transform: translateX(-50%); border-right: 2px solid #007bff; } /* Prime Meridian */
.right-line { left: 95%; transform: translateX(-50%); } /* 180E */

.target-point {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #e74c3c; /* Red dot */
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -50%); /* Center the dot on the coordinates */
  z-index: 10;
}

.input-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.input-group label {
  font-weight: 600;
  color: #444;
  font-size: 0.95em;
}

.input-group input[type="number"],
.input-group select {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1em;
  width: 120px; /* Fixed width for inputs */
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-group input[type="number"]:focus,
.input-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.submit-btn, .reset-btn {
  background-color: #28a745;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 10px;
}

.submit-btn:hover, .reset-btn:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

.feedback-section {
  margin-top: 20px;
  padding: 15px;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: 600;
}

.feedback-section p {
  margin-bottom: 15px;
}

.feedback-section .success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.feedback-section .error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .input-section {
    flex-direction: column;
    align-items: center;
  }
  .input-group input[type="number"],
  .input-group select {
    width: 100%; /* Full width for better mobile input */
  }
}
</style>
