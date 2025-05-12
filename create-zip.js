// Script to create a zip file of the GitHub Pages export
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPORT_DIR = path.join(__dirname, 'gh-pages-export');
const ZIP_FILE = path.join(__dirname, 'platform-game-for-github-pages.zip');

async function createZipFile() {
  try {
    console.log('Creating ZIP file of GitHub Pages export...');
    
    // Check if the export directory exists
    if (!await fs.pathExists(EXPORT_DIR)) {
      console.error(`Error: Export directory '${EXPORT_DIR}' does not exist.`);
      console.log('Please run the export script first.');
      return;
    }
    
    // Create a zip file using the zip command
    exec(`cd "${EXPORT_DIR}" && zip -r "${ZIP_FILE}" .`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating ZIP file: ${error.message}`);
        return;
      }
      
      if (stderr) {
        console.error(`ZIP command error: ${stderr}`);
        return;
      }
      
      console.log(`ZIP file created successfully: ${ZIP_FILE}`);
      console.log('You can download this file and upload it to your GitHub repository');
    });
    
  } catch (error) {
    console.error('Error creating ZIP file:', error);
  }
}

// Run the function
createZipFile();