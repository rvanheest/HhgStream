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
    lastOpenedTab: number
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
      const [migratedConfig, needsSaving] = migrateConfig(config)

      if (needsSaving) saveConfigInternal(migratedConfig, configPath)
      return migratedConfig
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

function saveConfigInternal(newConfig: AppConfig, configPath: string): void {
    saveJsonFile(newConfig, configPath)
}

export function saveConfig(newConfig: AppConfig): void {
    saveConfigInternal(newConfig, getConfigPath())
}

function migrateConfig(config: any): [AppConfig, boolean] {
  const [migratedConfig1, needsSaving1] = migrateCameraPositionGroups(config)
  const [migratedConfig2, needsSaving2] = migrateTexts(migratedConfig1)

  return [
    ({ ...migratedConfig2, isError: false}),
    needsSaving1 || needsSaving2,
  ]
}

/*
 * Migration from a config which has no version.
 * Move config.cameras[x].positions to config.cameras[x].positionGroups[y].positions with config.cameras[x].positionGroups[y].title = "default"
 */
function migrateCameraPositionGroups(config: any): [any, boolean] {
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

    return [newConfig, true]
  }
  else return [config, false]
}

function migrateTexts(config: any): [any, boolean] {
    let newConfig = config
    let needsSaving = false
    if (!config.texts) {
        const kerkdienstTemplateDir = resolve(getDefaultTextTemplateDir(), 'kerkdienst')
        const kerkdienstOutputDir = resolve(getDefaultTextTemplateOutputDir(), 'kerkdienst')

        createDirectoryIfNotExists(kerkdienstTemplateDir)
        createDirectoryIfNotExists(kerkdienstOutputDir)

        newConfig = ({
            ...config,
            texts: {
                textsPath: getDefaultTextPath(),
                lastOpenedTab: 0,
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

        needsSaving = true
    }
    else if (!config.texts.lastOpenedTab) {
        newConfig = {
            ...config,
            texts: {
                ...config.texts,
                lastOpenedTab: 0,
            },
        }

        needsSaving = true
    }

    newConfig.texts.templates.forEach((template: any) => {
        createDirectoryIfNotExists(template.templateDir)
        createDirectoryIfNotExists(template.outputDir)
    })

    return [newConfig, needsSaving]
}
