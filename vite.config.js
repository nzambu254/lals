import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Add these aliases if you encounter specific D3 module issues
      'd3-geo': path.resolve(__dirname, 'node_modules/d3-geo/dist/d3-geo.min.js'),
      'd3-selection': path.resolve(__dirname, 'node_modules/d3-selection/dist/d3-selection.min.js')
    }
  },
  optimizeDeps: {
    include: [
      'd3',
      'd3-geo',
      'd3-selection',
      'd3-array',
      'd3-scale',
      'topojson-client',
      'vue'
    ],
    exclude: []
  },
  server: {
    historyApiFallback: true,
    proxy: {
      // Add any API proxies if needed
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      },
      // Ensure D3 and TopoJSON are properly bundled
      external: [],
      plugins: []
    },
    // Increase chunk size warning limit (D3 can be large)
    chunkSizeWarningLimit: 1000
  },
  // This helps with D3's dynamic imports
  define: {
    'process.env': {}
  }
})