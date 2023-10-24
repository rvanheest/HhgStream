import React, { useRef } from "react"
import { Form, ToggleButton, ToggleButtonGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGear, faFloppyDisk, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import styling from "./CameraPositionTabPane.module.css"
import CameraManualControl from "./CameraManualControl"
import CameraPositionGroup from "./CameraPositionGroup"
import CardTabPane, { TabPaneRef } from "../util/CardTabPane";
import {
    useCameraPositionGroups,
    useCameraConfigMode,
    useSetGroupVisibility,
    useCameraId,
    useCameraPositionGroupTitle,
    useCameraTitle,
} from "../../core/cameraStore";
import { useCameraConfigModeEnabled, useUpdateConfigCamera } from "../../core/config"
import {useForm, useWatch} from "react-hook-form"

type ViewModePositionTabTitleProps = {
    title: string
}

const ViewModePositionTabTitle = ({ title }: ViewModePositionTabTitleProps) => (
    <div style={{ paddingTop: 0.8, paddingBottom: 0.8 }}>{title}</div>
)

type ConfigModePositionTabTitleProps = {
    id: string
    hidden: boolean
}

type TitleForm = {
    title: string
}

const ConfigModePositionTabTitle = ({ id, hidden }: ConfigModePositionTabTitleProps) => {
    const setGroupVisibility = useSetGroupVisibility()
    const [title, setTitle] = useCameraPositionGroupTitle(id)
    const { register, control, handleSubmit } = useForm<TitleForm>({ defaultValues: { title: title }, mode: "onBlur" })
    const textWidth = useWatch({ control: control, name: "title" }).length

    function onTitleChange({title: newTitle}: TitleForm): void {
        if (newTitle !== title) {
            setTitle(id, newTitle)
        }
    }

    function onTitleClick(e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        e.stopPropagation()
    }

    function toggleVisibility(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        e.stopPropagation()
        setGroupVisibility(id, !hidden)
    }

    return (
        <div>
            <span className="d-inline">
                <form className="d-inline" onBlur={handleSubmit(onTitleChange)}>
                    <Form.Control style={{ width: `calc(${textWidth}ch + 0.5rem)`, marginLeft: "calc(0.8px - 0.5rem)", marginRight: "calc(0.8px - 0.5rem)" }}
                                  className="p-0 ps-1 pe-1 d-inline text-center"
                                  onClick={onTitleClick}
                                  {...register("title")} />
                </form>
            </span>
            <span className={`${styling.eye}`} onClick={toggleVisibility}>{
                hidden
                    ? <FontAwesomeIcon className={`${styling.icon}`} icon={faEyeSlash} />
                    : <FontAwesomeIcon className={`${styling.icon}`} icon={faEye} />
            }</span>
        </div>
    )
}

type ConfigButtonProps = {
    onSave: () => void
}

const ConfigButton = ({ onSave }: ConfigButtonProps) => {
    const cameraId = useCameraId()
    const [isInConfigMode, setConfigMode] = useCameraConfigMode()
    const [title] = useCameraTitle()
    const groups = useCameraPositionGroups()
    const updateCameraInConfig = useUpdateConfigCamera()

    function onToggle(): void {
        setConfigMode(!isInConfigMode)
        if (isInConfigMode) {
            updateCameraInConfig(cameraId, title, groups)
            onSave()
        }
    }

    return (
        <ToggleButtonGroup type="checkbox" value={isInConfigMode ? ["config"] : []} onChange={onToggle}>
            <ToggleButton id={`config-button-${cameraId}`} value="config" variant="outline-secondary" className={`border-0 bg-transparent ${styling.configToggleButton}`}>
                { isInConfigMode
                    ? <FontAwesomeIcon icon={faFloppyDisk} />
                    : <FontAwesomeIcon icon={faGear} />
                }
            </ToggleButton>
        </ToggleButtonGroup>
    )
}

const besturingTabTitle = "Besturing"

const CameraPositionTabPane = () => {
    const groups = useCameraPositionGroups()
    const [configMode] = useCameraConfigMode()
    const configModeEnabled = useCameraConfigModeEnabled()
    const tabPaneRef = useRef<TabPaneRef>(null);

    const tabs = {
        [besturingTabTitle]: () => <CameraManualControl />,
        ...groups
            .filter(g => configMode || !g.hidden)
            .reduce((obj, {id, positions}) => ({ ...obj, [id]: () => <CameraPositionGroup groupId={id} positions={positions} /> }), {})
    }

    const tabNavLinks = groups.reduce((obj, {id, title, hidden}) => ({
        ...obj,
        [id]: () => configMode
            ? <ConfigModePositionTabTitle id={id} hidden={hidden} />
            : <ViewModePositionTabTitle title={title} />
    }), {})

    // when we exit config mode, we want to change to a different tab when the currently selected tab has become hidden
    function onSaveConfig() {
        const tabPane = tabPaneRef.current;
        if (tabPane) {
            const selectedTab = tabPane.getSelectedTab()
            if (groups.find(g => g.id === selectedTab)?.hidden) {
                tabPane.setSelectedTab(groups.find(g => !g.hidden)?.id ?? besturingTabTitle)
            }
        }
    }

    return (
        <CardTabPane ref={tabPaneRef}
                     defaultOpen={groups.find(g => !g.hidden)?.id ?? besturingTabTitle}
                     tabs={tabs}
                     tabNavLink={tabNavLinks}
                     rightAlignElement={() => configModeEnabled ? <ConfigButton onSave={onSaveConfig} /> : undefined} />
    )
}

export default CameraPositionTabPane
