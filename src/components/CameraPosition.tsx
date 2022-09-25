import React from "react"
import styles from "./CameraPosition.module.css"
import { Position } from "../core/config"

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
        <div className={`${styles.position} p-2`} onClick={event => onClick(event)}>
            {position.thumbnail ? <img className={`${styles.thumbnail}`}
                                       src={position.thumbnail}
                                       alt={position.thumbnail} /> : undefined}
            <div>{position.title}</div>
        </div>
    )
}

export default CameraPositionComponent;
