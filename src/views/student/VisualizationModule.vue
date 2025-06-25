<template>
  <div class="visualization-container">
    <h1>Geographic Coordinates Visualization</h1>
    
    <div class="controls">
      <div class="control-group">
        <label for="mapType">Map Visualization:</label>
        <select id="mapType" v-model="mapType" @change="updateMap">
          <option value="world">World Map</option>
          <option value="country">Country Boundaries</option>
          <option value="topographic">Topographic Map</option>
        </select>
      </div>
      
      <div class="control-group">
        <label for="projection">Map Projection:</label>
        <select id="projection" v-model="projection" @change="updateMap">
          <option value="equirectangular">Equirectangular</option>
          <option value="mercator">Mercator</option>
          <option value="orthographic">Orthographic</option>
        </select>
      </div>
    </div>
    
    <div class="map-container" ref="mapContainer"></div>
    
    <div class="coordinates-display">
      <h3>Coordinate System</h3>
      <div class="grid-system">
        <div class="hemispheres">
          <div>
            <h4>Latitude</h4>
            <p>Northern Hemisphere: 0° to 90°N</p>
            <p>Southern Hemisphere: 0° to 90°S</p>
          </div>
          <div>
            <h4>Longitude</h4>
            <p>Eastern Hemisphere: 0° to 180°E</p>
            <p>Western Hemisphere: 0° to 180°W</p>
          </div>
        </div>
        <div class="prime-meridian">
          <h4>Reference Lines</h4>
          <p>Equator: 0° latitude</p>
          <p>Prime Meridian: 0° longitude (Greenwich)</p>
        </div>
      </div>
    </div>
    
    <div class="description">
      <h3>About Geographic Coordinates</h3>
      <p>The geographic coordinate system is a spherical coordinate system that specifies locations on Earth using latitude and longitude. Latitude measures how far north or south of the equator a point lies, while longitude measures how far east or west of the prime meridian a point lies.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const mapContainer = ref(null);
const mapType = ref('world');
const projection = ref('equirectangular');

const updateMap = async () => {
  // Clear previous map
  d3.select(mapContainer.value).selectAll("*").remove();
  
  // Set up SVG container
  const width = mapContainer.value.clientWidth;
  const height = Math.min(width * 0.6, 600);
  const svg = d3.select(mapContainer.value)
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  // Create projection based on selection
  let proj;
  switch(projection.value) {
    case 'mercator':
      proj = d3.geoMercator().fitSize([width, height], {type: "Sphere"});
      break;
    case 'orthographic':
      proj = d3.geoOrthographic().fitSize([width, height], {type: "Sphere"});
      break;
    default: // equirectangular
      proj = d3.geoEquirectangular().fitSize([width, height], {type: "Sphere"});
  }
  
  const path = d3.geoPath().projection(proj);
  
  // Draw world outline
  svg.append("path")
    .datum({type: "Sphere"})
    .attr("d", path)
    .attr("fill", "#e6f3ff")
    .attr("stroke", "#333");
  
  // Load and draw geographic data based on selection
  try {
    let data;
    if (mapType.value === 'country') {
      data = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
      const countries = topojson.feature(data, data.objects.countries);
      svg.append("g")
        .selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#b8d8ff")
        .attr("stroke", "#666");
    } else if (mapType.value === 'topographic') {
      // Simplified topographic representation
      svg.append("path")
        .datum({type: "Sphere"})
        .attr("d", path)
        .attr("fill", "#e8f5e9")
        .attr("stroke", "#666");
      
      // Add some topographic features
      for (let i = 0; i < 50; i++) {
        const lat = Math.random() * 180 - 90;
        const long = Math.random() * 360 - 180;
        svg.append("circle")
          .attr("cx", proj([long, lat])[0])
          .attr("cy", proj([long, lat])[1])
          .attr("r", Math.random() * 3 + 1)
          .attr("fill", "#81c784");
      }
    }
    
    // Add graticule (latitude/longitude grid)
    const graticule = d3.geoGraticule();
    svg.append("path")
      .datum(graticule())
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 0.5);
    
    // Add equator and prime meridian
    const equator = {
      type: "LineString",
      coordinates: Array.from({length: 360}, (_, i) => [i - 180, 0])
    };
    const primeMeridian = {
      type: "LineString",
      coordinates: Array.from({length: 180}, (_, i) => [0, i - 90])
    };
    
    svg.append("path")
      .datum(equator)
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#f44336")
      .attr("stroke-width", 1.5);
    
    svg.append("path")
      .datum(primeMeridian)
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#2196f3")
      .attr("stroke-width", 1.5);
    
  } catch (error) {
    console.error("Error loading map data:", error);
  }
};

onMounted(() => {
  updateMap();
  window.addEventListener('resize', updateMap);
});
</script>

<style scoped>
.visualization-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2d3748;
  margin-bottom: 20px;
  text-align: center;
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: 500;
  color: #4a5568;
}

select {
  padding: 8px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  background-color: white;
  min-width: 200px;
}

.map-container {
  width: 100%;
  height: 500px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin: 20px 0;
  background-color: #f8fafc;
}

.coordinates-display {
  margin: 30px 0;
  padding: 20px;
  background-color: #f0f9ff;
  border-radius: 8px;
}

.grid-system {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.hemispheres, .prime-meridian {
  background-color: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h4 {
  color: #3182ce;
  margin-bottom: 10px;
}

.description {
  margin-top: 30px;
  padding: 20px;
  background-color: #f0f9ff;
  border-radius: 8px;
}

.description h3 {
  color: #2b6cb0;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }
  
  .grid-system {
    grid-template-columns: 1fr;
  }
}
</style>