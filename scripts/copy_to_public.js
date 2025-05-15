import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the source and target directories
const contentDir = path.join(__dirname, '..', 'content');
const publicDir = path.join(__dirname, '..', 'public', 'content');

// Ensure the public/content directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`Created directory ${publicDir}`);
}

// Helper function to copy a directory recursively
function copyRecursive(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // Read the contents of the source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  // Process each entry
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyRecursive(srcPath, destPath);
    } else {
      // Copy individual files
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcPath} to ${destPath}`);
    }
  }
}

// Execute the recursive copy
try {
  copyRecursive(contentDir, publicDir);
  console.log('Successfully copied content to public/content directory');
} catch (error) {
  console.error('Error copying content:', error);
  process.exit(1);
}
