import * as Electron from "electron"
import * as PathModule from 'path'

const { app }: typeof Electron = window.require('@electron/remote')
const pathModule: typeof PathModule = window.require('path')

export function getAppPath(): string {
  const appPath = app.getAppPath()
  if (pathModule.basename(appPath) === 'app.asar') {
    return pathModule.dirname(app.getPath('exe'))
  }
  return appPath;
}
