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
  thumbnail?: string | undefined
  adjustedWhiteBalance: WhiteBalanceOverride
}

export type NewPosition = Pick<Position, 'index' | 'title' | 'adjustedWhiteBalance'>

export type PositionGroup = {
  id: string
  title: string
  hidden: boolean
  positions: Position[]
}

export type Preset = {
  index: number
  title: string
  adjustedWhiteBalance: WhiteBalanceOverride
}

export type Camera = {
  id: string
  baseUrl: string
  sessionId: string
  title: string
  positionGroups: PositionGroup[]
  presets: Preset[]
}

export type CameraSettings = Pick<Camera, "title" | "sessionId" | "baseUrl">

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
    const [migratedConfig6, needsSaving6] = migratePresets(migratedConfig5)

    return [
      ({ ...migratedConfig6, isError: false}),
        needsSaving1 || needsSaving2 || needsSaving3 || needsSaving4 || needsSaving5 || needsSaving6,
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

function migratePresets(config: any): [any, boolean] {
  const defaultAdjustedWhiteBalance = { blue: 0, red: 0 };

  function createPresets(camera: any): Preset[] {
    const knownPositions: Preset[] = (camera.positionGroups ?? [])
      .flatMap((positionGroup: any) => positionGroup.positions ?? [])
      .map((position: any) => ({ index: position.index, title: position.title, adjustedWhiteBalance: position.adjustedWhiteBalance ?? defaultAdjustedWhiteBalance }))

    return [...new Map(knownPositions.map(p => [p.index, p])).values()].sort(sortPresets)
  }

  if (config.version <= 5) {
    const newConfig = ({
      ...config,
      cameras: (config.cameras ?? []).map((camera: any) => ({
        ...camera,
        positionGroups: (camera.positionGroups ?? []).map((group: any) => ({
          ...group,
          positions: (group.positions ?? []).map((position: any) => ({
            ...position,
            adjustedWhiteBalance: position.adjustedWhiteBalance !== undefined ? position.adjustedWhiteBalance : defaultAdjustedWhiteBalance,
          })),
        })),
        presets: createPresets(camera),
      })),
      version: 6,
    })

    return [newConfig, true]
  }
  else return [config, false]
}

function sortPresets(a: Preset, b: Preset) {
  return a.index - b.index
}

type ZustandConfigStore = {
    config: AppConfig | undefined
    error: ConfigError | undefined
    loaded: boolean
    cameraConfigModeEnabled: boolean
    setCameraConfigModeEnabled: (configModeEnabled: boolean) => void
    loadConfig: () => void
    setLastOpenedTextTab: (tabName: string) => void
    updateCameraGroups: (cameraId: string, groups: PositionGroup[]) => void
    updateCameraSettings: (cameraId: string, settings: CameraSettings) => void
    upsertPreset: (cameraId: string, updatedPreset: Preset) => void
    deletePreset: (cameraId: string, index: number) => void
}

const useConfigStore = create<ZustandConfigStore>()(setState => ({
    loaded: false,
    config: undefined,
    error: undefined,
    cameraConfigModeEnabled: false,
    setCameraConfigModeEnabled: (configModeEnabled: boolean) => setState(s => {
        return ({ ...s, cameraConfigModeEnabled: configModeEnabled })
    }),
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
    updateCameraGroups: (cameraId, groups) => setState(s => {
        if (!s.config) return s
        const newConfig: AppConfig = {
            ...s.config,
            cameras: s.config.cameras.map(c => c.id !== cameraId ? c : ({
                ...c,
                positionGroups: groups,
            })),
        }
        saveConfig(newConfig, getConfigPath())
        return ({ ...s, config: newConfig })
    }),
    updateCameraSettings: (cameraId, { title, baseUrl, sessionId }) => setState(s => {
        if (!s.config) return s
        const newConfig: AppConfig = {
            ...s.config,
            cameras: s.config.cameras.map(c => c.id !== cameraId ? c : ({
                ...c,
                title: title,
                baseUrl: baseUrl,
                sessionId: sessionId,
            }))
        }
        saveConfig(newConfig, getConfigPath())
        return ({ ...s, config: newConfig })
    }),
    upsertPreset: (cameraId, updatedPreset) => setState(s => {
        if (!s.config) return s
        const newConfig: AppConfig = {
            ...s.config,
            cameras: s.config.cameras.map(c => c.id !== cameraId ? c : ({
                ...c,
                positionGroups: c.positionGroups.map(g => ({
                    ...g,
                    positions: g.positions.map(p => {
                        if (p.index !== updatedPreset.index) return p
                        const correspondingPreset = c.presets.find(preset => preset.index === p.index)
                        const newTitle = !!correspondingPreset && correspondingPreset.title === p.title ? updatedPreset.title : p.title
                        return {
                            ...p,
                            title: newTitle,
                            adjustedWhiteBalance: {
                                blue: updatedPreset.adjustedWhiteBalance.blue,
                                red: updatedPreset.adjustedWhiteBalance.red,
                            },
                        }
                    }),
                })),
                presets: [...c.presets.filter(p => p.index !== updatedPreset.index), updatedPreset].sort(sortPresets),
            })),
        }
        saveConfig(newConfig, getConfigPath())
        return ({ ...s, config: newConfig })
    }),
    deletePreset: (cameraId, index) => setState(s => {
        if (!s.config) return s
        const newConfig: AppConfig = {
            ...s.config,
            cameras: s.config.cameras.map(c => c.id !== cameraId ? c : ({
                ...c,
                presets: c.presets.filter(p => p.index !== index),
            })),
        }
        saveConfig(newConfig, getConfigPath())
        return ({ ...s, config: newConfig })
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

export function usePresets(cameraId: string): Preset[] {
    return useConfigStore(s => s.config!.cameras.find(c => c.id === cameraId)!.presets)
}

export function useCameraSettings(cameraId: string): [CameraSettings, (updatedSettings: CameraSettings) => void] {
    const get = useConfigStore(s => {
        const camera = s.config!.cameras.find(c => c.id === cameraId)!
        return { title: camera.title, baseUrl: camera.baseUrl, sessionId: camera.sessionId }
    }, shallow)
    const set = useConfigStore(s => s.updateCameraSettings)

    return [get, (updatedSettings: CameraSettings) => set(cameraId, updatedSettings)]
}

export function useLoadConfig(): Pick<ZustandConfigStore, "loaded" | "error"> {
    const { loadConfig, ...store } = useConfigStore(s => ({ loadConfig: s.loadConfig, loaded: s.loaded, error: s.error }), shallow)

    useEffect(() => {
        loadConfig()
    }, [loadConfig])

    return store
}

export function useCameraConfigModeEnabled(): boolean {
    return useConfigStore(s => s.cameraConfigModeEnabled)
}

export function useSetCameraConfigModeEnabled(): (mode: boolean) => void {
    return useConfigStore(s => s.setCameraConfigModeEnabled)
}

export function useSetLastOpenedTextTab(): (tabName: string) => void {
    return useConfigStore(s => s.setLastOpenedTextTab)
}

export function useUpdateConfigCameraGroups(): (cameraId: string, groups: PositionGroup[]) => void {
  return useConfigStore(s => s.updateCameraGroups)
}

export function useUpsertPreset(): (cameraId: string, updatedPreset: Preset) => void {
    return useConfigStore(s => s.upsertPreset)
}

export function useDeletePreset(): (cameraId: string, index: number) => void {
    return useConfigStore(s => s.deletePreset)
}
