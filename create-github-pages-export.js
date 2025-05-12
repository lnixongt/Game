// Script to create a GitHub Pages export with the fixed version of the game
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPORT_DIR = path.join(__dirname, 'gh-pages-export-fixed');
const ZIP_FILE = path.join(__dirname, 'platform-game-fixed-for-github-pages.zip');

async function createGitHubPagesExport() {
  try {
    console.log('Creating GitHub Pages export with fixed game version...');
    
    // Ensure the export directory exists
    await fs.ensureDir(EXPORT_DIR);
    
    // Copy fixed game.js 
    await fs.copy(path.join(__dirname, 'fixed-game.js'), path.join(EXPORT_DIR, 'game.js'));
    
    // Copy files over
    await fs.copy(path.join(__dirname, 'gh-pages-export', 'assets'), path.join(EXPORT_DIR, 'assets'), { overwrite: true });
    await fs.copy(path.join(__dirname, 'gh-pages-export', 'README.md'), path.join(EXPORT_DIR, 'README.md'), { overwrite: true });
    
    // Create a .nojekyll file to ensure GitHub Pages renders properly
    await fs.writeFile(path.join(EXPORT_DIR, '.nojekyll'), '');
    
    // Create a ZIP file for easy download
    exec(`cd "${EXPORT_DIR}" && zip -r "${ZIP_FILE}" .`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating ZIP file: ${error.message}`);
        return;
      }
      
      if (stderr) {
        console.error(`ZIP command stderr: ${stderr}`);
      }
      
      console.log(`ZIP file created successfully: ${ZIP_FILE}`);
      console.log('You can download this file and upload it to your GitHub repository');
    });
    
    console.log('GitHub Pages export created successfully!');
    console.log(`Files are located in: ${EXPORT_DIR}`);
    console.log('Instructions:');
    console.log('1. Copy these files to your GitHub repository');
    console.log('2. Enable GitHub Pages in your repository settings');
    console.log('3. Your game will be available at https://yourusername.github.io/repositoryname/');
    
  } catch (error) {
    console.error('Error creating GitHub Pages export:', error);
  }
}

// Run the function
createGitHubPagesExport();