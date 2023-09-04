import React from "react"
import styling from "./CameraPosition.module.css"
import { Position } from "../../core/config"
import { useCameraConfigMode, useIsPositionActive, useSetCameraPosition } from "../../core/cameraStore";

type CameraPositionProps = {
    position: Position
}

const CameraPosition = ({ position }: CameraPositionProps) => {
    const onSelect = useSetCameraPosition()
    const isCurrentActivePosition = useIsPositionActive(position.index)
    const [configMode] = useCameraConfigMode()

    async function onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): Promise<void> {
        event.stopPropagation();
        if (!configMode) await onSelect(position)
    }

    return (
        <div className={`py-2 border ${isCurrentActivePosition ? 'border-danger' : 'border-light'} border-3 rounded-3 bg-dark bg-gradient text-light text-center ${styling.button}`}
             onClick={onClick}>
            {position.thumbnail ? <img style={{width: 100}}
                                   src={position.thumbnail}
                                   alt={position.thumbnail} /> : undefined}
            <span>{position.title}</span>
        </div>
    )
}

export default CameraPosition
