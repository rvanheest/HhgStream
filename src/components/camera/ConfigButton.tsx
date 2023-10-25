import React from "react"
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFloppyDisk, faGear } from "@fortawesome/free-solid-svg-icons"
import styling from "./ConfigButton.module.css"
import { useCameraConfigMode, useCameraId, useCameraPositionGroups, useCameraTitle } from "../../core/cameraStore"
import { useUpdateConfigCamera } from "../../core/config";

const ConfigButton = () => {
    const cameraId = useCameraId()
    const [isInConfigMode, setConfigMode] = useCameraConfigMode()
    const [title] = useCameraTitle()
    const groups = useCameraPositionGroups()
    const updateCameraInConfig = useUpdateConfigCamera()

    function onToggle(): void {
        setConfigMode(!isInConfigMode)
        if (isInConfigMode) {
            updateCameraInConfig(cameraId, title, groups)
        }
    }

    return (
        <ToggleButtonGroup type="checkbox" value={isInConfigMode ? ["config"] : []} onChange={onToggle}>
            <ToggleButton id={`config-button-${cameraId}`}
                value="config"
                variant="outline-secondary"
                className={`border-0 bg-transparent px-1 py-0 ${styling.configToggleButton}`}>{
                isInConfigMode
                    ? <FontAwesomeIcon icon={faFloppyDisk} />
                    : <FontAwesomeIcon icon={faGear} />
            }</ToggleButton>
        </ToggleButtonGroup>
    )
}

export default ConfigButton
