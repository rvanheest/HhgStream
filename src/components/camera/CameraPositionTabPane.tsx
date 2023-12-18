import React, { useEffect, useRef, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faEye, faEyeSlash, faSquarePen } from "@fortawesome/free-solid-svg-icons"
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
    <div className="m-2 text-center"
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
    const [hovering, setHovering] = useState(false)
    const setGroupVisibility = useSetGroupVisibility()
    const deletePositionGroup = useDeletePositionGroup()
    const [title, setTitle] = useCameraPositionGroupTitle(id)
    const { register, control, handleSubmit } = useForm<TitleForm>({ defaultValues: { title: title }, mode: "onBlur" })
    const currentTitle = useWatch({ control: control, name: "title" })
    const [editMode, setEditMode] = useState(currentTitle.length === 0)

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

    function onEditClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
        e.stopPropagation()
        setEditMode(prev => !prev)
    }

    function onEnterComponent(): void {
        setHovering(true)
    }

    function onExitComponent(): void {
        setHovering(false)
    }

    return (
        <div className="p-2" onMouseOver={onEnterComponent} onMouseOut={onExitComponent}>
            {!editMode
                ? <span className={`position-relative ${styling.eye}`} onClick={toggleVisibility}>
                    <FontAwesomeIcon className={`position-absolute text-end ${styling.icon}`} icon={hidden ? faEyeSlash : faEye} />
                </span>
                : undefined
            }
            <span className="d-inline">
                <Form className="d-inline" onBlur={onSubmit} onSubmit={onSubmit}>
                    <Form.Control className="p-0 d-inline text-center"
                                  style={{ width: `${tabWidth(currentTitle)}px` }}
                                  readOnly={!editMode}
                                  plaintext={!editMode}
                                  onClick={onTitleClick}
                                  {...register("title")} />
                </Form>
            </span>
            {hovering && !editMode
                ? <span className={`position-relative ${styling.delete}`} onClick={onDeleteClick}>
                    <FontAwesomeIcon className={`position-absolute text-end ${styling.icon}`} icon={faCircleXmark} />
                </span>
                : undefined
            }
            {hovering || editMode
                ? <span className={`position-relative ${styling.edit}`} onClick={onEditClick}>
                    <FontAwesomeIcon className={`position-absolute text-end ${styling.icon}`} icon={faSquarePen} />
                </span>
                : undefined
            }

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
        </div>
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
        if (tabPane && !configMode) {
            const selectedTab = tabPane.getSelectedTab()
            const tabInGroups = groups.find(g => g.id === selectedTab)
            if (!tabInGroups || tabInGroups.hidden) {
                tabPane.setSelectedTab(groups.find(g => !g.hidden)?.id ?? besturingTabTitle)
            }
        }
    }, [configMode, groups])

    return (
        <CardTabPane ref={tabPaneRef}
                     defaultOpen={groups.find(g => !g.hidden)?.id ?? besturingTabTitle}
                     tabs={tabs}
                     tabNavLink={tabNavLinks}
                     onAddNewTab={configMode ? addNewGroup : undefined}/>
    )
}

export default CameraPositionTabPane
