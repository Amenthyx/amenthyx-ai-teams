import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  server: {
    port: 4200,
    proxy: {
      '/api': 'http://localhost:4201',
      '/ws': { target: 'ws://localhost:4201', ws: true },
    },
  },
  build: {
    outDir: '../../dist/client',
    emptyOutDir: true,
  },
});
