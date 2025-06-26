<template>
  <div class="simulation-container">
    <h2>Task: Distance Along a Meridian (Nautical Miles)</h2>
    <p class="instruction">Calculate the great-circle distance in nautical miles between two points on the same longitude.</p>

    <div class="input-grid">
      <div class="input-group">
        <h3>Point A</h3>
        <label>Latitude:</label>
        <input type="number" v-model.number="pointA.lat" min="0" max="90" step="0.1">
        <select v-model="pointA.latDir">
          <option value="N">N</option>
          <option value="S">S</option>
        </select>
      </div>

      <div class="input-group">
        <h3>Point B</h3>
        <label>Latitude:</label>
        <input type="number" v-model.number="pointB.lat" min="0" max="90" step="0.1">
        <select v-model="pointB.latDir">
          <option value="N">N</option>
          <option value="S">S</option>
        </select>
      </div>
    </div>

    <div class="common-longitude-input">
      <label>Common Longitude:</label>
      <input type="number" v-model.number="commonLng" min="0" max="180" step="0.1">
      <select v-model="commonLngDir">
        <option value="E">E</option>
        <option value="W">W</option>
      </select>
      <p class="hint">The longitude won't affect the distance calculation for points on the same meridian, but is shown for context.</p>
    </div>

    <button @click="calculateDistance" class="calculate-btn">Calculate Distance</button>

    <div v-if="distanceResult !== null" class="result-section">
      <h3>Result:</h3>
      <p class="distance-value">{{ distanceResult.toFixed(2) }} nautical miles (nm)</p>
      <div class="breakdown">
        <h4>Calculation Breakdown:</h4>
        <p>Point A: {{ Math.abs(pointA.lat) }}°{{ pointA.latDir }}</p>
        <p>Point B: {{ Math.abs(pointB.lat) }}°{{ pointB.latDir }}</p>
        <p>
          Latitude Difference:
          <span v-if="pointA.latDir === pointB.latDir">|{{ pointA.lat }}° - {{ pointB.lat }}°| = {{ Math.abs(pointA.lat - pointB.lat).toFixed(1) }}°</span>
          <span v-else>{{ pointA.lat }}° + {{ pointB.lat }}° = {{ (pointA.lat + pointB.lat).toFixed(1) }}°</span>
        </p>
        <p>Distance = Latitude Difference (in minutes) = Angle (in degrees) × 60</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const pointA = ref({ lat: 20, latDir: 'N' });
const pointB = ref({ lat: 70, latDir: 'N' });
const commonLng = ref(40); // Common longitude, not used in calculation but for context
const commonLngDir = ref('E');

const distanceResult = ref(null);

const calculateDistance = () => {
  let latDiff;
  if (pointA.value.latDir === pointB.value.latDir) {
    // Same hemisphere, subtract latitudes
    latDiff = Math.abs(pointA.value.lat - pointB.value.lat);
  } else {
    // Opposite hemispheres, add latitudes
    latDiff = pointA.value.lat + pointB.value.lat;
  }

  // Distance in nautical miles = angle difference in degrees * 60
  distanceResult.value = latDiff * 60;
};
</script>

<style scoped>
.simulation-container {
  max-width: 700px;
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

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 20px;
}

.input-group {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.05);
  text-align: left;
}

.input-group h3 {
  color: #34495e;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.3em;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #444;
}

.input-group input[type="number"],
.input-group select {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1em;
  width: calc(100% - 24px); /* Account for padding */
  box-sizing: border-box;
  margin-bottom: 10px;
}

.input-group select {
  width: 100%;
}

.common-longitude-input {
  margin-bottom: 30px;
  background-color: #e9f5ff;
  padding: 15px 20px;
  border-radius: 10px;
  border: 1px solid #cceeff;
  text-align: left;
}

.common-longitude-input label {
  font-weight: 600;
  color: #007bff;
  display: block;
  margin-bottom: 10px;
}

.common-longitude-input input,
.common-longitude-input select {
  padding: 8px 10px;
  border: 1px solid #aaddff;
  border-radius: 5px;
  font-size: 0.95em;
  margin-right: 10px;
}

.common-longitude-input .hint {
  font-size: 0.85em;
  color: #666;
  margin-top: 10px;
}

.calculate-btn {
  background-color: #007bff;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1.2em;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-bottom: 30px;
}

.calculate-btn:hover {
  background-color: #0056b3;
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 123, 255, 0.3);
}

.result-section {
  background-color: #e6f7ff;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #b3e0ff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  text-align: left;
}

.result-section h3 {
  color: #007bff;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.5em;
}

.distance-value {
  font-size: 2em;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 20px;
}

.breakdown {
  background-color: #f0f8ff;
  padding: 15px;
  border-radius: 8px;
  border: 1px dashed #cceeff;
}

.breakdown h4 {
  color: #34495e;
  margin-top: 0;
  margin-bottom: 10px;
}

.breakdown p {
  margin-bottom: 5px;
  font-size: 0.95em;
  line-height: 1.4;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .input-grid {
    grid-template-columns: 1fr;
  }
  .input-group input[type="number"],
  .input-group select {
    width: 100%;
  }
}
</style>
