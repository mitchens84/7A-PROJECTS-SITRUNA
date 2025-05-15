import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/7A-PROJECTS-SITRUNA/' : '/',
  // Only serve the 'public' directory as static assets, not the entire content folder
  publicDir: 'public',
  server: { port: 3000 },
  resolve: {
    alias: {
      '@content': path.resolve(__dirname, './content')
    }
  },
  build: {
    // Ensure assets are properly accessible via relative paths
    assetsDir: 'assets',
    // Ensure React builds properly
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
    // Skip TypeScript checking for faster builds
    minify: true,
    sourcemap: false,
  }
});
