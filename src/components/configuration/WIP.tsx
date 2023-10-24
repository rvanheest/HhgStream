import React from "react"
import { Button, ToggleButton } from "react-bootstrap"
import { useCameraConfigModeEnabled, useConfig, useSetCameraConfigModeEnabled } from "../../core/config"
import { getConfigPath, openFile } from "../../core/utils"

const WIP = () => {
    const config = useConfig()
    const configMode = useCameraConfigModeEnabled();
    const setConfigMode = useSetCameraConfigModeEnabled();

    return (
        <div>
            <h3 className="text-center">WORK IN PROGRESS</h3>
            <p className="text-center fst-italic">Hier kan de configuratie worden ingesteld.</p>
            <Button className="me-1" onClick={async () => await openFile(getConfigPath())}>Open configuratie</Button>
            <ToggleButton className="ms-1"
                          id="configMode-checkbox"
                          type="checkbox"
                          variant={`${configMode ? 'success' : 'danger'}`}
                          checked={configMode}
                          value="0"
                          onChange={e => setConfigMode(e.currentTarget.checked)}>
                Configuratie modus
            </ToggleButton>
            <div className="border border-secondary border-3 rounded-2 mt-3">
                <pre className="mb-0" style={{maxHeight: "calc(100vh - 145px)"}}>{JSON.stringify(config, null, 2)}</pre>
            </div>
        </div>
    )
}

export default WIP
