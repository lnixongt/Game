const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Build paths
const DIST_DIR = path.join(__dirname, 'dist');
const GAME_DIR = path.join(DIST_DIR, 'game');

async function buildGame() {
  console.log('Building game...');

  // Clean previous build
  await fs.remove(DIST_DIR);
  await fs.ensureDir(GAME_DIR);

  // Build the frontend assets
  console.log('Building frontend assets...');
  execSync('npm run build', { stdio: 'inherit' });

  // Copy public directory
  console.log('Copying static assets...');
  await fs.copy(path.join(__dirname, 'client', 'public'), path.join(GAME_DIR, 'public'));

  // Copy the index.html to the distribution directory
  await fs.copy(path.join(__dirname, 'index.html'), path.join(DIST_DIR, 'index.html'));

  // Adjust paths in the HTML file for distribution
  let htmlContent = await fs.readFile(path.join(DIST_DIR, 'index.html'), 'utf8');
  htmlContent = htmlContent.replace(
    'src="/client/src/main.tsx"',
    'src="./game/main.js"'
  );
  await fs.writeFile(path.join(DIST_DIR, 'index.html'), htmlContent);

  // Copy server files
  console.log('Creating distribution server...');
  await fs.copy(path.join(__dirname, 'serve-game.js'), path.join(DIST_DIR, 'serve-game.js'));

  console.log('Game built successfully!');
  console.log(`
To run the game:
1. Copy the 'dist' directory to your web server
2. Or run 'node serve-game.js' inside the dist directory
  `);
}

buildGame().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});