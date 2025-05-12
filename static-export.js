// Script to create a static version of the game for web hosting
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPORT_DIR = path.join(__dirname, 'website-export');

async function exportWebsite() {
  console.log('Creating static website export...');
  
  // Create export directory
  await fs.ensureDir(EXPORT_DIR);
  
  // Copy index.html
  await fs.copy(path.join(__dirname, 'index.html'), path.join(EXPORT_DIR, 'index.html'));
  
  // Create client directory structure
  await fs.ensureDir(path.join(EXPORT_DIR, 'client', 'src'));
  await fs.ensureDir(path.join(EXPORT_DIR, 'client', 'public'));
  
  // Copy client/public directory (for assets)
  await fs.copy(
    path.join(__dirname, 'client', 'public'), 
    path.join(EXPORT_DIR, 'client', 'public')
  );
  
  // Copy client/src directory
  await fs.copy(
    path.join(__dirname, 'client', 'src'), 
    path.join(EXPORT_DIR, 'client', 'src')
  );
  
  // Create a simple web server file for local testing
  const serverContent = `
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}\`);
});
  `;
  
  await fs.writeFile(path.join(EXPORT_DIR, 'server.js'), serverContent);
  
  // Create package.json for the export
  const packageJson = {
    name: "platform-game-website",
    version: "1.0.0",
    description: "A Mario-style platform game website",
    main: "server.js",
    scripts: {
      "start": "node server.js"
    },
    dependencies: {
      express: "^4.18.2"
    }
  };
  
  await fs.writeFile(
    path.join(EXPORT_DIR, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create a README
  const readmeContent = `
# Platform Adventure Game

A Mario-style platform game with jumping mechanics, enemies, collectibles and level progression.

## Running the Website

1. Install dependencies: \`npm install\`
2. Start the server: \`npm start\`
3. Open your browser to \`http://localhost:3000\`

## Hosting

You can host this website on any static web hosting service. Just upload the contents
of this directory to your web host.

## Controls

- Move: Arrow keys or A/D
- Jump: Space, W, or Up Arrow
- Pause: ESC
- Restart: R
  `;
  
  await fs.writeFile(path.join(EXPORT_DIR, 'README.md'), readmeContent);
  
  console.log('Website export created successfully!');
  console.log(`You can find your website files in the '${EXPORT_DIR}' directory`);
  console.log('To test locally, run:');
  console.log(`  cd ${EXPORT_DIR}`);
  console.log('  npm install');
  console.log('  npm start');
}

// Run the export
exportWebsite().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});