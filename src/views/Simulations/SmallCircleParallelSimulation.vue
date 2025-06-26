<template>
  <div class="simulation-container">
    <h2>Task: Distance Along a Parallel of Latitude (Nautical Miles)</h2>
    <p class="instruction">Calculate the distance in nautical miles between two points on the same parallel of latitude.</p>

    <div class="input-grid">
      <div class="input-group">
        <h3>Point 1</h3>
        <div class="coord-input">
          <label>Longitude:</label>
          <input type="number" v-model.number="point1.lng" min="0" max="180" step="0.1">
          <select v-model="point1.lngDir">
            <option value="E">E</option>
            <option value="W">W</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <h3>Point 2</h3>
        <div class="coord-input">
          <label>Longitude:</label>
          <input type="number" v-model.number="point2.lng" min="0" max="180" step="0.1">
          <select v-model="point2.lngDir">
            <option value="E">E</option>
            <option value="W">W</option>
          </select>
        </div>
      </div>
    </div>

    <div class="common-latitude-input">
      <label>Common Latitude (θ):</label>
      <input type="number" v-model.number="commonLat" min="0" max="90" step="0.1">
      <select v-model="commonLatDir">
        <option value="N">N</option>
        <option value="S">S</option>
      </select>
      <p class="hint">This latitude determines the radius of the small circle.</p>
    </div>

    <button @click="calculateDistance" class="calculate-btn">Calculate Distance</button>

    <div v-if="distanceResult !== null" class="result-section">
      <h3>Result:</h3>
      <p class="distance-value">{{ distanceResult.toFixed(2) }} nautical miles (nm)</p>
      <div class="breakdown">
        <h4>Calculation Breakdown:</h4>
        <p>Point 1 Longitude: {{ Math.abs(point1.lng) }}°{{ point1.lngDir }}</p>
        <p>Point 2 Longitude: {{ Math.abs(point2.lng) }}°{{ point2.lngDir }}</p>
        <p>
          Longitude Difference (a):
          <span v-if="point1.lngDir === point2.lngDir">|{{ point1.lng }}° - {{ point2.lng }}°| = {{ Math.abs(point1.lng - point2.lng).toFixed(1) }}°</span>
          <span v-else>{{ point1.lng }}° + {{ point2.lng }}° = {{ (point1.lng + point2.lng).toFixed(1) }}°</span>
        </p>
        <p>Common Latitude (θ): {{ commonLat }}°{{ commonLatDir }}</p>
        <p>Formula: $L = 60a \cos\theta$</p>
        <p>where $a$ is longitude difference in degrees, $\theta$ is common latitude in degrees.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const point1 = ref({ lng: 20, lngDir: 'E' });
const point2 = ref({ lng: 120, lngDir: 'E' });
const commonLat = ref(40);
const commonLatDir = ref('N');

const distanceResult = ref(null);

const calculateDistance = () => {
  let lngDiff;
  if (point1.value.lngDir === point2.value.lngDir) {
    // Same hemisphere, subtract longitudes
    lngDiff = Math.abs(point1.value.lng - point2.value.lng);
  } else {
    // Opposite hemispheres, add longitudes
    lngDiff = point1.value.lng + point2.value.lng;
  }

  // Ensure commonLat is within valid range
  const latitudeRad = commonLat.value * Math.PI / 180; // Convert to radians for cos function

  // Formula: L = 60 * a * cos(theta)
  distanceResult.value = 60 * lngDiff * Math.cos(latitudeRad);
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

.coord-input {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.coord-input label {
  font-weight: 600;
  color: #444;
  min-width: 80px; /* Align labels */
}

.coord-input input[type="number"] {
  flex-grow: 1;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1em;
}

.coord-input select {
  padding: 10px 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1em;
}

.common-latitude-input {
  margin-bottom: 30px;
  background-color: #e9f5ff;
  padding: 15px 20px;
  border-radius: 10px;
  border: 1px solid #cceeff;
  text-align: left;
}

.common-latitude-input label {
  font-weight: 600;
  color: #007bff;
  display: block;
  margin-bottom: 10px;
}

.common-latitude-input input,
.common-latitude-input select {
  padding: 8px 10px;
  border: 1px solid #aaddff;
  border-radius: 5px;
  font-size: 0.95em;
  margin-right: 10px;
}

.common-latitude-input .hint {
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
  .coord-input {
    flex-direction: column;
    align-items: flex-start;
  }
  .coord-input label {
    min-width: unset;
  }
}
</style>
