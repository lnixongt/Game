// Script to prepare the game for GitHub Pages hosting
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_PAGES_DIR = path.join(__dirname, 'github-pages');

async function prepareForGitHubPages() {
  console.log('Preparing files for GitHub Pages...');
  
  // Create the GitHub Pages directory
  await fs.ensureDir(GITHUB_PAGES_DIR);
  
  // Copy the index.html to the root of GitHub Pages directory
  await fs.copy(
    path.join(__dirname, 'index.html'), 
    path.join(GITHUB_PAGES_DIR, 'index.html')
  );
  
  // Update the path in index.html to point to the correct location
  let indexContent = await fs.readFile(path.join(GITHUB_PAGES_DIR, 'index.html'), 'utf8');
  indexContent = indexContent.replace(
    'src="/client/src/main.tsx"',
    'src="./main.js"'
  );
  await fs.writeFile(path.join(GITHUB_PAGES_DIR, 'index.html'), indexContent);
  
  // Create a bundled JavaScript file from the main.tsx
  console.log('Bundling JavaScript files...');
  
  // Create a simple bundled JS file for demonstration
  // In a real scenario, you would use a tool like esbuild, webpack, or rollup to bundle the code
  const mainJsContent = `
// This is a simplified version of the bundled JavaScript
// For a real GitHub Pages deployment, you should use a proper build tool

// Initialize the game engine
const canvas = document.createElement('canvas');
document.getElementById('root').appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

// Game state
let score = 0;
let lives = 3;
let playerX = 50;
let playerY = canvas.height - 50;
let jumping = false;
let jumpVelocity = 0;
const gravity = 0.5;

// Game assets
const playerSize = 30;
const platformHeight = 10;
const platforms = [
  { x: 0, y: canvas.height - 20, width: canvas.width, height: platformHeight },
  { x: 200, y: canvas.height - 100, width: 100, height: platformHeight },
  { x: 400, y: canvas.height - 180, width: 100, height: platformHeight },
  { x: 600, y: canvas.height - 260, width: 100, height: platformHeight }
];

const collectibles = [
  { x: 250, y: canvas.height - 120, size: 15, collected: false },
  { x: 450, y: canvas.height - 200, size: 15, collected: false },
  { x: 650, y: canvas.height - 280, size: 15, collected: false }
];

// Game loop
function gameLoop() {
  // Clear canvas
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw platforms
  ctx.fillStyle = '#4CAF50';
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
  
  // Draw collectibles
  ctx.fillStyle = 'gold';
  collectibles.forEach(coin => {
    if (!coin.collected) {
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, coin.size, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  
  // Apply gravity
  if (jumping) {
    playerY -= jumpVelocity;
    jumpVelocity -= gravity;
    
    // Check if player landed on a platform
    let onPlatform = false;
    platforms.forEach(platform => {
      if (
        playerY + playerSize >= platform.y &&
        playerY + playerSize <= platform.y + platform.height &&
        playerX + playerSize > platform.x &&
        playerX < platform.x + platform.width
      ) {
        onPlatform = true;
        jumping = false;
        playerY = platform.y - playerSize;
      }
    });
    
    if (playerY + playerSize >= canvas.height) {
      jumping = false;
      playerY = canvas.height - playerSize;
    }
  }
  
  // Draw player
  ctx.fillStyle = 'red';
  ctx.fillRect(playerX, playerY, playerSize, playerSize);
  
  // Draw HUD
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 20, 30);
  ctx.fillText('Lives: ' + lives, 20, 60);
  ctx.fillText('Press SPACE to jump, LEFT/RIGHT arrows to move', canvas.width / 2 - 200, 30);
  
  // Collectible collision detection
  collectibles.forEach(coin => {
    if (!coin.collected && 
        playerX < coin.x + coin.size &&
        playerX + playerSize > coin.x &&
        playerY < coin.y + coin.size &&
        playerY + playerSize > coin.y) {
      coin.collected = true;
      score += 10;
    }
  });
  
  requestAnimationFrame(gameLoop);
}

// Input handling
window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    playerX -= 5;
  }
  if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    playerX += 5;
  }
  if ((e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') && !jumping) {
    jumping = true;
    jumpVelocity = 10;
  }
});

// Start the game
gameLoop();
  `;
  
  await fs.writeFile(path.join(GITHUB_PAGES_DIR, 'main.js'), mainJsContent);
  
  // Copy assets from client/public to github-pages/assets
  console.log('Copying assets...');
  await fs.ensureDir(path.join(GITHUB_PAGES_DIR, 'assets'));
  
  // Copy textures
  await fs.copy(
    path.join(__dirname, 'client', 'public', 'textures'),
    path.join(GITHUB_PAGES_DIR, 'assets', 'textures')
  );
  
  // Copy sounds
  await fs.copy(
    path.join(__dirname, 'client', 'public', 'sounds'),
    path.join(GITHUB_PAGES_DIR, 'assets', 'sounds')
  );
  
  // Create a README.md file for the GitHub repository
  const readmeContent = `
# Platform Adventure Game

A Mario-style platform game with jumping mechanics, enemies, collectibles and level progression.

## Play the Game

You can play the game directly at: https://[your-github-username].github.io/[your-repo-name]/

## Controls

- **Move**: Arrow keys or A/D
- **Jump**: Space, W, or Up Arrow
- **Pause**: ESC
- **Restart**: R

## Game Features

- Multiple levels with increasing difficulty
- Enemies with patrol behavior
- Collectible coins for scoring
- End-level flags for progression

## Development

This game was built using:
- HTML5 Canvas
- JavaScript

## License

MIT License
`;
  
  await fs.writeFile(path.join(GITHUB_PAGES_DIR, 'README.md'), readmeContent);
  
  // Create a basic CSS file
  const cssContent = `
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #000;
  font-family: 'Arial', sans-serif;
}

#root {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  display: block;
  margin: 0 auto;
  background-color: #87CEEB;
}
  `;
  
  await fs.writeFile(path.join(GITHUB_PAGES_DIR, 'styles.css'), cssContent);
  
  // Update the index.html to include the CSS
  indexContent = await fs.readFile(path.join(GITHUB_PAGES_DIR, 'index.html'), 'utf8');
  indexContent = indexContent.replace(
    '</head>',
    '<link rel="stylesheet" href="./styles.css"></head>'
  );
  await fs.writeFile(path.join(GITHUB_PAGES_DIR, 'index.html'), indexContent);
  
  console.log('GitHub Pages preparation complete!');
  console.log(`Files are in the '${GITHUB_PAGES_DIR}' directory.`);
  console.log('To deploy to GitHub Pages:');
  console.log('1. Create a new GitHub repository');
  console.log(`2. Copy all files from the '${GITHUB_PAGES_DIR}' directory to your repository`);
  console.log('3. Push to GitHub');
  console.log('4. Go to repository Settings > Pages and set the source to "main" branch');
}

// Run the preparation
prepareForGitHubPages().catch(err => {
  console.error('Preparation failed:', err);
  process.exit(1);
});