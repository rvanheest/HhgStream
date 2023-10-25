import React, { useEffect, useRef } from "react"
import { Form } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import styling from "./CameraPositionTabPane.module.css"
import CameraManualControl from "./CameraManualControl"
import CameraPositionGroup from "./CameraPositionGroup"
import CardTabPane, { TabPaneRef } from "../util/CardTabPane";
import { useCameraPositionGroups, useCameraConfigMode, useSetGroupVisibility, useCameraPositionGroupTitle } from "../../core/cameraStore";
import {useForm, useWatch} from "react-hook-form"

function tabWidth(text: string): number {
    return (text.length + 1) * 8
}

type ViewModePositionTabTitleProps = {
    title: string
}

const ViewModePositionTabTitle = ({ title }: ViewModePositionTabTitleProps) => (
    <div className="text-center"
         style={{
             width: `${tabWidth(title)}px`,
             paddingTop: 0.8,
             paddingBottom: 0.8,
         }}>
        {title}
    </div>
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
    const textWidth = useWatch({ control: control, name: "title" })

    const onSubmit = handleSubmit(onTitleChange)

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
        <>
            <span className="d-inline">
                <form className="d-inline" onBlur={onSubmit} onSubmit={onSubmit}>
                    <Form.Control className="p-0 d-inline text-center"
                                  style={{ width: `${tabWidth(textWidth)}px` }}
                                  onClick={onTitleClick}
                                  {...register("title")} />
                </form>
            </span>
            <span className={`${styling.eye}`} onClick={toggleVisibility}>{
                hidden
                    ? <FontAwesomeIcon className={`${styling.icon}`} icon={faEyeSlash} />
                    : <FontAwesomeIcon className={`${styling.icon}`} icon={faEye} />
            }</span>
        </>
    )
}

const besturingTabTitle = "Besturing"

const CameraPositionTabPane = () => {
    const groups = useCameraPositionGroups()
    const [configMode] = useCameraConfigMode()
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
    }), {[besturingTabTitle]: () => <ViewModePositionTabTitle title={besturingTabTitle} />})

    useEffect(() => {
        if (!configMode) {
            const tabPane = tabPaneRef.current;
            if (tabPane) {
                const selectedTab = tabPane.getSelectedTab()
                if (groups.find(g => g.id === selectedTab)?.hidden) {
                    tabPane.setSelectedTab(groups.find(g => !g.hidden)?.id ?? besturingTabTitle)
                }
            }
        }
    }, [configMode, groups])

    return (
        <CardTabPane ref={tabPaneRef}
                     defaultOpen={groups.find(g => !g.hidden)?.id ?? besturingTabTitle}
                     tabs={tabs}
                     tabNavLink={tabNavLinks} />
    )
}

export default CameraPositionTabPane
