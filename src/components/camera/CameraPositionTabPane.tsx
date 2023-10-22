import React, { useRef } from "react"
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGear, faFloppyDisk, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import styling from "./CameraPositionTabPane.module.css"
import CameraManualControl from "./CameraManualControl"
import CameraPositionGroup from "./CameraPositionGroup"
import CardTabPane, { TabPaneRef } from "../util/CardTabPane";
import { useCameraPositionGroups, useCameraConfigMode, useSetGroupVisibility, useCameraId } from "../../core/cameraStore";
import { useCameraConfigModeEnabled, useUpdateCameraGroupVisibility } from "../../core/config"

type ViewModePositionTabTitleProps = {
    title: string
}

const ViewModePositionTabTitle = ({ title }: ViewModePositionTabTitleProps) => (
    <span>{title}</span>
)

type ConfigModePositionTabTitleProps = {
    id: string
    title: string
    hidden: boolean
}

const ConfigModePositionTabTitle = ({ id, title, hidden }: ConfigModePositionTabTitleProps) => {
    const setGroupVisibility = useSetGroupVisibility()

    function toggleVisibility(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        e.stopPropagation()
        setGroupVisibility(id, !hidden)
    }

    return (
        <div>
            <span>{title}</span>
            <span className={`${styling.eye}`} onClick={toggleVisibility}>{
                hidden
                    ? <FontAwesomeIcon className={`${styling.icon}`} icon={faEyeSlash} />
                    : <FontAwesomeIcon className={`${styling.icon}`} icon={faEye} />
            }</span>
        </div>
    )
}

type ConfigButtonProps = {
    cameraId: string
    isInConfigMode: boolean
    onClick: () => void
}

const ConfigButton = ({ cameraId, isInConfigMode, onClick }: ConfigButtonProps) => (
    <ToggleButtonGroup type="checkbox" value={isInConfigMode ? ["config"] : []} onChange={onClick}>
        <ToggleButton id={`config-button-${cameraId}`} value="config" variant="outline-secondary" className={`border-0 bg-transparent ${styling.configToggleButton}`}>
            { isInConfigMode
                ? <FontAwesomeIcon icon={faFloppyDisk} />
                : <FontAwesomeIcon icon={faGear} />
            }
        </ToggleButton>
    </ToggleButtonGroup>
)

const besturingTabTitle = "Besturing"

const CameraPositionTabPane = () => {
    const cameraId = useCameraId()
    const groups = useCameraPositionGroups()
    const updateCameraGroupVisibility = useUpdateCameraGroupVisibility();
    const [configMode, setConfigMode] = useCameraConfigMode()
    const configModeEnabled = useCameraConfigModeEnabled()
    const tabPaneRef = useRef<TabPaneRef>(null);

    const tabs = {
        [besturingTabTitle]: () => <CameraManualControl />,
        ...groups
            .filter(g => configMode || !g.hidden)
            .reduce((obj, {id, positions}) => ({ ...obj, [id]: () => <CameraPositionGroup positions={positions} /> }), {})
    }

    const tabNavLinks = groups.reduce((obj, {id, title, hidden}) => ({
        ...obj,
        [id]: () => configMode
            ? <ConfigModePositionTabTitle id={id} title={title} hidden={hidden} />
            : <ViewModePositionTabTitle title={title} />
    }), {})

    function changeConfigMode() {
        setConfigMode(!configMode)
        if (configMode) {
            updateCameraGroupVisibility(cameraId, groups.reduce((obj, g) => ({ ...obj, [g.id]: g.hidden }), {}))
            const tabPane = tabPaneRef.current;
            if (tabPane) {
                const selectedTab = tabPane.getSelectedTab()
                if (groups.find(g => g.id === selectedTab)?.hidden) {
                    tabPane.setSelectedTab(groups.find(g => !g.hidden)?.id ?? besturingTabTitle)
                }
            }
        }
    }

    return (
        <CardTabPane ref={tabPaneRef}
                     defaultOpen={groups.find(g => !g.hidden)?.id ?? besturingTabTitle}
                     tabs={tabs}
                     tabNavLink={tabNavLinks}
                     rightAlignElement={() => configModeEnabled ? <ConfigButton cameraId={cameraId} isInConfigMode={configMode} onClick={changeConfigMode} /> : undefined} />
    )
}

export default CameraPositionTabPane
