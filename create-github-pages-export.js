// Script to create a complete GitHub Pages export
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the export directory
const EXPORT_DIR = path.join(__dirname, 'gh-pages-export');

async function createGitHubPagesExport() {
  try {
    console.log('Creating GitHub Pages export...');
    
    // Clean and create the export directory
    await fs.emptyDir(EXPORT_DIR);
    
    // Copy the main files
    const filesToCopy = [
      'index.html',
      'game.js',
      'styles.css',
      'README.md'
    ];
    
    for (const file of filesToCopy) {
      await fs.copy(
        path.join(__dirname, file),
        path.join(EXPORT_DIR, file)
      );
      console.log(`Copied ${file}`);
    }
    
    // Create and copy assets
    await fs.ensureDir(path.join(EXPORT_DIR, 'assets'));
    
    // Copy textures if they exist
    try {
      await fs.copy(
        path.join(__dirname, 'client', 'public', 'textures'),
        path.join(EXPORT_DIR, 'assets', 'textures')
      );
      console.log('Copied textures');
    } catch (error) {
      console.log('No textures to copy or error copying textures');
    }
    
    // Copy sounds if they exist
    try {
      await fs.copy(
        path.join(__dirname, 'client', 'public', 'sounds'),
        path.join(EXPORT_DIR, 'assets', 'sounds')
      );
      console.log('Copied sounds');
    } catch (error) {
      console.log('No sounds to copy or error copying sounds');
    }
    
    // Create a .nojekyll file to prevent GitHub Pages from processing with Jekyll
    await fs.writeFile(path.join(EXPORT_DIR, '.nojekyll'), '');
    console.log('Created .nojekyll file');
    
    // Create a simple GitHubPages-specific README
    const githubReadme = `# Platform Adventure Game

A Mario-style platform game with jumping mechanics, enemies, collectibles, and level progression.

## About This Repository

This repository contains a standalone platform game created for GitHub Pages. The game is built using HTML5 Canvas and JavaScript.

## How to Deploy

1. Fork this repository or use it as a template
2. Go to Settings > Pages in your repository
3. Select the main branch as the source
4. Your game will be live at https://[your-username].github.io/[repository-name]/

## Game Controls

- **Move**: Arrow Keys or A/D
- **Jump**: Space, W, or Up Arrow
- **Pause**: ESC
- **Restart**: R

Enjoy the game!
`;
    
    await fs.writeFile(path.join(EXPORT_DIR, 'github-readme.md'), githubReadme);
    console.log('Created GitHub-specific README');
    
    console.log(`\nExport completed successfully!`);
    console.log(`Files are in the '${EXPORT_DIR}' directory`);
    console.log('\nTo deploy to GitHub Pages:');
    console.log('1. Create a new GitHub repository');
    console.log(`2. Copy all files from the '${EXPORT_DIR}' directory to your repository`);
    console.log('3. Push to GitHub');
    console.log('4. Go to repository Settings > Pages and set the source to "main" branch');
    
  } catch (error) {
    console.error('Error creating GitHub Pages export:', error);
  }
}

// Run the export
createGitHubPagesExport();