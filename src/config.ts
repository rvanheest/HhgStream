import { getAppPath } from "./utils";
import * as FsModule from 'fs'
import * as PathModule from 'path'

const fs: typeof FsModule = window.require('fs')
const pathModule: typeof PathModule = window.require('path')

export type Position = {
  index: number
  title: string
  thumbnail?: string
}

export type Camera = {
  baseUrl: string
  sessionId: string
  title: string
  positions: Position[]
}

export type AppConfig = {
  cameras: Camera[]
  isError: false
}

export type ConfigError = {
  message: string
  error?: string | undefined
  isError: true
}

export function getConfig(): AppConfig | ConfigError {
  const appPath = getAppPath()
  const configPath = pathModule.join(appPath, 'public', 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      return {...JSON.parse(fs.readFileSync(configPath, 'utf-8')), isError: false}
    }
    catch (e) {
      return ({
        message: `error reading config file ${configPath}`,
        error: e instanceof SyntaxError ? e.message : undefined,
        isError: true,
      })
    }
  }
  return ({
    message: `config file doesn't exist at path ${configPath}`,
    isError: true,
  })
}