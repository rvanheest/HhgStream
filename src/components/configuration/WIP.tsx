import React from "react"
import { Button } from "react-bootstrap"
import { AppConfig } from "../../core/config"
import { getConfigPath, openFile } from "../../core/utils"

type WipProps = {
    config: AppConfig
}

const WIP = ({ config }: WipProps) => {
    return (
        <div>
            <h3 className="text-center">WORK IN PROGRESS</h3>
            <p className="text-center fst-italic">Hier kan de configuratie worden ingesteld.</p>
            <Button onClick={async () => await openFile(getConfigPath())}>Open configuratie</Button>
            <div className="border border-secondary border-3 rounded-2 mt-3">
                <pre className="mb-0" style={{maxHeight: "calc(100vh - 145px)"}}>{JSON.stringify(config, null, 2)}</pre>
            </div>
        </div>
    )
}

export default WIP
