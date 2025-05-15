import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/7A-PROJECTS-SITRUNA/' : './',
  // Serve content folder as static assets
  publicDir: 'content',
  server: { port: 3000 },
  resolve: {
    alias: {
      '@content': path.resolve(__dirname, './content')
    }
  }
});
