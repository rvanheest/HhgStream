import React, { useRef } from "react"
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGear, faFloppyDisk, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import styling from "./CameraPositionTabPane.module.css"
import CameraManualControl from "./CameraManualControl"
import CameraPositionGroup from "./CameraPositionGroup"
import CardTabPane, { TabPaneRef } from "../util/CardTabPane";
import { useCameraPositionGroups, useCameraConfigMode, useSetGroupVisibility, useCameraTitle } from "../../core/cameraStore";
import { useUpdateCameraGroupVisibility } from "../../core/config"

type PositionTabTitleProps = {
    title: string
    hidden: boolean
}

const PositionTabTitle = ({ title, hidden }: PositionTabTitleProps) => {
    const setGroupVisibility = useSetGroupVisibility()

    function toggleVisibility(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        e.stopPropagation()
        setGroupVisibility(title, !hidden)
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
    cameraName: string
    isInConfigMode: boolean
    onClick: () => void
}

const ConfigButton = ({ cameraName, isInConfigMode, onClick }: ConfigButtonProps) => (
    <ToggleButtonGroup type="checkbox" value={isInConfigMode ? ["config"] : []} onChange={onClick}>
        <ToggleButton id={`config-button-${cameraName}`} value="config" variant="outline-secondary" className={`border-0 bg-transparent ${styling.configToggleButton}`}>
            { isInConfigMode
                ? <FontAwesomeIcon icon={faFloppyDisk} />
                : <FontAwesomeIcon icon={faGear} />
            }
        </ToggleButton>
    </ToggleButtonGroup>
)

const besturingTabTitle = "Besturing"

const CameraPositionTabPane = () => {
    const { title: cameraTitle } = useCameraTitle()
    const groups = useCameraPositionGroups()
    const updateCameraGroupVisibility = useUpdateCameraGroupVisibility();
    const [configMode, setConfigMode] = useCameraConfigMode()
    const tabPaneRef = useRef<TabPaneRef>(null);

    const tabs = {
        [besturingTabTitle]: () => <CameraManualControl />,
        ...groups
            .filter(g => configMode || !g.hidden)
            .reduce((obj, {title, positions}) => ({ ...obj, [title]: () => <CameraPositionGroup positions={positions} /> }), {})
    }

    const tabNavLinks = configMode ? {
        ...groups.reduce((obj, {title, hidden}) => ({ ...obj, [title]: () => <PositionTabTitle title={title} hidden={hidden} />}), {})
    } : undefined

    function changeConfigMode() {
        setConfigMode(!configMode)
        if (configMode) {
            updateCameraGroupVisibility(cameraTitle, groups.reduce((obj, g) => ({ ...obj, [g.title]: g.hidden }), {}))
            const tabPane = tabPaneRef.current;
            if (tabPane) {
                const selectedTab = tabPane.getSelectedTab()
                if (groups.find(g => g.title === selectedTab)?.hidden) {
                    tabPane.setSelectedTab(groups.find(g => !g.hidden)?.title ?? besturingTabTitle)
                }
            }
        }
    }

    return (
        <CardTabPane ref={tabPaneRef}
                     defaultOpen={groups.find(g => !g.hidden)?.title ?? besturingTabTitle}
                     tabs={tabs}
                     tabNavLink={tabNavLinks}
                     rightAlignElement={() => <ConfigButton cameraName={cameraTitle} isInConfigMode={configMode} onClick={changeConfigMode} />} />
    )
}

export default CameraPositionTabPane
