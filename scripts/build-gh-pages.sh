#!/bin/bash

# This script builds the React app and then copies the build output to the docs directory
# for GitHub Pages deployment

# Ensure we're in the project root
cd "$(dirname "$0")"

# Build the app
echo "Building the React app..."
npm run build

# Check if the build was successful
if [ $? -ne 0 ]; then
  echo "Build failed. Exiting."
  exit 1
fi

# Create/clean the docs directory
echo "Setting up docs directory..."
rm -rf docs
mkdir -p docs

# Copy the build files to docs
echo "Copying build files to docs directory..."
cp -R dist/* docs/

# Create a .nojekyll file to prevent GitHub from processing the site with Jekyll
touch docs/.nojekyll

# Create a 404.html file that redirects to index.html for SPA routing
# This file should match the redirect logic in index.html
cat > docs/404.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    var segmentCount = 1; // Adjust this value based on your repository name structure
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + segmentCount).join('/') + '/?/' +
      l.pathname.split('/').slice(1 + segmentCount).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
  <p>Redirecting to the home page...</p>
</body>
</html>
EOF

echo "Done! The app is now ready for GitHub Pages deployment in the docs/ directory"
