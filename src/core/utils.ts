import * as Electron from "electron"
import * as PathModule from 'path'

const { app }: typeof Electron = window.require('@electron/remote')
const pathModule: typeof PathModule = window.require('path')

function getAppPath(): string {
  const appPath = app.getAppPath()
  if (pathModule.basename(appPath) === 'app.asar') {
    return pathModule.dirname(app.getPath('exe'))
  }
  return appPath;
}

function getUserDataPath(): string {
  return app.getPath('userData')
}

export function getDefaultConfigPath(): string {
  return pathModule.join(getAppPath(), 'public', 'default-config.json');
}

export function getConfigPath(): string {
  return pathModule.join(getUserDataPath(), 'config.json')
}
