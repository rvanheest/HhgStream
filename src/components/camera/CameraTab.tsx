import React from "react"
import {Col, Row} from "react-bootstrap"
import * as Electron from "electron"
import { getCameraInteraction } from "../../core/camera"
import Camera from "./Camera"
import { useCamerasConfig } from "../../core/config"

const { app: { isPackaged } }: typeof Electron = window.require('@electron/remote')

const CameraTab = () => {
    const cameras = useCamerasConfig()

    return (
        <Row className="row-cols-2 g-2">
            {cameras.map(camera => (
                <Col key={camera.title}>
                    <Camera camera={camera} cameraInteraction={getCameraInteraction(camera, !isPackaged)} />
                </Col>
            ))}
        </Row>
    )
}

export default CameraTab
