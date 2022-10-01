import { Camera, Position, WhiteBalance } from "./config"

type CameraCommand = {
    Command: string,
    SessionID: string,
    Params?: any
}

export type CameraStatus = {
    name: string
    aeLevels: {
        changeAllowed: boolean
        value: number
    }
    whiteBalance: {
        changeAllowed: boolean
        blue: number | undefined
        red: number | undefined
    }
}

export function getCameraInteraction(camera: Camera, isDev: boolean): ICameraInteraction {
    console.log(`getCameraInteraction for ${camera.title}; isDev = ${isDev}`)
    return isDev
        ? new DummyCameraInteraction(camera)
        : new CameraInteraction(camera)
}

export interface ICameraInteraction {
    getCameraStatus(): Promise<CameraStatus | undefined>

    moveCamera(position: Position): Promise<void>

    changeAeLevel(levelChange: number): Promise<void>

    correctWhiteBalence(): Promise<void>

    changeWhiteBalence(whiteBalance: WhiteBalance): Promise<void>

    changeWhiteBalanceLevelBlue(levelChange: number): Promise<void>

    changeWhiteBalanceLevelRed(levelChange: number): Promise<void>
}

class DummyCameraInteraction implements ICameraInteraction {
    selectedPosition: Position | undefined = undefined

    aeLevelsChangeAllowed: boolean = false
    aeLevelsValue: number = 0

    whbChangeAllowed: boolean = false
    whbBlueValue: number | undefined = undefined
    whbRedValue: number | undefined = undefined

    constructor(private camera: Camera) {}

    async getCameraStatus(): Promise<CameraStatus | undefined> {
        console.log(`[DEV] check status for ${this.camera.title}`)

        return ({
            name: this.camera.title,
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
        console.log(`[DEV] move camera ${this.camera.title} to position ${position.title}`)
        this.selectedPosition = position

        const isPreekstoelPositie = position.index === 1 || position.index === 8
        this.aeLevelsChangeAllowed = position.index !== 5
        this.aeLevelsValue = isPreekstoelPositie ? 4 : 2
        this.whbChangeAllowed = isPreekstoelPositie
        this.whbBlueValue = isPreekstoelPositie ? -5 : undefined
        this.whbRedValue = isPreekstoelPositie ? 6 : undefined
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

    async changeWhiteBalence({ blue, red }: WhiteBalance): Promise<void> {
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
        const number = Number.parseInt(letter.replace('+', '').replace('-', '').trim())
        return Number.isNaN(number) ? undefined : number
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
                    aeLevels: {
                        changeAllowed: data.Enable.AeLevel.Up && data.Enable.AeLevel.Down,
                        value: this.parseLetter(data.AeLevel.Letter) ?? 0,
                    },
                    whiteBalance: {
                        changeAllowed: data.Enable.Whb.WhPaintRP && data.Enable.Whb.WhPaintRM && data.Enable.Whb.WhPaintBP && data.Enable.Whb.WhPaintBM,
                        blue: this.parseLetter(data.Whb.WhPaintBLetter),
                        red: this.parseLetter(data.Whb.WhPaintRLetter),
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
        console.log(`move camera ${this.camera.title} to position ${title}`)

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

    async changeWhiteBalence({ blue, red }: WhiteBalance): Promise<void> {
        console.log(`change white balence for camera ${this.camera.title} to (B=${blue}, R=${red})`)

        return await this.runRequest(
            this.camera.baseUrl,
            {
                Command: "SetWebKeyEvent",
                SessionID: this.camera.sessionId,
                Params: {
                    Kind: "WhPaintRB",
                    XPosition: blue,
                    YPosition: red,
                },
            },
            () => console.log(`changed white balence for camera ${this.camera.title} to (B=${blue}, R=${red})`),
            error => console.error(`failed to change white balence for camera ${this.camera.title} to (B=${blue}, R=${red})`, error),
        )
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
