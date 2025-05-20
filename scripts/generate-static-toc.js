import fs from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';

const expressDir = path.join(process.cwd(), 'EXPRESS');
const outputFilePath = path.join(process.cwd(), 'src', 'toc-static-data.json');
// Read base from vite.config.js or set a default
// This is a simplified approach. A more robust solution might involve parsing vite.config.js
const viteConfigPath = path.join(process.cwd(), 'vite.config.ts'); // Changed to .ts
let baseHref = '/PAGES/7A-PROJECTS-SITRUNA/'; // Default

async function getBaseHref() {
  try {
    const viteConfigContent = await fs.readFile(viteConfigPath, 'utf-8');
    const match = viteConfigContent.match(/base:\s*['"]([^'"]+)['"]/);
    if (match && match[1]) {
      baseHref = match[1];
      console.log(`Detected base Href from vite.config.js: ${baseHref}`);
    }
  } catch (err) {
    console.warn(`Could not read vite.config.js to determine base Href, using default: ${baseHref}. Error: ${err.message}`);
  }
}

async function getTitleFromHtml(filePath) {
  try {
    const htmlContent = await fs.readFile(filePath, 'utf-8');
    const dom = new JSDOM(htmlContent);
    const titleTag = dom.window.document.querySelector('title');
    const bodyDataTitle = dom.window.document.body.getAttribute('data-title');
    if (bodyDataTitle) return bodyDataTitle.trim();
    if (titleTag && titleTag.textContent) return titleTag.textContent.trim();
    return path.basename(path.dirname(filePath)); // Fallback to folder name
  } catch (err) {
    console.warn(`Could not read or parse title from ${filePath}: ${err.message}`);
    return path.basename(path.dirname(filePath));
  }
}

async function generateStaticToc() {
  await getBaseHref(); // Determine base Href first
  const tocEntries = [];
  try {
    await fs.access(expressDir); // Check if EXPRESS directory exists
    const sections = await fs.readdir(expressDir, { withFileTypes: true });
    for (const section of sections) {
      if (section.isDirectory()) {
        const indexPath = path.join(expressDir, section.name, 'index.html');
        try {
          await fs.access(indexPath); // Check if index.html exists
          const title = await getTitleFromHtml(indexPath);
          const relativePath = path.join('EXPRESS', section.name, 'index.html').replace(/\\/g, '/');
          
          // Ensure baseHref ends with a slash if it's not just "/"
          let fullPath = baseHref;
          if (fullPath !== '/' && !fullPath.endsWith('/')) {
            fullPath += '/';
          }
          fullPath += relativePath;

          tocEntries.push({
            title: title,
            path: fullPath,
            type: 'static',
          });
        } catch (err) {
          console.warn(`Skipping section ${section.name}: index.html not found or not accessible.`);
        }
      }
    }
    await fs.writeFile(outputFilePath, JSON.stringify(tocEntries, null, 2));
    console.log(`Static ToC generated successfully at ${outputFilePath}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`EXPRESS directory not found at ${expressDir}. Creating an empty ToC file.`);
    } else {
      console.error('Error generating static ToC:', err);
    }
    await fs.writeFile(outputFilePath, JSON.stringify([], null, 2));
    console.warn(`Created an empty toc-static-data.json.`);
  }
}

generateStaticToc();
