const express = require('express');
const path = require('path');
const app = express();
const PORT = 3999; // Use a completely different port

// Serve static files from the 'dist' directory (after building with npm run build)
app.use(express.static(path.join(__dirname, 'dist')));

// Always return index.html for any route (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
=========================================
🚀 Static server running on port ${PORT}
📁 Serving files from: ${path.join(__dirname, 'dist')}
📂 Open: http://localhost:${PORT}/
=========================================
`);
});
