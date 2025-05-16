import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

console.log('Starting GitHub Pages setup script...');

// Ensure the dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('Created dist directory');
}

// 1. Create .nojekyll file in both dist and public
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('✅ Created .nojekyll in dist');

if (!fs.existsSync(path.join(publicDir, '.nojekyll'))) {
  fs.writeFileSync(path.join(publicDir, '.nojekyll'), '');
  console.log('✅ Created .nojekyll in public');
}

// 2. Create an htaccess file with MIME type configurations
const htaccessContent = `# Proper MIME type configuration for GitHub Pages
# This ensures JavaScript modules are served with the correct MIME type

# Set default charset
AddDefaultCharset UTF-8

# JavaScript files should be served as application/javascript
AddType application/javascript .js
AddType application/javascript .mjs
AddType application/javascript .jsx

# JSON files should be served as application/json
AddType application/json .json

# CSS files should be served as text/css
AddType text/css .css

# HTML files should be served as text/html
AddType text/html .html .htm

# Font files
AddType font/woff .woff
AddType font/woff2 .woff2
AddType application/vnd.ms-fontobject .eot
AddType font/ttf .ttf
AddType font/collection .ttc
AddType font/otf .otf

# Enforce MIME types
<IfModule mod_headers.c>
  # Set X-Content-Type-Options to prevent browsers from MIME-sniffing
  Header set X-Content-Type-Options "nosniff"
</IfModule>

# SPA redirects - All routes should go to index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# If mod_rewrite is not available, use ErrorDocument
ErrorDocument 404 /index.html`;

fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent);
console.log('✅ Created .htaccess in dist');

// 3. Add MIME types to web.config for IIS users
const webConfigContent = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <mimeMap fileExtension=".js" mimeType="application/javascript" />
      <mimeMap fileExtension=".mjs" mimeType="application/javascript" />
      <mimeMap fileExtension=".jsx" mimeType="application/javascript" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
    <rewrite>
      <rules>
        <rule name="SPA Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>`;

fs.writeFileSync(path.join(distDir, 'web.config'), webConfigContent);
console.log('✅ Created web.config in dist');

// 4. Ensure we have a proper 404.html file for GitHub Pages
const notFoundPath = path.join(distDir, '404.html');
const indexPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
  console.log('✅ Created 404.html from index.html');
} else {
  console.log('⚠️ Warning: index.html not found, could not create 404.html');
}

console.log('GitHub Pages setup complete!');
