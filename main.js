/**
 * Main process of the Electron application.
 *
 * This script sets up the main window of the application, configures the application behavior
 * (like handling window creation and application lifecycle events), and establishes inter-process
 * communication (IPC) for actions like opening URLs in the user's default browser.
 */


// Electron modules and Node.js path module are required for Electron app functionality and file path operations.
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

/**
 * Creates the main window of the Electron application.
 */
function createWindow() {
  // Initialize the BrowserWindow with specific properties.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 480,
    resizable: false,
    title: 'Chapter Injector by Mark Battistella',
    movable: true,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, './modules/preload.mjs'),
      nodeIntegration: true, // Deprecated and should generally be false for security.
      contextIsolation: true, // Enable context isolation for security.
      contentSecurityPolicy: "default-src 'self'", // Content security policy.
      webSecurity: true // Enable web security.
    }
  });

  // Load the HTML file for the window.
  mainWindow.loadFile('data/index.html');

  // Open the DevTools in development mode for debugging.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// When Electron app is ready, create the main window.
app.whenReady().then(createWindow);

/**
 * Handles the 'window-all-closed' event to quit the application when all windows are closed,
 * except on macOS (Darwin), where applications generally continue running.
 */
app.on('window-all-closed', () => {
  app.quit();
});

/**
 * Listens for 'open-url' messages from the renderer process to open URLs in the default web browser.
 */
ipcMain.on('open-url', (event, url) => {
  shell.openExternal(url);
});

// Attempt to enable live reload during development.
if (isDev) {
  try {
    require('electron-reloader')(module)
  } catch (_) {}
}