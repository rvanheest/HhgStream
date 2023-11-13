import React, { useEffect, useRef, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import styling from "./CameraPositionTabPane.module.css"
import CameraManualControl from "./CameraManualControl"
import CameraPositionGroup from "./CameraPositionGroup"
import CardTabPane, { TabPaneRef } from "../util/CardTabPane";
import {
    useCameraPositionGroups,
    useCameraConfigMode,
    useSetGroupVisibility,
    useCameraPositionGroupTitle,
    useAddNewPositionGroup,
    useDeletePositionGroup,
} from "../../core/cameraStore";
import { useForm, useWatch } from "react-hook-form"

function tabWidth(text: string): number {
    return (Math.max(3, text.length) + 1) * 8
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
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const setGroupVisibility = useSetGroupVisibility()
    const deletePositionGroup = useDeletePositionGroup()
    const [title, setTitle] = useCameraPositionGroupTitle(id)
    const { register, control, handleSubmit } = useForm<TitleForm>({ defaultValues: { title: title }, mode: "onBlur" })
    const currentTitle = useWatch({ control: control, name: "title" })

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

    function onDeleteClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        e.stopPropagation()
        setShowDeleteModal(true)
    }

    function onCancelDelete(): void {
        setShowDeleteModal(false)
    }

    function onDeleteConfirmed(): void {
        deletePositionGroup(id)
        setShowDeleteModal(false)
    }

    return (
        <>
            <span className={`${styling.eye}`} onClick={toggleVisibility}>{
                hidden
                    ? <FontAwesomeIcon className={`${styling.icon}`} icon={faEyeSlash} />
                    : <FontAwesomeIcon className={`${styling.icon}`} icon={faEye} />
            }</span>
            <span className="d-inline">
                <form className="d-inline" onBlur={onSubmit} onSubmit={onSubmit}>
                    <Form.Control className="p-0 d-inline text-center"
                                  style={{ width: `${tabWidth(currentTitle)}px` }}
                                  onClick={onTitleClick}
                                  {...register("title")} />
                </form>
            </span>
            <span className={`${styling.delete}`} onClick={onDeleteClick}>
                <FontAwesomeIcon className={`${styling.icon}`} icon={faCircleXmark} />
            </span>

            <Modal show={showDeleteModal} onHide={onCancelDelete} animation={false} centered>
                <Modal.Header closeButton />
                <Modal.Body>Weet u zeker dat u positiegroep {currentTitle.length > 0 ? currentTitle : "<leeg>"} wilt verwijderen?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCancelDelete}>
                        Nee
                    </Button>
                    <Button variant="primary" onClick={onDeleteConfirmed}>
                        Ja
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const besturingTabTitle = "Besturing"

const CameraPositionTabPane = () => {
    const groups = useCameraPositionGroups()
    const addNewGroup = useAddNewPositionGroup()
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
        const tabPane = tabPaneRef.current;
        if (tabPane) {
            const selectedTab = tabPane.getSelectedTab()
            const tabInGroups = groups.find(g => g.id === selectedTab)
            if (!tabInGroups || tabInGroups.hidden) {
                tabPane.setSelectedTab(groups.find(g => !g.hidden)?.id ?? besturingTabTitle)
            }
        }
    }, [groups])

    return (
        <CardTabPane ref={tabPaneRef}
                     defaultOpen={groups.find(g => !g.hidden)?.id ?? besturingTabTitle}
                     tabs={tabs}
                     tabNavLink={tabNavLinks}
                     onAddNewTab={configMode ? addNewGroup : undefined}/>
    )
}

export default CameraPositionTabPane
