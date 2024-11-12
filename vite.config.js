// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@fullcalendar/daygrid/main.css': '@fullcalendar/daygrid/index.global.min.css',
      '@fullcalendar/timegrid/main.css': '@fullcalendar/timegrid/index.global.min.css',
    }
  },
  server: {
    port: 3000,
  },
});

