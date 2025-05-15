import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const distDir = path.join(__dirname, '..', 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');
const notFoundHtmlPath = path.join(distDir, '404.html');

console.log('Starting GitHub Pages deployment fix script...');

// 1. Create .nojekyll file (prevents GitHub Pages from ignoring files that start with underscores)
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('✅ Created .nojekyll file');

// 2. Create a copy of index.html as 404.html for SPA routing
try {
  const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  fs.writeFileSync(notFoundHtmlPath, indexHtmlContent);
  console.log('✅ Created 404.html from index.html for SPA routing');
} catch (error) {
  console.error('Error creating 404.html:', error);
}

// 3. Verify asset paths in index.html and fix them if needed
try {
  let indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Check if we need to fix any absolute paths
  if (indexContent.includes('src="/assets/') || indexContent.includes('href="/assets/')) {
    // Replace absolute paths with relative paths
    indexContent = indexContent
      .replace(/src="\/assets\//g, 'src="./assets/')
      .replace(/href="\/assets\//g, 'href="./assets/');
    
    fs.writeFileSync(indexHtmlPath, indexContent);
    console.log('✅ Fixed asset paths in index.html');
    
    // Update 404.html as well
    fs.writeFileSync(notFoundHtmlPath, indexContent);
    console.log('✅ Fixed asset paths in 404.html');
  } else {
    console.log('✅ Asset paths in index.html are already using relative paths');
  }
} catch (error) {
  console.error('Error fixing asset paths:', error);
}

console.log('GitHub Pages deployment fix script completed!');
