import React, { useState } from "react"
import styling from "./CameraPosition.module.css"
import { Position } from "../../core/config"
import {
    useCameraConfigMode,
    useDeleteCameraPosition,
    useIsPositionActive,
    useSetCameraPosition,
    useSetCameraPositionName
} from "../../core/cameraStore";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";

type CameraPositionProps = {
    groupId: string
    position: Position
}

const ViewModeCameraPosition = ({ position }: Pick<CameraPositionProps, "position">) => {
    const setCameraPosition = useSetCameraPosition()
    const isCurrentActivePosition = useIsPositionActive(position.index)

    async function onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): Promise<void> {
        event.stopPropagation();
        await setCameraPosition(position)
    }

    return (
        <div className={`py-2 border ${isCurrentActivePosition ? 'border-danger' : 'border-light'} border-3 rounded-3 bg-dark bg-gradient text-light text-center ${styling.viewMode}`}
             onClick={onClick}>
            {position.thumbnail ? <img style={{width: 100}}
                                   src={position.thumbnail}
                                   alt={position.thumbnail} /> : undefined}
            <span>{position.title}</span>
        </div>
    )
}

type CameraPositionForm = {
    title: string
}

const ConfigModeCameraPosition = ({ groupId, position: { id: positionId, title } }: CameraPositionProps) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const { register, handleSubmit } = useForm<CameraPositionForm>({ defaultValues: { title: title }, mode: "onBlur" })
    const onSubmit = handleSubmit(onTitleChange)
    const setCameraPositionName = useSetCameraPositionName()
    const deleteCameraPosition = useDeleteCameraPosition()

    function onTitleChange({ title: newTitle }: CameraPositionForm): void {
        if (newTitle !== title) {
            setCameraPositionName(groupId, positionId, newTitle)
        }
    }

    function onDeleteClick(): void {
        setShowDeleteModal(true)
    }

    function onCancelDelete(): void {
        setShowDeleteModal(false)
    }

    function onDeleteConfirmed(): void {
        deleteCameraPosition(groupId, positionId)
        setShowDeleteModal(false)
    }

    return (
        <>
            <div className="py-2 border border-light border-3 rounded-3 bg-dark bg-gradient position-relative">
                <form className="ms-1 me-1" onBlur={onSubmit} onSubmit={onSubmit}>
                    <Form.Control className="p-0 text-center border border-0" {...register("title")}/>
                </form>
                <Button variant="outline-danger"
                        className={`p-0 text-end position-absolute top-0 end-0 border-0 rounded-5 bg-dark ${styling.deleteButton}`}
                        onClick={onDeleteClick}>
                    <FontAwesomeIcon icon={faCircleXmark} />
                </Button>
            </div>

            <Modal show={showDeleteModal} onHide={onCancelDelete} animation={false} centered>
                <Modal.Header closeButton />
                <Modal.Body>Weet u zeker dat u positie {title} wilt verwijderen?</Modal.Body>
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

const CameraPosition = ({ groupId, position }: CameraPositionProps) => {
    const [configMode] = useCameraConfigMode()

    return configMode ? <ConfigModeCameraPosition groupId={groupId} position={position} /> : <ViewModeCameraPosition position={position} />
}

export default CameraPosition
