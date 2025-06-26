<template>
  <div class="simulation-container">
    <h2>Task: Great Circle Distance (Haversine)</h2>
    <p class="instruction">Enter the coordinates of two points to find the shortest distance between them on Earth using the Haversine formula.</p>

    <div class="input-grid">
      <div class="input-group">
        <h3>Point 1 (A)</h3>
        <div class="coord-input">
          <label>Latitude:</label>
          <input type="number" v-model.number="pointA.lat" min="-90" max="90" step="0.000001">
          <select v-model="pointA.latDir">
            <option value="N">N</option>
            <option value="S">S</option>
          </select>
        </div>
        <div class="coord-input">
          <label>Longitude:</label>
          <input type="number" v-model.number="pointA.lng" min="-180" max="180" step="0.000001">
          <select v-model="pointA.lngDir">
            <option value="E">E</option>
            <option value="W">W</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <h3>Point 2 (B)</h3>
        <div class="coord-input">
          <label>Latitude:</label>
          <input type="number" v-model.number="pointB.lat" min="-90" max="90" step="0.000001">
          <select v-model="pointB.latDir">
            <option value="N">N</option>
            <option value="S">S</option>
          </select>
        </div>
        <div class="coord-input">
          <label>Longitude:</label>
          <input type="number" v-model.number="pointB.lng" min="-180" max="180" step="0.000001">
          <select v-model="pointB.lngDir">
            <option value="E">E</option>
            <option value="W">W</option>
          </select>
        </div>
      </div>
    </div>

    <button @click="calculateDistance" class="calculate-btn">Calculate Distance</button>

    <div v-if="distanceResult !== null" class="result-section">
      <h3>Result:</h3>
      <p class="distance-value">{{ distanceResult.toFixed(2) }} kilometers (km)</p>
      <p class="distance-value-alt">{{ (distanceResult * 0.539957).toFixed(2) }} nautical miles (nm)</p>

      <div class="breakdown">
        <h4>Calculation Breakdown (Haversine Formula):</h4>
        <p>Point A (Decimal): {{ formatToDecimal(pointA.lat, pointA.latDir) }}°, {{ formatToDecimal(pointA.lng, pointA.lngDir) }}°</p>
        <p>Point B (Decimal): {{ formatToDecimal(pointB.lat, pointB.latDir) }}°, {{ formatToDecimal(pointB.lng, pointB.lngDir) }}°</p>
        <p>Earth Radius (R): 6371 km</p>
        <p>$\Delta\varphi = \text{lat}_2 - \text{lat}_1$ (radians)</p>
        <p>$\Delta\lambda = \text{lon}_2 - \text{lon}_1$ (radians)</p>
        <p>$a = \sin^2(\frac{\Delta\varphi}{2}) + \cos(\varphi_1) \times \cos(\varphi_2) \times \sin^2(\frac{\Delta\lambda}{2})$</p>
        <p>$c = 2 \times \operatorname{atan2}(\sqrt{a}, \sqrt{1-a})$</p>
        <p>$d = R \times c$</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const pointA = ref({ lat: 40.7128, latDir: 'N', lng: 74.0060, lngDir: 'W' });
const pointB = ref({ lat: 51.5074, latDir: 'N', lng: 0.1278, lngDir: 'W' });

const distanceResult = ref(null);

// Helper to convert degrees to radians
const toRad = (value) => {
  return value * Math.PI / 180;
};

// Helper to convert coordinate to decimal with sign
const formatToDecimal = (value, direction) => {
  return direction === 'S' || direction === 'W' ? -value : value;
};

const calculateDistance = () => {
  // Convert coordinates to decimal degrees considering direction
  const lat1 = formatToDecimal(pointA.value.lat, pointA.value.latDir);
  const lon1 = formatToDecimal(pointA.value.lng, pointA.value.lngDir);
  const lat2 = formatToDecimal(pointB.value.lat, pointB.value.latDir);
  const lon2 = formatToDecimal(pointB.value.lng, pointB.value.lngDir);

  // Haversine formula implementation
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  distanceResult.value = R * c;
};
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

.distance-value, .distance-value-alt {
  font-size: 2em;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 10px;
}

.distance-value-alt {
  font-size: 1.5em;
  color: #5cb85c;
  margin-top: 0;
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
