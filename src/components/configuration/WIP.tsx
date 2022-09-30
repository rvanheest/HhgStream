import React from "react"
import { AppConfig } from "../../core/config"
import * as Electron from "electron"
import { getConfigPath } from "../../core/utils"

const { shell }: typeof Electron = window.require('@electron/remote')

type WipProps = {
    config: AppConfig
}

const WIP = ({ config }: WipProps) => {
    return (
        <div>
            <h3 className="text-center">WORK IN PROGRESS</h3>
            <p className="text-center fst-italic">Hier kan de configuratie worden ingesteld.</p>
            <button type="button" className="btn btn-primary" onClick={() => shell.openExternal(getConfigPath())}>Open configuratie</button>
            <div className="border border-secondary border-3 rounded-2 mt-3">
                <pre className="mb-0" style={{maxHeight: "calc(100vh - 145px)"}}>{JSON.stringify(config, null, 2)}</pre>
            </div>
        </div>
    )
}

export default WIP
