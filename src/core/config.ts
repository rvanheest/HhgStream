import { getConfigPath, getDefaultConfigPath } from "./utils";
import * as FsModule from 'fs'

const fs: typeof FsModule = window.require('fs')

export type WhiteBalance = {
  blue: number
  red: number
}

export type Position = {
  index: number
  title: string
  thumbnail?: string
  adjustedWhiteBalance?: WhiteBalance
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

export function loadConfig(): AppConfig | ConfigError {
  const configPath = getConfigPath()

  if (!fs.existsSync(configPath)) {
    const defaultConfigPath = getDefaultConfigPath()
    if (fs.existsSync(defaultConfigPath)) {
      fs.copyFileSync(defaultConfigPath, configPath, fs.constants.COPYFILE_EXCL)
    }
    else {
      return ({
        message: `config file doesn't exist at path ${configPath}; also default-config at ${defaultConfigPath} doesn't exist to initialize config file`,
        isError: true,
      })
    }
  }

  if (fs.existsSync(configPath)) {
    try {
      return ({...JSON.parse(fs.readFileSync(configPath, 'utf-8')), isError: false})
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
