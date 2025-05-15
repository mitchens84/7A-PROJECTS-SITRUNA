// Simple test-build.cjs script using CommonJS style
const express = require('express');
const path = require('path');
const app = express();

// Define the GitHub Pages base path
const basePath = '/7A-PROJECTS-SITRUNA';

// Serve static files from the dist directory
app.use(basePath, express.static(path.join(__dirname, 'dist')));

// For any route under the base path, serve the index.html
app.get(`${basePath}/*`, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Redirect root to the base path
app.get('/', (req, res) => {
  res.redirect(basePath);
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}${basePath}`);
  console.log(`This simulates how the app will work on GitHub Pages`);
});
