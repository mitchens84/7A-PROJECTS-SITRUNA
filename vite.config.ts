import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'content/**/[!.]*', // Copies all files except dotfiles from content
          dest: 'content'      // Destination in the dist folder
        },
        {
          // Copy 404.html to root for GitHub Pages SPA routing
          src: 'public/404.html',
          dest: './'
        }
      ]
    })
  ],
  // Critical fix: Using './' instead of '/7A-PROJECTS-SITRUNA/' for proper asset loading on GitHub Pages
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  // FIXED: Change public directory from 'content' to 'public'
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
    outDir: 'dist',
    // Generate source maps for debugging
    sourcemap: true,
    // Ensure correct paths for GitHub Pages
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
        // Ensure proper MIME types for all assets
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info.pop();
          const name = info.join('.');
          return `assets/${name}-[hash].${ext}`;
        },
        // Ensure module scripts are correctly processed
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
    // Skip TypeScript checking for faster builds
    minify: true,
  }
});
