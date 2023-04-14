import { Camera, Position, WhiteBalanceOverride } from "./config"
import { from, interval, switchMap, Observable, distinctUntilChanged, startWith } from "rxjs";

type CameraCommand = {
    Command: string,
    SessionID: string,
    Params?: any
}

export type AeLevels = {
    changeAllowed: boolean
    value: number
}

export type WhiteBalance = {
    changeAllowed: boolean
    blue: number
    red: number
}

export type CameraStatus = {
    name: string
    colorScheme: ColorScheme
    aeLevels: AeLevels
    whiteBalance: WhiteBalance
}

function equalsAeLevels(self: AeLevels, other: AeLevels): boolean {
    return self.changeAllowed === other.changeAllowed
        && self.value === other.value
}

function equalsWhiteBalance(self: WhiteBalance, other: WhiteBalance): boolean {
    return self.changeAllowed === other.changeAllowed
        && self.blue === other.blue
        && self.red === other.red
}

function equalsCameraStatus(self: CameraStatus, other: CameraStatus): boolean {
    return self.name === other.name
        && self.colorScheme === other.colorScheme
        && equalsAeLevels(self.aeLevels, other.aeLevels)
        && equalsWhiteBalance(self.whiteBalance, other.whiteBalance)
}

export function getCameraInteraction(camera: Camera, isDev: boolean): ICameraInteraction {
    console.log(`getCameraInteraction for ${camera.title}; isDev = ${isDev}`)
    return isDev
        ? new DummyCameraInteraction(camera)
        : new CameraInteraction(camera)
}

export type ColorScheme = "Awb" | "Faw"
type Pan = "Left" | "Right" | "Stop"
type Tilt = "Up" | "Down" | "Stop"
type ZoomSpeed = -3 | -2 | -1 | 1 | 2 | 3

function liveCameraStatus$(cameraInteraction: ICameraInteraction): Observable<CameraStatus | undefined> {
    return interval(1000).pipe(
        startWith(0),
        switchMap(() => from(cameraInteraction.getCameraStatus())),
        startWith(undefined),
        distinctUntilChanged((last, current) => !last ? !current : !!current && equalsCameraStatus(last, current)),
    )
}

export interface ICameraInteraction {
    getLiveCameraStatus$(): Observable<CameraStatus | undefined>

    getCameraStatus(): Promise<CameraStatus | undefined>

    moveCamera(position: Position): Promise<void>

    startCameraMove(pan: Pan, tilt: Tilt): Promise<void>

    stopCameraMove(): Promise<void>

    moveCameraHome(): Promise<void>

    startCameraZoom(speed: ZoomSpeed): Promise<void>

    stopCameraZoom(): Promise<void>

    changeColorScheme(scheme: ColorScheme): Promise<void>

    changeAeLevel(levelChange: number): Promise<void>

    correctWhiteBalence(): Promise<void>

    changeWhiteBalence(whiteBalance: WhiteBalanceOverride): Promise<void>

    changeWhiteBalanceLevelBlue(levelChange: number): Promise<void>

    changeWhiteBalanceLevelRed(levelChange: number): Promise<void>
}

class DummyCameraInteraction implements ICameraInteraction {
    selectedPosition: Position | undefined = undefined

    colorScheme: ColorScheme = 'Faw'

    aeLevelsChangeAllowed: boolean = false
    aeLevelsValue: number = 0

    whbChangeAllowed: boolean = false
    whbBlueValue: number = 0
    whbRedValue: number = 0

    constructor(private camera: Camera) {}

    getLiveCameraStatus$(): Observable<CameraStatus | undefined> {
        return liveCameraStatus$(this)
    }

    async getCameraStatus(): Promise<CameraStatus | undefined> {
        console.log(`[DEV] check status for ${this.camera.title}`)

        return ({
            name: this.camera.title,
            colorScheme: this.colorScheme,
            aeLevels: {
                changeAllowed: this.aeLevelsChangeAllowed,
                value: this.aeLevelsValue,
            },
            whiteBalance: {
                changeAllowed: this.whbChangeAllowed,
                blue: this.whbBlueValue,
                red: this.whbRedValue,
            },
        })
    }

    async moveCamera(position: Position): Promise<void> {
        console.log(`[DEV] move camera ${this.camera.title} to position ${position.title} (index ${position.index})`)
        this.selectedPosition = position

        const isPreekstoelPositie = position.index === 1 || position.index === 8
        this.colorScheme = isPreekstoelPositie ? 'Awb' : 'Faw'
        this.aeLevelsChangeAllowed = position.index !== 5
        this.aeLevelsValue = isPreekstoelPositie ? 4 : 2
        this.whbChangeAllowed = isPreekstoelPositie
        this.whbBlueValue = isPreekstoelPositie ? -5 : 0
        this.whbRedValue = isPreekstoelPositie ? 6 : 0
    }

    async startCameraMove(pan: Pan, tilt: Tilt): Promise<void> {
        console.log(`[DEV] start moving camera ${this.camera.title} with PAN=${pan} and TILT=${tilt}`)
    }

    async stopCameraMove(): Promise<void> {
        console.log(`[DEV] stop moving camera ${this.camera.title}`)
    }

    async moveCameraHome(): Promise<void> {
        console.log(`[DEV] move camera ${this.camera.title} to HOME position`)
    }

    async startCameraZoom(speed: ZoomSpeed): Promise<void> {
        console.log(`[DEV] start zoom on camera ${this.camera.title} with SPEED=${speed}`)
    }

    async stopCameraZoom(): Promise<void> {
        console.log(`[DEV] stop zoom on camera ${this.camera.title}`)
    }

    async changeColorScheme(scheme: ColorScheme): Promise<void> {
        console.log(`[DEV] change color scheme for ${this.camera.title} to ${scheme}`)
        this.colorScheme = scheme
        this.whbChangeAllowed = scheme === 'Awb'
    }

    async changeAeLevel(levelChange: number): Promise<void> {
        const upOrDown = levelChange < 0 ? '-1' : levelChange > 0 ? '+1' : '0'
        console.log(`[DEV] change AE level for camera ${this.camera.title} with ${upOrDown}`)

        if (this.aeLevelsChangeAllowed)
            this.aeLevelsValue += levelChange
    }

    async correctWhiteBalence(): Promise<void> {
        console.log(`[DEV] correct white balence for camera ${this.camera.title}`)

        if (this.whbChangeAllowed) {
            this.whbBlueValue = 0
            this.whbRedValue = 0
        }
    }

    async changeWhiteBalence({ blue, red }: WhiteBalanceOverride): Promise<void> {
        console.log(`[DEV] change white balence for camera ${this.camera.title} to (B=${blue}, R=${red})`)

        if (this.whbChangeAllowed) {
            this.whbBlueValue = blue
            this.whbRedValue = red
        }
    }

    async changeWhiteBalanceLevelBlue(levelChange: number): Promise<void> {
        const upOrDown = levelChange < 0 ? '-1' : levelChange > 0 ? '+1' : '0'
        console.log(`[DEV] change white balance for camera ${this.camera.title} on BLUE with ${upOrDown}`)

        if (this.whbChangeAllowed && this.whbBlueValue)
            this.whbBlueValue += levelChange
    }

    async changeWhiteBalanceLevelRed(levelChange: number): Promise<void> {
        const upOrDown = levelChange < 0 ? '-1' : levelChange > 0 ? '+1' : '0'
        console.log(`[DEV] change white balance for camera ${this.camera.title} on RED with ${upOrDown}`)

        if (this.whbChangeAllowed && this.whbRedValue)
            this.whbRedValue += levelChange
    }
}

class CameraInteraction implements ICameraInteraction {
    constructor(private camera: Camera) {}

    getLiveCameraStatus$(): Observable<CameraStatus | undefined> {
        return liveCameraStatus$(this)
    }

    private async runRequest<T>(baseUrl: string,
                                requestBody: CameraCommand,
                                onSuccess: (response: any | undefined) => T,
                                onFailure: (error: any) => T): Promise<T> {
        try {
            const response = await fetch(
                `${baseUrl}/cgi-bin/cmd.cgi`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Request: { ...requestBody } } )
                }
            )
            const responseBody = await response.json()

            if (responseBody.Response.Result === 'Success') return onSuccess(responseBody.Response.Data)
            else return onFailure(responseBody)
        }
        catch (error) {
            return onFailure(error)
        }
    }

    private parseLetter(letter: string): number | undefined {
        const sign = letter.trim().startsWith('-') ? -1 : 1
        const number = Number.parseInt(letter.replace('+', '').replace('-', '').trim())
        return Number.isNaN(number) ? undefined : number * sign
    }

    async getCameraStatus(): Promise<CameraStatus | undefined> {
        console.log(`check status for camera ${this.camera.title}`)

        return await this.runRequest<CameraStatus | undefined>(
            this.camera.baseUrl,
            {
                Command: "GetCamStatus",
                SessionID: this.camera.sessionId,
            },
            data => {
                console.log('status succesful', data)
                return ({
                    name: this.camera.title,
                    colorScheme: data.Whb.Status,
                    aeLevels: {
                        changeAllowed: data.Enable.AeLevel.Up && data.Enable.AeLevel.Down,
                        value: this.parseLetter(data.AeLevel.Letter) ?? 0,
                    },
                    whiteBalance: {
                        changeAllowed: data.Enable.Whb.WhPaintRP && data.Enable.Whb.WhPaintRM && data.Enable.Whb.WhPaintBP && data.Enable.Whb.WhPaintBM,
                        blue: this.parseLetter(data.Whb.WhPaintBLetter) ?? 0,
                        red: this.parseLetter(data.Whb.WhPaintRLetter) ?? 0,
                    },
                })
            },
            error => {
                console.error('status failed', error)
                return undefined
            },
        )
    }

    async moveCamera({ index, title }: Position): Promise<void> {
        console.log(`move camera ${this.camera.title} to position ${title} (index ${index})`)

        return await this.runRequest(
            this.camera.baseUrl,
            {
                Command: 'SetPTZPreset',
                SessionID: this.camera.sessionId,
                Params: {
                    No: index,
                    Operation: 'Move',
                }
            },
            () => console.log(`moved camera ${this.camera.title} to position ${title}`),
            error => console.error(`moving camera ${this.camera.title} to position ${title} failed`, error),
        )
    }

    async startCameraMove(pan: Pan, tilt: Tilt): Promise<void> {
        console.log(`start moving camera ${this.camera.title} with PAN=${pan} and TILT=${tilt}`)

        return await this.runRequest(
            this.camera.baseUrl,
            {
                Command: "SetPTCtrl",
                SessionID: this.camera.sessionId,
                Params: {
                    PanDirection: pan,
                    PanPosition: 0,
                    PanSpeed: 10,
                    TiltDirection: tilt,
                    TiltPosition: 0,
                    TiltSpeed: 10,
                },
            },
            () => console.log(`started moving camera ${this.camera.title} with PAN=${pan} and TILT=${tilt}`),
            error => console.error(`failed to start moving camera ${this.camera.title} with PAN=${pan} and TILT=${tilt}`, error),
        )
    }

    async stopCameraMove(): Promise<void> {
        console.log(`stop moving camera ${this.camera.title}`)

        return await this.runRequest(
            this.camera.baseUrl,
            {
                Command: "SetPTCtrl",
                SessionID: this.camera.sessionId,
                Params: {
                    PanDirection: "Stop",
                    PanPosition: 0,
                    PanSpeed: 0,
                    TiltDirection: "Stop",
                    TiltPosition: 0,
                    TiltSpeed: 0,
                },
            },
            () => console.log(`stopped moving camera ${this.camera.title}`),
            error => console.error(`failed to stop moving camera ${this.camera.title}`, error),
        )
    }

    async moveCameraHome(): Promise<void> {
        console.log(`move camera ${this.camera.title} to HOME position`)

        return await this.runRequest(
            this.camera.baseUrl,
            {
                Command: "SetPTCtrl",
                SessionID: this.camera.sessionId,
                Params: {
                    PanDirection: "Home",
                    PanPosition: 0,
                    PanSpeed: 10,
                    TiltDirection: "Home",
                    TiltPosition: 0,
                    TiltSpeed: 10,
                },
            },
            () => console.log(`moved camera ${this.camera.title} to HOME position`),
            error => console.error(`failed to move camera ${this.camera.title} to HOME position`, error),
        )
    }

    async startCameraZoom(speed: ZoomSpeed): Promise<void> {
        console.log(`start zoom on camera ${this.camera.title} with SPEED=${speed}`)
        const key = speed < 0 ? `Wide${Math.abs(speed)}` : speed > 0 ? `Tele${speed}` : "Stop"

        return await this.runRequest(
            this.camera.baseUrl,
            {
                Command: "SetWebKeyEvent",
                SessionID: this.camera.sessionId,
                Params: {
                    Kind: "Zoom",
                    Key: key,
                },
            },
            () => console.log(`started zoom on camera ${this.camera.title} with SPEED=${speed}`),
            error => console.error(`failed to start zoom on camera ${this.camera.title} with SPEED=${speed}`, error),
        )
    }

    async stopCameraZoom(): Promise<void> {
        console.log(`stop zoom on camera ${this.camera.title}`)

        return await this.runRequest(
            this.camera.baseUrl,
            {
                Command: "SetWebKeyEvent",
                SessionID: this.camera.sessionId,
                Params: {
                    Kind: "Zoom",
                    Key: "Stop",
                },
            },
            () => console.log(`stopped zoom on camera ${this.camera.title}`),
            error => console.error(`failed to stop zoom on camera ${this.camera.title}`, error),
        )
    }

    async changeColorScheme(scheme: ColorScheme): Promise<void> {
        console.log(`change color scheme for ${this.camera.title} to ${scheme}`)

        return await this.runRequest(
            this.camera.baseUrl,
            {
                Command: "SetWebKeyEvent",
                SessionID: this.camera.sessionId,
                Params: {
                    Kind: "Whb",
                    Key: scheme,
                },
            },
            () => console.log(`changed color scheme for camera ${this.camera.title} to ${scheme}`),
            error => console.error(`failed to change color scheme for camera ${this.camera.title} to ${scheme}`, error),
        )
    }

    async changeAeLevel(levelChange: number): Promise<void> {
        const upOrDown = levelChange < 0 ? '-1' : levelChange > 0 ? '+1' : '0'
        console.log(`change AE level for camera ${this.camera.title} with ${upOrDown}`)

        if (levelChange === 0) return

        return await this.runRequest(
            this.camera.baseUrl,
            {
                Command: "SetWebKeyEvent",
                SessionID: this.camera.sessionId,
                Params: {
                    Kind: "AeLevel",
                    Key: levelChange < 0 ? 'AeLevelDown' : 'AeLevelUp',
                },
            },
            () => console.log(`changed AE level for camera ${this.camera.title} with ${upOrDown}`),
            error => console.error(`failed to change AE level for camera ${this.camera.title} with ${upOrDown}`, error),
        )
    }

    async correctWhiteBalence(): Promise<void> {
        console.log(`correct white balence for camera ${this.camera.title}`)

        return await this.runRequest(
            this.camera.baseUrl,
            {
                Command: "SetWebKeyEvent",
                SessionID: this.camera.sessionId,
                Params: {
                    Kind: "Whb",
                    Key: "Adjust",
                },
            },
            () => console.log(`corrected white balence for camera ${this.camera.title}`),
            error => console.error(`failed to correct white balence for camera ${this.camera.title}`, error),
        )
    }

    async changeWhiteBalence({ blue, red }: WhiteBalanceOverride): Promise<void> {
        console.log(`change white balence for camera ${this.camera.title} to (B=${blue}, R=${red})`)

        for (let i = 0; i < Math.abs(blue); i++) {
            await this.changeWhiteBalanceLevelBlue(Math.sign(blue))
        }

        for (let i = 0; i < Math.abs(red); i++) {
            await this.changeWhiteBalanceLevelRed(Math.sign(red))
        }
    }

    async changeWhiteBalanceLevelBlue(levelChange: number): Promise<void> {
        const upOrDown = levelChange < 0 ? '-1' : levelChange > 0 ? '+1' : '0'
        console.log(`change white balance for camera ${this.camera.title} ON BLUE with ${upOrDown}`)

        if (levelChange === 0) return

        return await this.runRequest(
            this.camera.baseUrl,
            {
                Command: "SetWebKeyEvent",
                SessionID: this.camera.sessionId,
                Params: {
                    Kind: "Whb",
                    Key: levelChange < 0 ? 'WhPaintBM' : 'WhPaintBP',
                },
            },
            () => console.log(`changed white balance for camera ${this.camera.title} ON BLUE with ${upOrDown}`),
            error => console.error(`failed to change white balance for camera ${this.camera.title} ON BLUE with ${upOrDown}`, error),
        )
    }

    async changeWhiteBalanceLevelRed(levelChange: number): Promise<void> {
        const upOrDown = levelChange < 0 ? '-1' : levelChange > 0 ? '+1' : '0'
        console.log(`change white balance for camera ${this.camera.title} ON RED with ${upOrDown}`)

        if (levelChange === 0) return

        return await this.runRequest(
            this.camera.baseUrl,
            {
                Command: "SetWebKeyEvent",
                SessionID: this.camera.sessionId,
                Params: {
                    Kind: "Whb",
                    Key: levelChange < 0 ? 'WhPaintRM' : 'WhPaintRP',
                },
            },
            () => console.log(`changed white balance for camera ${this.camera.title} ON RED with ${upOrDown}`),
            error => console.error(`failed to change white balance for camera ${this.camera.title} ON RED with ${upOrDown}`, error),
        )
    }
}
