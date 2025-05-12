// Simple Express server to test the game locally
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Default route serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log('Open your browser to the above URL to test the game');
});