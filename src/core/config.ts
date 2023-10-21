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
import { v4 as uuid } from "uuid"
import { create } from "zustand"
import { shallow } from "zustand/shallow"
import { useEffect } from "react";

export type WhiteBalanceOverride = {
  blue: number
  red: number
}

export type Position = {
  id: string
  index: number
  title: string
  thumbnail?: string
  adjustedWhiteBalance?: WhiteBalanceOverride
}

export type PositionGroup = {
  id: string
  title: string
  hidden: boolean
  positions: Position[]
}

export type Camera = {
  id: string
  baseUrl: string
  sessionId: string
  title: string
  positionGroups: PositionGroup[]
}

export type TextFormConfig = {
    templateDir: string
    outputDir: string
}

export type TextsConfig = {
    textStore: string
    lastOpenedTab: number | string
    forms: { [key: string]: TextFormConfig }
}

export type AppConfig = {
  version: number
  cameras: Camera[]
  texts: TextsConfig
}

export type ConfigError = {
  message: string
  error?: string | undefined
}

function loadConfig(): AppConfig & { isError: false } | ConfigError & { isError: true } {
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

      if (needsSaving) {
        const { isError, ...config } = migratedConfig
        saveConfig(config, configPath)
      }
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

function saveConfig(newConfig: AppConfig, configPath: string): void {
    saveJsonFile(newConfig, configPath)
}

function migrateConfig(config: any): [AppConfig & { isError: false }, boolean] {
    const [migratedConfig1, needsSaving1] = migrateCameraPositionGroups(config)
    const [migratedConfig2, needsSaving2] = migrateTexts(migratedConfig1)
    const [migratedConfig3, needsSaving3] = migrateTextTemplates(migratedConfig2)
    const [migratedConfig4, needsSaving4] = migratePositionGroupsAddHiddenField(migratedConfig3)
    const [migratedConfig5, needsSaving5] = migrateUuids(migratedConfig4)

    return [
      ({ ...migratedConfig5, isError: false}),
        needsSaving1 || needsSaving2 || needsSaving3 || needsSaving4 || needsSaving5,
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

    if (newConfig.version === 2) { // starting in config version 3, these templates are moved to a different place
        newConfig.texts.templates.forEach((template: any) => {
            createDirectoryIfNotExists(template.templateDir)
            createDirectoryIfNotExists(template.outputDir)
        })
    }

    return [newConfig, needsSaving]
}

/*
 * Migration from config version 2 to version 3
 * Move config.texts.textsPath to config.texts.textStore
 * Move config.texts.templates[] to config.texts.forms objects with template.name as key and the other fields as values in the new objects
 */
function migrateTextTemplates(config: any): [any, boolean] {
    let newConfig = config
    let needsSaving = false
    if (config.version <= 2 && !!config.texts.templates) {
        newConfig = {
            ...config,
            texts: {
                textStore: config.texts.textsPath,
                lastOpenedTab: config.texts.lastOpenedTab,
                forms: config.texts.templates.reduce((obj: any, template: any) => ({
                    ...obj,
                    [template.name]: {
                        templateDir: template.templateDir,
                        outputDir: template.outputDir
                    }
                }), {})
            },
            version: 3,
        }

        needsSaving = true
    }

    if (newConfig.version >= 3) {
        if (!!newConfig.texts.forms["cursus geestelijke vorming"]) {
            newConfig = {
                ...newConfig,
                texts: {
                    ...newConfig.texts,
                    forms: {
                        ...newConfig.texts.forms,
                        cursusGeestelijkeVorming: newConfig.texts.forms["cursus geestelijke vorming"],
                    },
                },
            }
            delete newConfig.texts.forms["cursus geestelijke vorming"]
            needsSaving = true
        }

        Object.values(newConfig.texts.forms).forEach(({ templateDir, outputDir }: any) => {
            createDirectoryIfNotExists(templateDir)
            createDirectoryIfNotExists(outputDir)
        })
    }

    return [newConfig, needsSaving]
}

function migratePositionGroupsAddHiddenField(config: any): [any, boolean] {
  if (config.version <= 3) {
    const newConfig = ({
      ...config,
      cameras: (config.cameras ?? []).map(({ positionGroups, ...rest }: any) => ({
        ...rest,
        positionGroups: (positionGroups ?? []).map((group: any) => ({
          ...group,
          hidden: group.hidden !== undefined ? group.hidden : false,
        })),
      })),
      version: 4,
    })

    return [newConfig, true]
  }
  else return [config, false]
}

function migrateUuids(config: any): [any, boolean] {
  if (config.version <= 4) {
    const newConfig = ({
      ...config,
      cameras: (config.cameras ?? []).map((camera: any) => ({
        id: uuid(),
        ...camera,
        positionGroups: (camera.positionGroups ?? []).map((group: any) => ({
          id: uuid(),
          ...group,
          positions: (group.positions ?? []).map((position: any) => ({
            id: uuid(),
            ...position,
          })),
        })),
      })),
      version: 5,
    })

    return [newConfig, true]
  }
  else return [config, false]
}

type ZustandConfigStore = {
    config: AppConfig | undefined
    error: ConfigError | undefined
    loaded: boolean
    loadConfig: () => void
    setLastOpenedTextTab: (tabName: string) => void
    updateCameraGroupVisibility: (cameraId: string, hidden: {[positionGroupName: string]: boolean}) => void
}

const useConfigStore = create<ZustandConfigStore>()(setState => ({
    loaded: false,
    config: undefined,
    error: undefined,
    loadConfig: () => {
        const config = loadConfig()
        if (config.isError) {
            const { isError, ...error } = config
            setState({ loaded: true, config: undefined, error: error, })
        }
        else {
            const { isError, ...c } = config
            setState({ loaded: true, config: c, error: undefined })
        }
    },
    setLastOpenedTextTab: tabName => setState(s => {
        if (!s.config) return s
        const newConfig = ({ ...s.config, texts: { ...s.config.texts, lastOpenedTab: tabName }})
        saveConfig(newConfig, getConfigPath())
        return ({ ...s, config: newConfig })
    }),
    updateCameraGroupVisibility: (cameraId: string, hidden: {[positionGroupId: string]: boolean}) => setState(s => {
        if (!s.config) return s
        const newConfig: AppConfig = {
            ...s.config,
            cameras: s.config.cameras.map(c => c.id === cameraId ? ({
                ...c,
                positionGroups: c.positionGroups.map(p => ({...p, hidden: hidden[p.id]}))
            }) : c)
        }
        saveConfig(newConfig, getConfigPath())
        return ({...s, config: newConfig})
    }),
}))

export function useConfig(): AppConfig {
    return useConfigStore(s => s.config!)
}

export function useCamerasConfig(): Camera[] {
    return useConfigStore(s => s.config!.cameras, shallow)
}

export function useTextStorePath(): string {
    return useConfigStore(s => s.config!.texts.textStore)
}

export function useTextStoreLastOpenedTab(): number | string {
    return useConfigStore(s => s.config!.texts.lastOpenedTab)
}

export function useTextFormConfig(formName: string): TextFormConfig | undefined {
    return useConfigStore(s => s.config!.texts.forms[formName])
}

export function useLoadConfig(): Pick<ZustandConfigStore, "loaded" | "error"> {
    const { loadConfig, ...store } = useConfigStore(s => ({ loadConfig: s.loadConfig, loaded: s.loaded, error: s.error }), shallow)

    useEffect(() => {
        loadConfig()
    }, [loadConfig])

    return store
}

export function useSetLastOpenedTextTab(): (tabName: string) => void {
    return useConfigStore(s => s.setLastOpenedTextTab)
}

export function useUpdateCameraGroupVisibility(): (cameraId: string, hidden: {[positionGroupName: string]: boolean}) => void {
  return useConfigStore(s => s.updateCameraGroupVisibility)
}
