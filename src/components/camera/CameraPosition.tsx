import React from "react"
import { Position } from "../../core/config"

type CameraPositionProps = {
    position: Position
    onSelect: (position: Position) => void
}

const CameraPositionComponent = ({ position, onSelect }: CameraPositionProps) => {
    const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        onSelect(position)
    }

    return (
        <div className="py-2 border border-dark border-2 rounded-4 bg-info bg-gradient bg-opacity-50 text-center"
             style={{cursor: "pointer"}}
             onClick={event => onClick(event)}>
            {position.thumbnail ? <img style={{width: 100}}
                                       src={position.thumbnail}
                                       alt={position.thumbnail} /> : undefined}
            <span>{position.title}</span>
        </div>
    )
}

export default CameraPositionComponent;
