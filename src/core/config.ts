import { getConfigPath, getDefaultConfigPath } from "./utils";
import * as FsModule from 'fs'

const fs: typeof FsModule = window.require('fs')

export type WhiteBalanceOverride = {
  blue: number
  red: number
}

export type Position = {
  index: number
  title: string
  thumbnail?: string
  adjustedWhiteBalance?: WhiteBalanceOverride
}

export type PositionGroup = {
  title: string
  positions: Position[]
}

export type Camera = {
  baseUrl: string
  sessionId: string
  title: string
  positionGroups: PositionGroup[]
}

export type AppConfig = {
  version: number
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
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      return migrateConfig(config, configPath);
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

function saveConfig(newConfig: AppConfig, configPath: string): void {
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 4), { encoding: 'utf8', flag: 'w'})
}

function migrateConfig(config: any, configPath: string): AppConfig {
  config = migrateCameraPositionGroups(config, configPath)

  return ({ ...config, isError: false})
}

/*
 * Migration from a config which has no version.
 * Move config.cameras[x].positions to config.cameras[x].positionGroups[y].positions with config.cameras[x].positionGroups[y].title = "default"
 */
function migrateCameraPositionGroups(config: any, configPath: string): any {
  if (config.version === undefined) {
    const newConfig = ({
      ...config,
      cameras: (config.cameras ?? []).map(({positions, ...rest}: any) => ({
        ...rest,
        positionGroups: [
          {
            title: "default",
            positions: positions ?? [],
          },
        ],
      })),
      version: 1,
    })
    saveConfig(newConfig, configPath)

    return newConfig
  }
  else return config
}
