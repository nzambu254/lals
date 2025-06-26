<template>
  <div class="visualization-container">
    <h1>Geographic Coordinates Visualization</h1>

    <div class="controls">
      <div class="control-group">
        <label for="mapType">Map Visualization:</label>
        <select id="mapType" v-model="mapType" @change="updateMap">
          <option value="world">World Outline</option>
          <option value="country">Country Boundaries</option>
          <option value="topographic">Simple Topographic</option>
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
      <h3>Coordinate System Basics</h3>
      <div class="grid-system">
        <div class="hemispheres">
          <div>
            <h4>Latitude (Parallels)</h4>
            <p>Northern Hemisphere: 0° to 90°N</p>
            <p>Southern Hemisphere: 0° to 90°S</p>
          </div>
          <div>
            <h4>Longitude (Meridians)</h4>
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
      <p>Different map projections are used to represent the 3D Earth on a 2D surface, each with its own advantages and distortions.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { select } from 'd3-selection';
import { geoMercator, geoOrthographic, geoEquirectangular, geoPath, geoGraticule } from 'd3-geo';
import { json } from 'd3-fetch';
import * as topojson from 'topojson-client';

const mapContainer = ref(null);
const mapType = ref('world');
const projection = ref('equirectangular');

const updateMap = async () => {
  if (!mapContainer.value) return;

  const d3Container = select(mapContainer.value);
  d3Container.selectAll("*").remove();

  const width = mapContainer.value.clientWidth;
  const height = Math.min(width * 0.6, 600);

  const svg = d3Container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  let proj;
  switch (projection.value) {
    case 'mercator':
      proj = geoMercator();
      break;
    case 'orthographic':
      proj = geoOrthographic();
      break;
    default:
      proj = geoEquirectangular();
  }

  proj.fitSize([width, height], { type: "Sphere" });
  const path = geoPath().projection(proj);

  svg.append("path")
    .datum({ type: "Sphere" })
    .attr("d", path)
    .attr("fill", "#e6f3ff")
    .attr("stroke", "#333")
    .attr("stroke-width", 0.5);

  try {
    if (mapType.value === 'country') {
      const data = await json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
      const countries = topojson.feature(data, data.objects.countries);
      svg.append("g")
        .selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#b8d8ff")
        .attr("stroke", "#666")
        .attr("stroke-width", 0.3);
    } else if (mapType.value === 'topographic') {
      svg.append("path")
        .datum({ type: "Sphere" })
        .attr("d", path)
        .attr("fill", "#e8f5e9")
        .attr("stroke", "#666")
        .attr("stroke-width", 0.5);

      for (let i = 0; i < 50; i++) {
        const lat = Math.random() * 180 - 90;
        const long = Math.random() * 360 - 180;
        const projectedCoords = proj([long, lat]);

        if (projectedCoords) {
          svg.append("circle")
            .attr("cx", projectedCoords[0])
            .attr("cy", projectedCoords[1])
            .attr("r", Math.random() * 3 + 1)
            .attr("fill", "#81c784")
            .attr("opacity", 0.7);
        }
      }
    }

    const graticule = geoGraticule().step([15, 15]);
    svg.append("path")
      .datum(graticule())
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 0.5);

    const equator = {
      type: "LineString",
      coordinates: Array.from({ length: 361 }, (_, i) => [i - 180, 0])
    };
    svg.append("path")
      .datum(equator)
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#f44336")
      .attr("stroke-width", 1.5);

    const primeMeridian = {
      type: "LineString",
      coordinates: Array.from({ length: 181 }, (_, i) => [0, i - 90])
    };
    svg.append("path")
      .datum(primeMeridian)
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#2196f3")
      .attr("stroke-width", 1.5);

  } catch (error) {
    console.error("Error loading or drawing map data:", error);
  }
};

onMounted(() => {
  updateMap();
  window.addEventListener('resize', updateMap);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateMap);
});
</script>

<style scoped>
.visualization-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  color: #333;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
  font-size: 2.5em;
  font-weight: 700;
}

.controls {
  display: flex;
  gap: 25px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #e9ecef;
  padding: 15px;
  border-radius: 8px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.08);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  color: #495057;
  font-size: 0.95em;
}

select {
  padding: 10px 15px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  background-color: white;
  min-width: 220px;
  font-size: 1em;
  color: #34495e;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234a5568' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 12px;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
}

select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.map-container {
  width: 100%;
  min-height: 300px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin: 20px 0;
  background-color: #fefefe;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.map-container svg {
  display: block;
}

.coordinates-display {
  margin: 40px 0;
  padding: 25px;
  background-color: #e6f7ff;
  border-radius: 12px;
  border: 1px solid #b3e0ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.coordinates-display h3 {
  color: #007bff;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.8em;
  font-weight: 600;
}

.grid-system {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.hemispheres, .prime-meridian {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  text-align: left;
}

.hemispheres h4, .prime-meridian h4 {
  color: #34495e;
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.2em;
  font-weight: 600;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.hemispheres p, .prime-meridian p {
  margin-bottom: 8px;
  font-size: 0.95em;
  line-height: 1.5;
}

.description {
  margin-top: 40px;
  padding: 25px;
  background-color: #f0f9ff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.description h3 {
  color: #2b6cb0;
  margin-bottom: 15px;
  text-align: center;
  font-size: 1.8em;
  font-weight: 600;
}

.description p {
  line-height: 1.7;
  font-size: 1.05em;
  color: #555;
  text-align: justify;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  select {
    min-width: unset;
    width: 100%;
  }

  .grid-system {
    grid-template-columns: 1fr;
  }
}
</style>