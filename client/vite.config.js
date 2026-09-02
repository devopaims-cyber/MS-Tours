import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        // Read the API origin from env so the proxy matches whatever port
        // the server is actually running on. VITE_API_URL looks like
        // "http://localhost:5001/api" — strip the path before handing it
        // to http-proxy.
        target: process.env.VITE_API_URL
          ? process.env.VITE_API_URL.replace(/\/api\/?$/, '')
          : 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          motion: ['framer-motion'],
          leaflet: ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
});
