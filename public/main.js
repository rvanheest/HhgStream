const { app, BrowserWindow } = require('electron')
const remoteMain = require('@electron/remote/main')

remoteMain.initialize()

const path = require('path')
const isDev = require('electron-is-dev')

function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  remoteMain.enable(window.webContents)

  window.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) window.webContents.openDevTools();
  window.maximize();
  window.show();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});