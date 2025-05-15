// Simple server to test production build with correct base path
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

// Handle 404 for paths outside our base path
app.use((req, res) => {
  if (!req.path.startsWith(basePath)) {
    res.status(404).send('Not found: This simulates GitHub Pages behavior where only paths under your repository are valid');
  } else {
    res.status(404).sendFile(path.join(__dirname, 'dist', '404.html'));
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}${basePath}`);
  console.log(`This simulates how the app will work on GitHub Pages`);
});
