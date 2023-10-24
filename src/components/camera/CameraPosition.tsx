import React from "react"
import styling from "./CameraPosition.module.css"
import { Position } from "../../core/config"
import { useCameraConfigMode, useIsPositionActive, useSetCameraPosition, useSetCameraPositionName } from "../../core/cameraStore";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

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
        <div className={`py-2 border ${isCurrentActivePosition ? 'border-danger' : 'border-light'} border-3 rounded-3 bg-dark bg-gradient text-light text-center ${styling.button} ${styling.viewMode}`}
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
    const { register, handleSubmit } = useForm<CameraPositionForm>({ defaultValues: { title: title }, mode: "onBlur" })
    const setCameraPositionName = useSetCameraPositionName()

    function onTitleChange({ title: newTitle }: CameraPositionForm): void {
        if (newTitle !== title) {
            setCameraPositionName(groupId, positionId, newTitle)
        }
    }

    return (
        <div className={`py-2 border border-light border-3 rounded-3 bg-dark bg-gradient ${styling.button}`}>
            <form className="ms-1 me-1" onBlur={handleSubmit(onTitleChange)} onSubmit={handleSubmit(onTitleChange)}>
                <Form.Control
                    className="p-0 ps-1 pe-1 text-center border border-0"
                    {...register("title")}/>
            </form>
        </div>
    )
}

const CameraPosition = ({ groupId, position }: CameraPositionProps) => {
    const [configMode] = useCameraConfigMode()

    return configMode ? <ConfigModeCameraPosition groupId={groupId} position={position} /> : <ViewModeCameraPosition position={position} />
}

export default CameraPosition
