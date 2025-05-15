const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// In a real application, use environment variables or a secure vault for the password
const CORRECT_PASSWORD = 'password123'; // CHANGE THIS!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'dist' directory (where Vite builds the app)
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === CORRECT_PASSWORD) {
    // In a real app, you would generate a secure token (e.g., JWT)
    // For simplicity, we'll use a basic token.
    res.json({ success: true, token: 'fake-auth-token' });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect password' });
  }
});

// Catch-all to serve index.html for any other GET request (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// package.json scripts section
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "serve": "vite preview",
    "update-content": "ts-node --esm scripts/update-content.ts",
    "server": "node server.js"
  }
}
