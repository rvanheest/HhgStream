import { createContext, useContext } from "react"
import { createStore, StoreApi, useStore } from "zustand"
import { Camera, Position, PositionGroup } from "./config"
import { AeLevels, CameraStatus, ColorScheme, getCameraInteraction, ICameraInteraction, WhiteBalance } from "./camera";
import { sleep } from "./utils"
import { shallow } from "zustand/shallow";

type ZustandCameraStore = {
    position: Position | undefined
    id: string
    title: string
    baseUrl: string
    positionGroups: {[name: string]: PositionGroup}
    cameraInteraction: ICameraInteraction
    cameraStatus: CameraStatus | undefined
    configMode: boolean
    setCameraPosition: (position: Position) => Promise<void>
    setCameraStatus: (cameraStatus: CameraStatus | undefined) => void
    setColorScheme: (scheme: ColorScheme) => Promise<void>
    setAeLevel: (change: number) => Promise<void>
    setWhiteBalanceRed: (change: number) => Promise<void>
    setWhiteBalanceBlue: (change: number) => Promise<void>
    correctWhiteBalance: () => Promise<void>
    setConfigMode: (newConfigMode: boolean) => void
    setGroupVisibility: (tabId: string, newVisibility: boolean) => void
}

export function createCameraStore(camera: Camera, isDev: boolean): StoreApi<ZustandCameraStore> {
    return createStore<ZustandCameraStore>((setState, getState) => ({
        position: undefined,
        id: camera.id,
        title: camera.title,
        baseUrl: camera.baseUrl,
        positionGroups: camera.positionGroups.reduce((obj, c) => ({ ...obj, [c.id]: c }), {}),
        cameraInteraction: getCameraInteraction(camera.title, camera.baseUrl, camera.sessionId, isDev),
        cameraStatus: undefined,
        configMode: false,
        setCameraPosition: async position => {
            await getState().cameraInteraction.moveCamera(position)
            setState(s => ({ ...s, position: position }))
        },
        setCameraStatus: cameraStatus => {
            setState(s => ({ ...s, cameraStatus: cameraStatus }))
        },
        setColorScheme: async scheme => {
            await getState().cameraInteraction.changeColorScheme(scheme)
        },
        setAeLevel: async change => {
            await getState().cameraInteraction.changeAeLevel(change)
            setState(s => {
                if (!s.cameraStatus) return s
                return ({
                    ...s,
                    cameraStatus: {
                        ...s.cameraStatus,
                        aeLevels: {
                            ...s.cameraStatus.aeLevels,
                            value: s.cameraStatus.aeLevels.value + change,
                        },
                    },
                })
            })
        },
        setWhiteBalanceRed: async change => {
            await getState().cameraInteraction.changeWhiteBalanceLevelRed(change)
            setState(s => {
                if (!s.cameraStatus) return s
                return ({
                    ...s,
                    cameraStatus: {
                        ...s.cameraStatus,
                        whiteBalance: {
                            ...s.cameraStatus.whiteBalance,
                            red: s.cameraStatus.whiteBalance.red + change,
                        },
                    },
                })
            })
        },
        setWhiteBalanceBlue: async change => {
            await getState().cameraInteraction.changeWhiteBalanceLevelBlue(change)
            setState(s => {
                if (!s.cameraStatus) return s
                return ({
                    ...s,
                    cameraStatus: {
                        ...s.cameraStatus,
                        whiteBalance: {
                            ...s.cameraStatus.whiteBalance,
                            blue: s.cameraStatus.whiteBalance.blue + change,
                        },
                    },
                })
            })
        },
        correctWhiteBalance: async () => {
            await getState().cameraInteraction.correctWhiteBalence()
            await sleep(5000)
            const whiteBalanceOverride = getState().position?.adjustedWhiteBalance
            if (whiteBalanceOverride) await getState().cameraInteraction.changeWhiteBalence(whiteBalanceOverride)
        },
        setConfigMode: newConfigMode => setState(s => ({
            ...s,
            configMode: newConfigMode,
        })),
        setGroupVisibility: (tabId: string, newVisibility: boolean) => setState(s => ({
            ...s,
            positionGroups: {
                ...s.positionGroups,
                [tabId]: {
                    ...s.positionGroups[tabId],
                    hidden: newVisibility,
                },
            },
        })),
    }))
}

const CameraContext = createContext<StoreApi<ZustandCameraStore> | undefined>(undefined);
export const CameraContextProvider = CameraContext.Provider

export type CameraTitle = Pick<Camera, 'title' | 'baseUrl'>

function useCameraStore<T>(selector: (store: ZustandCameraStore) => T, equalityFn?: (a: T, b: T) => boolean) {
    const ctx = useContext(CameraContext)
    return useStore(ctx!, selector, equalityFn)
}

export function useCameraId(): string {
    return useCameraStore(({ id }) => id)
}

export function useCameraTitle(): CameraTitle {
    return useCameraStore(({ title, baseUrl }) => ({ title, baseUrl }), shallow)
}

export function useCameraPositionGroups(): PositionGroup[] {
    return useCameraStore(s => Object.values(s.positionGroups), shallow)
}

export function useCameraInteraction(): ICameraInteraction {
    return useCameraStore(s => s.cameraInteraction)
}

export function useCameraConfigMode(): [boolean, (newConfigMode: boolean) => void] {
    const get = useCameraStore(s => s.configMode)
    const set = useCameraStore(s => s.setConfigMode)

    return [get, set]
}

export function useSetGroupVisibility(): (tabId: string, newVisibility: boolean) => void {
    return useCameraStore(s => s.setGroupVisibility)
}

export function useCurrentColorScheme(): [ColorScheme | undefined, (scheme: ColorScheme) => Promise<void>] {
    const get = useCameraStore(s => s.cameraStatus?.colorScheme)
    const set = useCameraStore(s => s.setColorScheme)

    return [get, set]
}

export function useCurrentAeLevels(): [AeLevels | undefined, (change: number) => Promise<void>] {
    const get = useCameraStore(s => s.cameraStatus?.aeLevels, shallow)
    const set = useCameraStore(s => s.setAeLevel)

    return [get, set]
}

type CurrentWhitebalanceReturnType = {
    whiteBalance: WhiteBalance | undefined
    correctWhiteBalance: () => Promise<void>
    setWhiteBalanceRed: (change: number) => Promise<void>
    setWhiteBalanceBlue: (change: number) => Promise<void>
}

export function useCurrentWhiteBalance(): CurrentWhitebalanceReturnType {
    const whiteBalance = useCameraStore(s => s.cameraStatus?.whiteBalance, shallow)
    const correctWhiteBalance = useCameraStore(s => s.correctWhiteBalance)
    const setWhiteBalanceRed = useCameraStore(s => s.setWhiteBalanceRed)
    const setWhiteBalanceBlue = useCameraStore(s => s.setWhiteBalanceBlue)

    return { whiteBalance, correctWhiteBalance, setWhiteBalanceRed, setWhiteBalanceBlue }
}

export function useSetCameraPosition(): (position: Position) => Promise<void> {
    return useCameraStore(s => s.setCameraPosition)
}

export function useSetCameraStatus(): (cameraStatus: CameraStatus | undefined) => void {
    return useCameraStore(s => s.setCameraStatus)
}

export function useIsPositionActive(index: number): boolean {
    return useCameraStore(s => s.position?.index === index)
}
