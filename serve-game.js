const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the client directory
app.use('/client', express.static(path.join(__dirname, 'client')));

// Serve index.html from the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback to the Vite server during development
app.use((req, res, next) => {
  res.redirect('/client' + req.path);
});

app.listen(PORT, () => {
  console.log(`Game server running at http://localhost:${PORT}`);
});