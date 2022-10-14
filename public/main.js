const { app, BrowserWindow } = require('electron')
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
const remoteMain = require('@electron/remote/main')
const { autoUpdater } = require("electron-updater")

remoteMain.initialize()

const path = require('path')
const isDev = require('electron-is-dev')

async function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    fullscreenable: false,
    icon: 'public/favicon.ico',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  remoteMain.enable(window.webContents)

  await window.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) window.webContents.openDevTools();
  window.maximize();
  window.show();

  if (!isDev) {
    await autoUpdater.checkForUpdatesAndNotify()
  }
}

app.whenReady().then(async () => {
    if (isDev) {
        const name = await installExtension(REACT_DEVELOPER_TOOLS)
        console.log(`Added Extension:  ${name}`)
    }
    await createWindow()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow();
  }
});
