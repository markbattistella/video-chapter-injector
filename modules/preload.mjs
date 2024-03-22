const { ipcRenderer, contextBridge } = require('electron');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;
const { execFile } = require('child_process');
const path = require('path');
const fsp = require('fs').promises;

// Improved executeFile function to better handle errors and stderr.
function executeFile(filePath, args) {
  return new Promise((resolve, reject) => {
    execFile(filePath, args, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Execution failed: ${error.message}`));
        return;
      }
      if (stderr) {
        console.warn(`Warning: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}

// Context bridge to expose APIs safely from the preload script to the renderer process.
contextBridge.exposeInMainWorld('api', {
  openUrlInBrowser: (url) => {
    ipcRenderer.send('open-url', url);
  },

  pasteFromClipboard: async () => {
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      console.error('Failed to read clipboard text:', error);
      throw new Error('Clipboard access denied.');
    }
  },

  ffmpeg: (args) => executeFile(ffmpegPath, args),

  ffprobe: (args) => executeFile(ffprobePath, args),

  createFile: async (inputFile, filename) => {
    const file = inputFile[0].path;
    const directoryPath = path.dirname(file);
    try {
      const filePath = path.join(directoryPath, filename);
      await fsp.writeFile(filePath, ''); // Use writeFile for creating or replacing the file
      console.log(`File created successfully: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('Error creating file:', error);
      throw new Error('Failed to create file.');
    }
  },

  writeContentToFile: async (filePath, content) => {
    try {
      await fsp.writeFile(filePath, content);
      console.log(`Content written successfully to: ${filePath}`);
    } catch (error) {
      console.error('Error writing content to file:', error);
      throw new Error('Failed to write content to file.');
    }
  },

  deleteFile: async (filePath) => {
    try {
      const absoluteFilePath = path.resolve(filePath);
      await fsp.unlink(absoluteFilePath);
      console.log(`File deleted successfully: ${absoluteFilePath}`);
    } catch (error) {
      console.error(`Failed to delete file: ${error.message}`);
      throw error;
    }
  },

  appendToFileName: (originalPath, appendString) => {
    const parsedPath = path.parse(originalPath);
    const newFileName = `${parsedPath.name}${appendString}${parsedPath.ext}`;
    return path.join(parsedPath.dir, newFileName);
  }
});