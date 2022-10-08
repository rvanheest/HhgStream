import React from "react"
import styling from "./CameraPosition.module.css"
import { Position } from "../../core/config"

type CameraPositionProps = {
    position: Position
    onSelect: (position: Position) => Promise<void>
}

const CameraPosition = ({ position, onSelect }: CameraPositionProps) => {
    async function onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): Promise<void> {
        event.stopPropagation();
        await onSelect(position)
    }

    return (
        <div className={`py-2 border border-light border-2 rounded-3 bg-dark bg-gradient text-light text-center ${styling.button}`}
             onClick={event => onClick(event)}>
            {position.thumbnail ? <img style={{width: 100}}
                                       src={position.thumbnail}
                                       alt={position.thumbnail} /> : undefined}
            <span>{position.title}</span>
        </div>
    )
}

export default CameraPosition;
