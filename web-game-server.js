// Simple Express server for serving the game from the root directory
import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from client/public
app.use('/public', express.static(path.join(__dirname, 'client', 'public')));

// Serve the root index.html for the main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// For all other requests, proxy to the original client directory
app.use('/client', express.static(path.join(__dirname, 'client')));

// Fallback for any other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Game web server running at http://localhost:${PORT}`);
  console.log(`Your game should be accessible at the root URL`);
});