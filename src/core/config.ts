import {
    copyFile,
    createDirectoryIfNotExists,
    fileExists,
    getConfigPath,
    getDefaultConfigPath,
    getDefaultTextPath,
    getDefaultTextTemplateDir,
    getDefaultTextTemplateOutputDir,
    readJsonFile,
    resolve,
    saveJsonFile
} from "./utils";

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

export type TextTemplate = {
    name: string
    templateDir: string
    outputDir: string
}

export type TextsConfig = {
    textsPath: string
    templates: TextTemplate[]
}

export type AppConfig = {
  version: number
  cameras: Camera[]
  texts: TextsConfig
  isError: false
}

export type ConfigError = {
  message: string
  error?: string | undefined
  isError: true
}

export function loadConfig(): AppConfig | ConfigError {
  const configPath = getConfigPath()

  if (!fileExists(configPath)) {
    const defaultConfigPath = getDefaultConfigPath()
    if (fileExists(defaultConfigPath)) {
      copyFile(defaultConfigPath, configPath)
    }
    else {
      return ({
        message: `config file doesn't exist at path ${configPath}; also default-config at ${defaultConfigPath} doesn't exist to initialize config file`,
        isError: true,
      })
    }
  }

  if (fileExists(configPath)) {
    try {
      const config = readJsonFile<AppConfig>(configPath)
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
    saveJsonFile(newConfig, configPath)
}

function migrateConfig(config: any, configPath: string): AppConfig {
  config = migrateCameraPositionGroups(config, configPath)
  config = migrateTexts(config, configPath)

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

function migrateTexts(config: any, configPath: string): any {
    let newConfig = config
    if (!config.texts) {
        const kerkdienstTemplateDir = resolve(getDefaultTextTemplateDir(), 'kerkdienst')
        const kerkdienstOutputDir = resolve(getDefaultTextTemplateOutputDir(), 'kerkdienst')

        createDirectoryIfNotExists(kerkdienstTemplateDir)
        createDirectoryIfNotExists(kerkdienstOutputDir)

        newConfig = ({
            ...config,
            texts: {
                textsPath: getDefaultTextPath(),
                templates: [
                    {
                        name: "kerkdienst",
                        templateDir: getDefaultTextTemplateDir(),
                        outputDir: getDefaultTextTemplateOutputDir(),
                    },
                ],
            },
            version: 2,
        })

        saveConfig(newConfig, configPath)
    }

    newConfig.texts.templates.forEach((template: any) => {
        createDirectoryIfNotExists(template.templateDir)
        createDirectoryIfNotExists(template.outputDir)
    })

    return newConfig
}
