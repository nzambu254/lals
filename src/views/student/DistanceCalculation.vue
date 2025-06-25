<template>
  <div class="distance-container">
    <h1>Distance Between Coordinates</h1>
    
    <div class="calculation-section">
      <div class="input-group">
        <h3>Point A</h3>
        <div class="input-field">
          <label>Latitude:</label>
          <input type="number" v-model="pointA.lat" min="-90" max="90" step="0.000001" placeholder="e.g. 40.7128">
          <select v-model="pointA.latDir">
            <option value="N">N</option>
            <option value="S">S</option>
          </select>
        </div>
        <div class="input-field">
          <label>Longitude:</label>
          <input type="number" v-model="pointA.lng" min="-180" max="180" step="0.000001" placeholder="e.g. -74.0060">
          <select v-model="pointA.lngDir">
            <option value="E">E</option>
            <option value="W">W</option>
          </select>
        </div>
      </div>
      
      <div class="input-group">
        <h3>Point B</h3>
        <div class="input-field">
          <label>Latitude:</label>
          <input type="number" v-model="pointB.lat" min="-90" max="90" step="0.000001" placeholder="e.g. 51.5074">
          <select v-model="pointB.latDir">
            <option value="N">N</option>
            <option value="S">S</option>
          </select>
        </div>
        <div class="input-field">
          <label>Longitude:</label>
          <input type="number" v-model="pointB.lng" min="-180" max="180" step="0.000001" placeholder="e.g. -0.1278">
          <select v-model="pointB.lngDir">
            <option value="E">E</option>
            <option value="W">W</option>
          </select>
        </div>
      </div>
      
      <div class="result-section">
        <button @click="calculateDistance" class="calculate-btn">Calculate Distance</button>
        
        <div v-if="distanceResult" class="result-display">
          <h3>Result</h3>
          <p>The distance between the two points is:</p>
          <p class="distance-value">{{ distanceResult.toFixed(2) }} kilometers</p>
          <p class="distance-value">{{ (distanceResult * 0.621371).toFixed(2) }} miles</p>
          
          <div class="breakdown">
            <h4>Calculation Breakdown</h4>
            <p>Point A: {{ formatCoordinate(pointA) }}</p>
            <p>Point B: {{ formatCoordinate(pointB) }}</p>
            <p>Using Haversine formula with Earth radius: 6,371 km</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="formula-section">
      <h3>Haversine Formula</h3>
      <div class="formula-display">
        <p>The Haversine formula calculates the great-circle distance between two points on a sphere:</p>
        <div class="formula-box">
          a = sin²(Δφ/2) + cos(φ₁) * cos(φ₂) * sin²(Δλ/2)<br>
          c = 2 * atan2(√a, √(1−a))<br>
          d = R * c
        </div>
        <p>Where:<br>
        φ is latitude in radians<br>
        λ is longitude in radians<br>
        R is Earth's radius (6,371 km)<br>
        Δφ is difference in latitude<br>
        Δλ is difference in longitude</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const pointA = ref({
  lat: 40.7128,
  lng: -74.0060,
  latDir: 'N',
  lngDir: 'W'
});

const pointB = ref({
  lat: 51.5074,
  lng: -0.1278,
  latDir: 'N',
  lngDir: 'W'
});

const distanceResult = ref(null);

const calculateDistance = () => {
  // Convert coordinates to decimal degrees considering direction
  const lat1 = pointA.value.latDir === 'S' ? -pointA.value.lat : pointA.value.lat;
  const lon1 = pointA.value.lngDir === 'W' ? -pointA.value.lng : pointA.value.lng;
  const lat2 = pointB.value.latDir === 'S' ? -pointB.value.lat : pointB.value.lat;
  const lon2 = pointB.value.lngDir === 'W' ? -pointB.value.lng : pointB.value.lng;
  
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

const toRad = (value) => {
  return value * Math.PI / 180;
};

const formatCoordinate = (point) => {
  return `${Math.abs(point.lat)}° ${point.latDir}, ${Math.abs(point.lng)}° ${point.lngDir}`;
};
</script>

<style scoped>
.distance-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  color: #2d3748;
  margin-bottom: 20px;
  text-align: center;
}

.calculation-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.input-group {
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h3 {
  color: #3182ce;
  margin-bottom: 15px;
}

.input-field {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #4a5568;
}

input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  margin-right: 10px;
}

select {
  padding: 8px;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  background-color: white;
}

.result-section {
  grid-column: span 2;
  background-color: #f0f9ff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.calculate-btn {
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.calculate-btn:hover {
  background-color: #2c5282;
}

.result-display {
  margin-top: 20px;
}

.distance-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2b6cb0;
  margin: 10px 0;
}

.breakdown {
  margin-top: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  text-align: left;
}

.formula-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #f0f9ff;
  border-radius: 8px;
}

.formula-box {
  background-color: white;
  padding: 15px;
  border-radius: 6px;
  font-family: monospace;
  margin: 15px 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .calculation-section {
    grid-template-columns: 1fr;
  }
  
  .result-section {
    grid-column: span 1;
  }
}
</style>