import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const contentDir = path.join(rootDir, 'content');
const distContentDir = path.join(distDir, 'content');

console.log('Preparing files for GitHub Pages deployment...');

// Create .nojekyll file to disable Jekyll processing
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('Created .nojekyll file');

// Create _redirects file for Netlify/Vercel-compatible hosting (backup)
fs.writeFileSync(path.join(distDir, '_redirects'), '/*    /index.html   200');
console.log('Created _redirects file');

// Copy index.html to 404.html for GitHub Pages SPA routing
try {
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
  console.log('Copied index.html to 404.html');
} catch (err) {
  console.error('Error copying index.html to 404.html:', err);
}

// Ensure content directory exists in dist
if (!fs.existsSync(distContentDir)) {
  fs.mkdirSync(distContentDir, { recursive: true });
  console.log(`Created directory ${distContentDir}`);
}

// Helper function to copy a directory recursively
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Warning: Source directory ${src} does not exist`);
    return;
  }
  
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // Read the contents of the source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  // Process each entry
  for (const entry of entries) {
    // Skip node_modules and hidden directories
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
      continue;
    }
    
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyRecursive(srcPath, destPath);
    } else {
      // Only copy non-TypeScript files
      if (!entry.name.endsWith('.ts') && !entry.name.endsWith('.tsx')) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${srcPath} to ${destPath}`);
      }
    }
  }
}

// Copy content files to dist/content
try {
  copyRecursive(contentDir, distContentDir);
  console.log('Successfully copied content to dist/content directory');
} catch (error) {
  console.error('Error copying content:', error);
}

console.log('Deployment preparation complete');
