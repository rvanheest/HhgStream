import React from "react"
import styles from "./Camera.module.css"
import CameraPosition from "./CameraPosition"
import { Camera, Position } from "../core/config"
import { moveCamera } from "../core/camera"

type CameraProps = {
    camera: Camera
}

const CameraComponent = ({ camera }: CameraProps) => {
    async function onPositionClick(position: Position) {
        await moveCamera(camera, position)
    }

    return (
        <div className={`${styles.camera} py-1`}>
            <h1 className="px-2 py-1">{camera.title}</h1>
            <p className={`${styles.description}`}>{camera.baseUrl}</p>
            <div className="container py-1">
                <div className="row row-cols-3 align-items-center g-2">
                    {camera.positions.map(position => (
                        <div className="col">
                            <CameraPosition position={position} onSelect={p => onPositionClick(p)} key={`${camera.title}-${position.title}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CameraComponent;
